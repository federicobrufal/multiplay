"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Character } from "@/components/Mascot";
import type { MascotVariant } from "@/lib/mascots";
import { useI18n } from "@/lib/i18n/context";
import { audio } from "@/lib/audio";
import { logoutAction } from "../(auth)/actions";
import { enterParentMode } from "@/lib/parent-mode";

export interface KidCard {
  id: string;
  name: string;
  grade: number;
  mascot: MascotVariant;
  passedLevels: number;
  coinsBalance: number;
}

export default function KidsPickerClient({
  parentName,
  kids,
  isSuperAdmin,
  onSelect,
}: {
  parentName: string;
  kids: KidCard[];
  isSuperAdmin: boolean;
  onSelect: (kidId: string) => Promise<void>;
}) {
  const { t } = useI18n();
  const [pending, startTransition] = useTransition();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            {t("kids.welcome_parent", { name: parentName })}
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
            {t("kids.who_plays")}
          </h1>
        </div>
        <ParentSettingsMenu />
      </header>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {kids.map((k) => (
          <li key={k.id}>
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => onSelect(k.id))}
              className="flex w-full flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm ring-2 ring-slate-200 transition hover:-translate-y-0.5 hover:ring-brand-500 hover:shadow-md active:scale-[0.98] disabled:opacity-60"
            >
              <Character variant={k.mascot} size="md" />
              <p className="text-base font-black text-slate-900">{k.name}</p>
              <p className="text-[11px] font-semibold text-slate-500">
                {t(`grade.${k.grade}`)}
              </p>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                <span>🪙 {k.coinsBalance}</span>
                <span>·</span>
                <span>{k.passedLevels} niv.</span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {isSuperAdmin && (
        <Link
          href="/admin"
          className="mt-8 flex items-center justify-between rounded-2xl bg-rose-600 px-4 py-3 ring-1 ring-rose-700 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-rose-200">
              {t("kids.super_admin_title")}
            </p>
            <p className="text-sm font-black text-white">
              {t("kids.super_admin_sub")}
            </p>
          </div>
          <span className="text-rose-200">→</span>
        </Link>
      )}
    </main>
  );
}

function ParentSettingsMenu() {
  const { t, locale, toggleLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMuted(audio.isMuted());
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function onParentMode() {
    setOpen(false);
    setShowPasswordModal(true);
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
        aria-label={t("home.settings")}
        aria-expanded={open}
      >
        ⚙️
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-30 w-60 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
          <button
            type="button"
            onClick={() => {
              toggleLocale();
              setOpen(false);
            }}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            <span className="flex items-center gap-2">
              <span className="text-base">🌐</span>
              {t("home.lang_toggle")}
            </span>
            <span className="text-xs font-black uppercase text-slate-500">
              {locale === "es" ? "ES" : "EN"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              const m = audio.toggleMute();
              setMuted(m);
              if (!m) audio.playMusic("menu");
            }}
            className="flex w-full items-center justify-between border-t border-slate-100 px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            <span className="flex items-center gap-2">
              <span className="text-base">{muted ? "🔇" : "🔊"}</span>
              {muted ? t("home.sound_unmute") : t("home.sound_mute")}
            </span>
          </button>
          <button
            type="button"
            onClick={onParentMode}
            className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            <span className="text-base">🛠</span>
            {t("home.parent_mode")}
          </button>
          <form action={logoutAction} className="border-t border-slate-100">
            <button
              type="submit"
              className="flex w-full items-center gap-2 px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50"
            >
              <span className="text-base">🚪</span>
              {t("home.logout")}
            </button>
          </form>
        </div>
      )}
      {showPasswordModal && (
        <ParentPasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}

function ParentPasswordModal({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!password.trim()) {
      setError(t("kids.parent_mode_password_required"));
      return;
    }
    startTransition(async () => {
      const res = await enterParentMode(password);
      if (res.ok) {
        router.push("/family");
      } else {
        setError(res.error);
        setPassword("");
        inputRef.current?.focus();
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-3xl">🛠</span>
          <div>
            <h2 className="text-lg font-black text-slate-900">
              {t("home.parent_mode")}
            </h2>
            <p className="text-xs text-slate-600">
              {t("kids.parent_mode_prompt")}
            </p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            ref={inputRef}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.password_placeholder")}
            className="w-full rounded-xl bg-slate-50 px-3 py-3 text-sm font-semibold ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500"
          />
          {error && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 ring-1 ring-rose-200">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={pending}
              className="flex-1 rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
            >
              {t("kids.parent_mode_cancel")}
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 rounded-xl bg-brand-500 px-3 py-2 text-sm font-black text-white shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              {pending
                ? t("kids.parent_mode_verifying")
                : t("kids.parent_mode_submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
