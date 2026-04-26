"use server";

import { createClient } from "@/lib/supabase/server";
import { coinsEarned, walletBalance } from "./coins";
import { getActiveKidId } from "./active-kid";
import { loadProgressForKid } from "./progress-db";

export interface Wallet {
  earned: number;
  redeemed: number;
  balance: number;
}

export async function loadWallet(): Promise<Wallet> {
  const kidId = await getActiveKidId();
  if (!kidId) return { earned: 0, redeemed: 0, balance: 0 };
  return loadWalletForKid(kidId);
}

export async function loadWalletForKid(kidId: string): Promise<Wallet> {
  const progress = await loadProgressForKid(kidId);
  const earned = coinsEarned(progress);

  const supabase = await createClient();
  const { data } = await supabase
    .from("coin_redemptions")
    .select("amount")
    .eq("kid_id", kidId);

  const redeemed = (data ?? []).reduce(
    (sum, r) => sum + (r.amount ?? 0),
    0,
  );
  return { earned, redeemed, balance: walletBalance(earned, redeemed) };
}
