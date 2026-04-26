import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { coinsEarned, walletBalance } from "@/lib/coins";
import { listMyKids } from "@/lib/kids-db";
import { loadProgressForKid } from "@/lib/progress-db";
import { isParentModeUnlocked } from "@/lib/parent-mode";
import FamilyClient, { type FamilyKid } from "./FamilyClient";

export const dynamic = "force-dynamic";

export default async function FamilyPage({
  searchParams,
}: {
  searchParams: Promise<{ firstrun?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Parent mode requires password re-auth (unlocked from /kids menu).
  // First-run users get a free pass since there are no kids yet.
  const firstRun = params.firstrun === "1";
  if (!firstRun) {
    const unlocked = await isParentModeUnlocked();
    if (!unlocked) redirect("/kids");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  const kids = await listMyKids();

  const cards: FamilyKid[] = await Promise.all(
    kids.map(async (k) => {
      const progress = await loadProgressForKid(k.id);
      const earned = coinsEarned(progress);
      const { data: redemptionsRows } = await supabase
        .from("coin_redemptions")
        .select("amount")
        .eq("kid_id", k.id);
      const redeemed = (redemptionsRows ?? []).reduce(
        (sum, r) => sum + (r.amount ?? 0),
        0,
      );
      const passed = Object.values(progress.results).reduce(
        (sum, themes) => {
          let n = 0;
          for (const theme of Object.keys(themes)) {
            for (const r of Object.values(themes[theme])) {
              if (r.passed) n++;
            }
          }
          return sum + n;
        },
        0,
      );
      return {
        id: k.id,
        name: k.name,
        grade: k.grade,
        levelsPassed: passed,
        coinsEarned: earned,
        coinsRedeemed: redeemed,
        coinsBalance: walletBalance(earned, redeemed),
      };
    }),
  );

  return (
    <FamilyClient
      parentName={profile?.username ?? "padre"}
      kids={cards}
      firstRun={firstRun}
    />
  );
}
