import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminUsername } from "@/lib/admin";
import { coinsForLevel, walletBalance } from "@/lib/coins";
import { isTrack, type Track } from "@/lib/tracks";
import { isValidTheme } from "@/lib/themes";
import AdminClient, { type AdminKid } from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();
  if (!isAdminUsername(me?.username)) redirect("/");

  const admin = createAdminClient();
  const [
    { data: profiles },
    { data: kids },
    { data: progressRows },
    { data: redemptions },
  ] = await Promise.all([
    admin.from("profiles").select("id, username"),
    admin.from("kids").select("id, parent_id, name, grade, created_at"),
    admin
      .from("progress")
      .select("kid_id, level_id, track, theme, passed")
      .eq("passed", true),
    admin.from("coin_redemptions").select("kid_id, amount"),
  ]);

  const passedByKid = new Map<string, number>();
  const earnedByKid = new Map<string, number>();
  for (const row of progressRows ?? []) {
    passedByKid.set(row.kid_id, (passedByKid.get(row.kid_id) ?? 0) + 1);
    if (!isTrack(row.track)) continue;
    const track = row.track as Track;
    if (!isValidTheme(track, row.theme)) continue;
    const coins = coinsForLevel(track, row.theme, row.level_id);
    earnedByKid.set(
      row.kid_id,
      (earnedByKid.get(row.kid_id) ?? 0) + coins,
    );
  }

  const redeemedByKid = new Map<string, number>();
  for (const row of redemptions ?? []) {
    redeemedByKid.set(
      row.kid_id,
      (redeemedByKid.get(row.kid_id) ?? 0) + (row.amount ?? 0),
    );
  }

  const parentNameById = new Map<string, string>();
  for (const p of profiles ?? []) parentNameById.set(p.id, p.username);

  const adminKids: AdminKid[] = (kids ?? [])
    .map((k) => {
      const earned = earnedByKid.get(k.id) ?? 0;
      const redeemed = redeemedByKid.get(k.id) ?? 0;
      return {
        id: k.id,
        name: k.name,
        grade: k.grade ?? 1,
        parentId: k.parent_id,
        parentName: parentNameById.get(k.parent_id) ?? "(sin nombre)",
        levelsPassed: passedByKid.get(k.id) ?? 0,
        coinsEarned: earned,
        coinsRedeemed: redeemed,
        coinsBalance: walletBalance(earned, redeemed),
      };
    })
    .sort((a, b) => {
      const byParent = a.parentName.localeCompare(b.parentName);
      return byParent !== 0 ? byParent : a.name.localeCompare(b.name);
    });

  return <AdminClient kids={adminKids} />;
}
