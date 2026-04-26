"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getActiveKidId } from "./active-kid";
import { recordResult } from "./progress-db";
import type { Track } from "./tracks";
import type { ThemeSlug } from "./themes";

/** Submit a text production. Stored as 'pending' until a parent approves
 * it inline (re-auth via password on the kid's screen). */
export async function submitTextProduction(
  track: Track,
  theme: ThemeSlug,
  levelId: number,
  content: string,
  minChars: number,
): Promise<
  | { ok: true; submissionId: string }
  | { ok: false; error: string }
> {
  const trimmed = content.trim();
  if (trimmed.length < minChars) {
    return {
      ok: false,
      error: `El texto debe tener al menos ${minChars} caracteres`,
    };
  }

  const kidId = await getActiveKidId();
  if (!kidId) return { ok: false, error: "Sin perfil activo" };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("text_submissions")
    .insert({
      kid_id: kidId,
      track,
      theme,
      level_id: levelId,
      content: trimmed,
      min_chars: minChars,
    })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Error" };

  return { ok: true, submissionId: data.id };
}

/** Approve a text submission inline (parent enters password on the kid's
 * screen). On success, marks the submission approved AND records the
 * level as passed. */
export async function approveTextSubmission(
  submissionId: string,
  password: string,
  levelMinScore: number,
): Promise<
  | { ok: true; passed: boolean; stars: number }
  | { ok: false; error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return { ok: false, error: "No autenticado" };

  // Verify password
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });
  if (authError) return { ok: false, error: "Contraseña incorrecta" };

  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("text_submissions")
    .select("id, kid_id, track, theme, level_id, status")
    .eq("id", submissionId)
    .maybeSingle();
  if (!sub) return { ok: false, error: "Submission no encontrada" };

  // Verify the kid belongs to this parent
  const { data: kid } = await admin
    .from("kids")
    .select("parent_id")
    .eq("id", sub.kid_id)
    .maybeSingle();
  if (!kid || kid.parent_id !== user.id) {
    return { ok: false, error: "Este perfil no es de tu familia" };
  }

  // Mark approved
  const { error: updErr } = await admin
    .from("text_submissions")
    .update({
      status: "approved",
      reviewer_type: "parent",
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", submissionId);
  if (updErr) return { ok: false, error: updErr.message };

  // Record progress: full score (10/10) since approved.
  const result = await recordResult(
    sub.track as Track,
    sub.theme as ThemeSlug,
    sub.level_id,
    10,
    10,
    levelMinScore,
  );
  revalidatePath("/");
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, passed: result.passed, stars: result.stars };
}

/** Reject a text submission inline. Parent enters password + feedback. */
export async function rejectTextSubmission(
  submissionId: string,
  password: string,
  feedback: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmedFeedback = feedback.trim();
  if (trimmedFeedback.length === 0 || trimmedFeedback.length > 200) {
    return { ok: false, error: "El feedback es obligatorio (máx. 200 chars)" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return { ok: false, error: "No autenticado" };

  const { error: authError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });
  if (authError) return { ok: false, error: "Contraseña incorrecta" };

  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("text_submissions")
    .select("id, kid_id")
    .eq("id", submissionId)
    .maybeSingle();
  if (!sub) return { ok: false, error: "Submission no encontrada" };

  const { data: kid } = await admin
    .from("kids")
    .select("parent_id")
    .eq("id", sub.kid_id)
    .maybeSingle();
  if (!kid || kid.parent_id !== user.id) {
    return { ok: false, error: "Este perfil no es de tu familia" };
  }

  const { error: updErr } = await admin
    .from("text_submissions")
    .update({
      status: "rejected",
      reviewer_type: "parent",
      feedback: trimmedFeedback,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", submissionId);
  if (updErr) return { ok: false, error: updErr.message };

  return { ok: true };
}
