import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminUsername } from "@/lib/admin";
import { listMyKids, selectActiveKid } from "@/lib/kids-db";
import { getMascotForLevel, DEFAULT_MASCOT } from "@/lib/mascots";
import { coinsEarned, walletBalance } from "@/lib/coins";
import { loadProgressForKid } from "@/lib/progress-db";
import KidsPickerClient, { type KidCard } from "./KidsPickerClient";

export const dynamic = "force-dynamic";

async function selectKidAction(kidId: string) {
  "use server";
  const res = await selectActiveKid(kidId);
  if (res.ok) redirect("/");
}

export default async function KidsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  const kids = await listMyKids();

  // First-run UX: parent has zero kids → send them to /family to create one.
  if (kids.length === 0) {
    redirect("/family?firstrun=1");
  }

  const cards: KidCard[] = await Promise.all(
    kids.map(async (k) => {
      const progress = await loadProgressForKid(k.id);
      const earned = coinsEarned(progress);
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
      const mascot = getMascotForLevel(k.selectedMascotId) ?? DEFAULT_MASCOT;
      return {
        id: k.id,
        name: k.name,
        grade: k.grade,
        mascot,
        passedLevels: passed,
        coinsBalance: walletBalance(earned, 0), // redemptions not loaded here for speed
      };
    }),
  );

  return (
    <KidsPickerClient
      parentName={profile?.username ?? "padre"}
      kids={cards}
      isSuperAdmin={isAdminUsername(profile?.username)}
      onSelect={selectKidAction}
    />
  );
}
