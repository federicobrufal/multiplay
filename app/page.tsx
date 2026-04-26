import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadProgress } from "@/lib/progress-db";
import { loadWallet } from "@/lib/wallet";
import { getActiveKidId } from "@/lib/active-kid";
import { getMascotForLevel, DEFAULT_MASCOT } from "@/lib/mascots";
import { isAdminUsername } from "@/lib/admin";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const kidId = await getActiveKidId();
  if (!kidId) redirect("/kids");

  const { data: kid } = await supabase
    .from("kids")
    .select("name, grade, selected_mascot_id")
    .eq("id", kidId)
    .maybeSingle();
  if (!kid) redirect("/kids");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  const [progress, wallet] = await Promise.all([
    loadProgress(),
    loadWallet(),
  ]);

  const selectedMascot =
    getMascotForLevel(kid.selected_mascot_id) ?? DEFAULT_MASCOT;

  return (
    <HomeClient
      username={kid.name}
      grade={kid.grade ?? 1}
      progress={progress}
      wallet={wallet}
      selectedMascot={selectedMascot}
      userId={kidId}
      isAdmin={isAdminUsername(profile?.username)}
    />
  );
}
