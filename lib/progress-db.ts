"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  computeStars,
  emptyProgress,
  ensureBucket,
  unlockedMascotCount,
  type Progress,
} from "./progress-helpers";
import { coinsForLevel } from "./coins";
import { isTrack, type Track } from "./tracks";
import { isValidTheme, type ThemeSlug } from "./themes";
import { getActiveKidId } from "./active-kid";

/** Load progress for the active kid. Returns empty progress if there
 * is no active kid yet (e.g. before picking one). */
export async function loadProgress(): Promise<Progress> {
  const kidId = await getActiveKidId();
  if (!kidId) return emptyProgress();
  return loadProgressForKid(kidId);
}

/** Same as loadProgress but for an explicit kid id (used by admin). */
export async function loadProgressForKid(kidId: string): Promise<Progress> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("progress")
    .select("level_id, track, theme, score, total, passed, stars, updated_at")
    .eq("kid_id", kidId);

  const out = emptyProgress();
  for (const row of data ?? []) {
    if (!isTrack(row.track)) continue;
    const track = row.track as Track;
    const theme = (row.theme ?? "") as ThemeSlug;
    if (!isValidTheme(track, theme)) continue;
    ensureBucket(out, track, theme);
    out.results[track][theme][row.level_id] = {
      score: row.score,
      total: row.total,
      passed: row.passed,
      at: new Date(row.updated_at).getTime(),
    };
    out.stars[track][theme][row.level_id] = row.stars;
  }
  return out;
}

export async function recordResult(
  track: Track,
  theme: ThemeSlug,
  levelId: number,
  score: number,
  total: number,
  minScore: number,
): Promise<
  | {
      ok: true;
      passed: boolean;
      stars: number;
      coinsEarned: number;
      newlyUnlockedMascotIds: number[];
    }
  | { ok: false; error: string }
> {
  const kidId = await getActiveKidId();
  if (!kidId) return { ok: false, error: "Sin perfil activo" };

  const supabase = await createClient();
  const passed = score >= minScore;
  const stars = computeStars(score, total);

  const { data: existing } = await supabase
    .from("progress")
    .select("passed, stars")
    .eq("kid_id", kidId)
    .eq("level_id", levelId)
    .eq("track", track)
    .eq("theme", theme)
    .maybeSingle();

  const wasPassedBefore = existing?.passed === true;
  const finalPassed = wasPassedBefore || passed;
  const finalStars = Math.max(existing?.stars ?? 0, stars);

  // Capture pre-update mascot count so we can detect new unlocks.
  const beforeProgress = await loadProgressForKid(kidId);
  const beforeUnlocked = unlockedMascotCount(beforeProgress);

  const { error } = await supabase.from("progress").upsert(
    {
      kid_id: kidId,
      level_id: levelId,
      track,
      theme,
      score,
      total,
      passed: finalPassed,
      stars: finalStars,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "kid_id,level_id,track,theme" },
  );
  if (error) return { ok: false, error: error.message };

  // Re-read post-update to compute newly unlocked mascots.
  const afterProgress = await loadProgressForKid(kidId);
  const afterUnlocked = unlockedMascotCount(afterProgress);

  const newlyUnlockedMascotIds: number[] = [];
  for (let i = beforeUnlocked + 1; i <= afterUnlocked; i++) {
    newlyUnlockedMascotIds.push(i);
  }

  // Coins are awarded only on the FIRST successful pass of a level.
  const coinsEarned =
    !wasPassedBefore && finalPassed
      ? coinsForLevel(track, theme, levelId)
      : 0;

  revalidatePath("/");
  return {
    ok: true,
    passed: finalPassed,
    stars: finalStars,
    coinsEarned,
    newlyUnlockedMascotIds,
  };
}

/** Reset progress + redemptions for the active kid. */
export async function resetProgress() {
  const kidId = await getActiveKidId();
  if (!kidId) return;

  const admin = createAdminClient();
  await admin.from("progress").delete().eq("kid_id", kidId);
  await admin.from("coin_redemptions").delete().eq("kid_id", kidId);
  await admin
    .from("kids")
    .update({ selected_mascot_id: 1 })
    .eq("id", kidId);
  revalidatePath("/");
}

/** Selected mascot for the active kid (1 if none / no active kid). */
export async function getSelectedMascotId(): Promise<number> {
  const kidId = await getActiveKidId();
  if (!kidId) return 1;
  const supabase = await createClient();
  const { data } = await supabase
    .from("kids")
    .select("selected_mascot_id")
    .eq("id", kidId)
    .maybeSingle();
  return data?.selected_mascot_id ?? 1;
}

export async function selectMascot(
  mascotId: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!Number.isInteger(mascotId) || mascotId < 1 || mascotId > 100) {
    return { ok: false, error: "Mascota inválida" };
  }
  const kidId = await getActiveKidId();
  if (!kidId) return { ok: false, error: "Sin perfil activo" };

  if (mascotId !== 1) {
    const progress = await loadProgressForKid(kidId);
    const unlocked = unlockedMascotCount(progress);
    if (mascotId > unlocked) return { ok: false, error: "Mascota bloqueada" };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("kids")
    .update({ selected_mascot_id: mascotId })
    .eq("id", kidId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/library");
  return { ok: true };
}
