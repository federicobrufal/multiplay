"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const COOKIE_NAME = "parent_mode_until";
const SESSION_SECONDS = 600; // 10 minutes

/** Verify the parent's password (re-authentication) and unlock parent
 * mode for the next 10 minutes via a session cookie. */
export async function enterParentMode(
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!password) return { ok: false, error: "Falta la contraseña" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return { ok: false, error: "No autenticado" };

  // signInWithPassword refreshes the session for the SAME user, which
  // is harmless here. If the password is wrong, returns an error.
  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });
  if (error) return { ok: false, error: "Contraseña incorrecta" };

  const until = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const store = await cookies();
  store.set(COOKIE_NAME, String(until), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: SESSION_SECONDS,
  });
  return { ok: true };
}

/** Whether parent mode is currently unlocked (cookie present and not expired). */
export async function isParentModeUnlocked(): Promise<boolean> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return false;
  const until = Number(raw);
  if (!Number.isFinite(until)) return false;
  return until > Math.floor(Date.now() / 1000);
}

/** Clear the parent-mode unlock cookie (e.g. on logout or "exit parent mode"). */
export async function exitParentMode(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
