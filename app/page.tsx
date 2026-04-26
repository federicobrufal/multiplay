import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadProgress } from "@/lib/progress-db";
import { loadWallet } from "@/lib/wallet";
import { getActiveKidId } from "@/lib/active-kid";
import { getMascotForLevel, DEFAULT_MASCOT } from "@/lib/mascots";
import { isAdminUsername } from "@/lib/admin";
import { trackFromParam, type Track } from "@/lib/tracks";
import { isValidTheme } from "@/lib/themes";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ track?: string; theme?: string }>;
}) {
  const params = await searchParams;
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

  // Restore navigation state from query params (used by "Volver al mapa"
  // after finishing a level, so the kid lands back on the theme's level list).
  const initialTrack: Track | null = trackFromParam(params.track);
  const initialTheme: string | null =
    initialTrack && params.theme && isValidTheme(initialTrack, params.theme)
      ? params.theme
      : null;

  return (
    <HomeClient
      username={kid.name}
      grade={kid.grade ?? 1}
      progress={progress}
      wallet={wallet}
      selectedMascot={selectedMascot}
      userId={kidId}
      isAdmin={isAdminUsername(profile?.username)}
      initialTrack={initialTrack}
      initialTheme={initialTheme}
    />
  );
}
