"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  createKid as createKidDb,
  deleteKid as deleteKidDb,
  renameKid as renameKidDb,
  setKidGrade as setKidGradeDb,
} from "@/lib/kids-db";

async function requireParentOfKid(
  kidId: string,
): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
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
  return { ok: true, userId: user.id };
}

export async function familyCreateKid(
  formData: FormData,
): Promise<void> {
  const name = String(formData.get("name") ?? "");
  const grade = parseInt(String(formData.get("grade") ?? ""), 10);
  await createKidDb(name, grade);
}

export async function familyRenameKid(
  kidId: string,
  newName: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  return renameKidDb(kidId, newName);
}

export async function familySetKidGrade(
  kidId: string,
  grade: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  return setKidGradeDb(kidId, grade);
}

export async function familyDeleteKid(
  kidId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  return deleteKidDb(kidId);
}

/** Redeem coins from a kid. Logs the amount and reason. */
export async function familyRedeemCoins(
  kidId: string,
  amount: number,
  reason: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const gate = await requireParentOfKid(kidId);
  if (!gate.ok) return gate;

  if (!Number.isInteger(amount) || amount <= 0) {
    return { ok: false, error: "El monto debe ser un entero positivo" };
  }
  const trimmed = reason.trim();
  if (trimmed.length === 0 || trimmed.length > 200) {
    return { ok: false, error: "El motivo es obligatorio (máx. 200 chars)" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("coin_redemptions").insert({
    kid_id: kidId,
    amount,
    reason: trimmed,
  });
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}

export async function backToKids(): Promise<void> {
  redirect("/kids");
}
