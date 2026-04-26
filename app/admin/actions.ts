"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminUsername } from "@/lib/admin";

async function requireSuperAdmin(): Promise<
  { ok: true; userId: string } | { ok: false; error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();
  if (!isAdminUsername(profile?.username)) {
    return { ok: false, error: "Acceso denegado" };
  }
  return { ok: true, userId: user.id };
}

export async function adminChangePassword(
  targetParentId: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const gate = await requireSuperAdmin();
  if (!gate.ok) return gate;

  if (!newPassword || newPassword.length < 4) {
    return { ok: false, error: "La contraseña debe tener 4+ caracteres" };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(targetParentId, {
    password: newPassword,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Reset a kid's progress + redemptions (super-admin only). */
export async function adminResetKid(
  kidId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const gate = await requireSuperAdmin();
  if (!gate.ok) return gate;

  const admin = createAdminClient();
  await admin.from("progress").delete().eq("kid_id", kidId);
  await admin.from("coin_redemptions").delete().eq("kid_id", kidId);
  await admin.from("kids").update({ selected_mascot_id: 1 }).eq("id", kidId);

  revalidatePath("/admin");
  revalidatePath("/family");
  return { ok: true };
}

/** Subtract coins from a kid's wallet, super-admin override.
 * Family panel uses `familyRedeemCoins` instead. */
export async function adminRedeemCoins(
  kidId: string,
  amount: number,
  reason: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const gate = await requireSuperAdmin();
  if (!gate.ok) return gate;

  if (!Number.isInteger(amount) || amount <= 0) {
    return { ok: false, error: "El monto debe ser un entero positivo" };
  }
  const trimmedReason = reason.trim();
  if (trimmedReason.length === 0 || trimmedReason.length > 200) {
    return { ok: false, error: "El motivo es obligatorio (máx. 200 chars)" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("coin_redemptions").insert({
    kid_id: kidId,
    amount,
    reason: trimmedReason,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  revalidatePath("/family");
  revalidatePath("/");
  return { ok: true };
}
