import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getSelectedMascotId,
  loadProgress,
  selectMascot,
} from "@/lib/progress-db";
import { unlockedMascotCount } from "@/lib/progress-helpers";
import LibraryPageClient from "./LibraryPageClient";

export const dynamic = "force-dynamic";

async function selectMascotAction(id: number) {
  "use server";
  await selectMascot(id);
}

export default async function LibraryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [progress, selectedId] = await Promise.all([
    loadProgress(),
    getSelectedMascotId(),
  ]);

  const unlockedCount = unlockedMascotCount(progress);
  const unlocked = Array.from({ length: unlockedCount }, (_, i) => i + 1);

  return (
    <LibraryPageClient
      selectedId={selectedId}
      unlocked={unlocked}
      unlockedCount={unlockedCount}
      onSelect={selectMascotAction}
    />
  );
}
