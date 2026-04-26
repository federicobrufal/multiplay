"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const COOKIE_NAME = "active_kid_id";
const COOKIE_MAX_AGE_DAYS = 30;

/** Read the active kid id from the cookie. Does not validate ownership. */
export async function readActiveKidIdCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

/** Set the active kid cookie (caller is responsible for ownership check). */
export async function setActiveKidIdCookie(kidId: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, kidId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * COOKIE_MAX_AGE_DAYS,
  });
}

/** Clear the active kid cookie (e.g. on "switch profile"). */
export async function clearActiveKidIdCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Resolve the active kid for the current logged-in parent. Returns
 * null if no auth user, no cookie, or the cookie's kid does not belong
 * to the current parent (stale cookie after logout/swap). */
export async function getActiveKidId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const cookieId = await readActiveKidIdCookie();
  if (!cookieId) return null;

  const { data: kid } = await supabase
    .from("kids")
    .select("id")
    .eq("id", cookieId)
    .eq("parent_id", user.id)
    .maybeSingle();
  return kid?.id ?? null;
}
