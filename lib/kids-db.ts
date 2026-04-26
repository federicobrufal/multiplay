"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  clearActiveKidIdCookie,
  setActiveKidIdCookie,
} from "./active-kid";

export interface Kid {
  id: string;
  parentId: string;
  name: string;
  grade: number;
  selectedMascotId: number;
  createdAt: string;
}

const KID_NAME_RE = /^.{1,30}$/;
const MIN_GRADE = 1;
const MAX_GRADE = 7;

function isValidGrade(g: unknown): g is number {
  return Number.isInteger(g) && (g as number) >= MIN_GRADE && (g as number) <= MAX_GRADE;
}

/** All kids belonging to the current logged-in parent. */
export async function listMyKids(): Promise<Kid[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("kids")
    .select("id, parent_id, name, grade, selected_mascot_id, created_at")
    .eq("parent_id", user.id)
    .order("created_at", { ascending: true });

  return (data ?? []).map((k) => ({
    id: k.id,
    parentId: k.parent_id,
    name: k.name,
    grade: k.grade ?? 1,
    selectedMascotId: k.selected_mascot_id,
    createdAt: k.created_at,
  }));
}

/** Create a kid for the current parent. Grade is required (1-7). */
export async function createKid(
  name: string,
  grade: number,
): Promise<{ ok: true; kid: Kid } | { ok: false; error: string }> {
  const trimmed = name.trim();
  if (!KID_NAME_RE.test(trimmed)) {
    return { ok: false, error: "El nombre debe tener entre 1 y 30 caracteres" };
  }
  if (!isValidGrade(grade)) {
    return { ok: false, error: "Grado inválido (debe ser 1-7)" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("kids")
    .insert({ parent_id: user.id, name: trimmed, grade })
    .select("id, parent_id, name, grade, selected_mascot_id, created_at")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Error" };

  revalidatePath("/family");
  revalidatePath("/kids");
  return {
    ok: true,
    kid: {
      id: data.id,
      parentId: data.parent_id,
      name: data.name,
      grade: data.grade,
      selectedMascotId: data.selected_mascot_id,
      createdAt: data.created_at,
    },
  };
}

/** Update a kid's grade. */
export async function setKidGrade(
  kidId: string,
  grade: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isValidGrade(grade)) {
    return { ok: false, error: "Grado inválido (debe ser 1-7)" };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const admin = createAdminClient();
  const { data: kid } = await admin
    .from("kids")
    .select("parent_id")
    .eq("id", kidId)
    .maybeSingle();
  if (!kid || kid.parent_id !== user.id) {
    return { ok: false, error: "Hijo inválido" };
  }

  const { error } = await admin
    .from("kids")
    .update({ grade })
    .eq("id", kidId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/family");
  revalidatePath("/kids");
  return { ok: true };
}

/** Rename a kid (only if it belongs to the current parent). */
export async function renameKid(
  kidId: string,
  name: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmed = name.trim();
  if (!KID_NAME_RE.test(trimmed)) {
    return { ok: false, error: "El nombre debe tener entre 1 y 30 caracteres" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const admin = createAdminClient();
  // Ensure the kid belongs to the current parent.
  const { data: kid } = await admin
    .from("kids")
    .select("parent_id")
    .eq("id", kidId)
    .maybeSingle();
  if (!kid || kid.parent_id !== user.id) {
    return { ok: false, error: "Hijo inválido" };
  }

  const { error } = await admin
    .from("kids")
    .update({ name: trimmed })
    .eq("id", kidId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/family");
  revalidatePath("/kids");
  return { ok: true };
}

/** Delete a kid and cascade their progress + redemptions. */
export async function deleteKid(
  kidId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const admin = createAdminClient();
  const { data: kid } = await admin
    .from("kids")
    .select("parent_id")
    .eq("id", kidId)
    .maybeSingle();
  if (!kid || kid.parent_id !== user.id) {
    return { ok: false, error: "Hijo inválido" };
  }

  const { error } = await admin.from("kids").delete().eq("id", kidId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/family");
  revalidatePath("/kids");
  return { ok: true };
}

/** Set the active kid (called when a kid avatar is clicked on /kids). */
export async function selectActiveKid(
  kidId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const { data: kid } = await supabase
    .from("kids")
    .select("id")
    .eq("id", kidId)
    .eq("parent_id", user.id)
    .maybeSingle();
  if (!kid) return { ok: false, error: "Hijo inválido" };

  await setActiveKidIdCookie(kid.id);
  revalidatePath("/");
  return { ok: true };
}

/** Clear the active kid (used by "switch profile"). */
export async function clearActiveKid(): Promise<void> {
  await clearActiveKidIdCookie();
}

/** Switch profile: clear active kid and redirect to /kids. */
export async function switchProfileAction(): Promise<void> {
  await clearActiveKidIdCookie();
  redirect("/kids");
}

/** Update the active kid's selected mascot. */
export async function setKidSelectedMascot(
  kidId: string,
  mascotId: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!Number.isInteger(mascotId) || mascotId < 1 || mascotId > 100) {
    return { ok: false, error: "Mascota inválida" };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const admin = createAdminClient();
  const { data: kid } = await admin
    .from("kids")
    .select("parent_id")
    .eq("id", kidId)
    .maybeSingle();
  if (!kid || kid.parent_id !== user.id) {
    return { ok: false, error: "Hijo inválido" };
  }

  const { error } = await admin
    .from("kids")
    .update({ selected_mascot_id: mascotId })
    .eq("id", kidId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/library");
  return { ok: true };
}
