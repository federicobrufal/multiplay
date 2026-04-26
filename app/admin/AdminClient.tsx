"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  adminChangePassword,
  adminRedeemCoins,
  adminResetKid,
} from "./actions";
import { useI18n } from "@/lib/i18n/context";

export interface AdminKid {
  id: string;
  name: string;
  grade: number;
  parentId: string;
  parentName: string;
  levelsPassed: number;
  coinsEarned: number;
  coinsRedeemed: number;
  coinsBalance: number;
}

export default function AdminClient({ kids }: { kids: AdminKid[] }) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(
    null,
  );

  function showToast(kind: "ok" | "err", msg: string) {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 3500);
  }

  function onChangePassword(parentId: string, parentName: string) {
    const pw = window.prompt(t("admin.new_password_prompt", { name: parentName }));
    if (pw === null) return;
    const trimmed = pw.trim();
    if (trimmed.length < 4) {
      showToast("err", t("admin.pw_too_short"));
      return;
    }
    startTransition(async () => {
      const res = await adminChangePassword(parentId, trimmed);
      if (res.ok) showToast("ok", t("admin.pw_changed", { name: parentName }));
      else showToast("err", `❌ ${res.error}`);
    });
  }

  function onResetKid(k: AdminKid) {
    if (!window.confirm(t("admin.reset_confirm", { name: k.name }))) return;
    startTransition(async () => {
      const res = await adminResetKid(k.id);
      if (res.ok) {
        showToast("ok", t("admin.reset_done", { name: k.name }));
        router.refresh();
      } else showToast("err", `❌ ${res.error}`);
    });
  }

  function onRedeem(k: AdminKid) {
    if (k.coinsBalance <= 0) {
      showToast("err", t("admin.redeem_no_balance"));
      return;
    }
    const amountStr = window.prompt(
      t("admin.redeem_amount_prompt", {
        name: k.name,
        balance: k.coinsBalance,
      }),
    );
    if (amountStr === null) return;
    const amount = parseInt(amountStr.trim(), 10);
    if (!Number.isInteger(amount) || amount <= 0) {
      showToast("err", t("admin.redeem_bad_amount"));
      return;
    }
    if (amount > k.coinsBalance) {
      showToast(
        "err",
        t("admin.redeem_over_balance", { balance: k.coinsBalance }),
      );
      return;
    }
    const reason = window.prompt(t("admin.redeem_reason_prompt"));
    if (reason === null) return;
    const trimmed = reason.trim();
    if (trimmed.length === 0) {
      showToast("err", t("admin.redeem_reason_required"));
      return;
    }
    startTransition(async () => {
      const res = await adminRedeemCoins(k.id, amount, trimmed);
      if (res.ok) {
        showToast(
          "ok",
          t("admin.redeem_done", {
            n: amount,
            name: k.name,
            reason: trimmed,
          }),
        );
        router.refresh();
      } else showToast("err", `❌ ${res.error}`);
    });
  }

  // Group kids by parent for display.
  const grouped = kids.reduce<
    Map<string, { parentId: string; parentName: string; kids: AdminKid[] }>
  >((acc, k) => {
    const entry =
      acc.get(k.parentId) ??
      { parentId: k.parentId, parentName: k.parentName, kids: [] };
    entry.kids.push(k);
    acc.set(k.parentId, entry);
    return acc;
  }, new Map());

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 pb-24">
      <div className="flex items-center gap-3">
        <Link
          href="/kids"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-lg font-black text-white shadow-md shadow-brand-500/30 ring-1 ring-brand-600 active:scale-95"
          aria-label={t("topbar.back")}
        >
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {t("admin.title")}
          </h1>
          <p className="text-sm text-slate-600">
            {t("admin.super_subtitle", { n: grouped.size, k: kids.length })}
          </p>
        </div>
      </div>

      {toast && (
        <div
          className={`mt-4 rounded-xl px-4 py-2 text-sm font-bold ring-1 ${
            toast.kind === "ok"
              ? "bg-brand-50 text-brand-700 ring-brand-200"
              : "bg-rose-50 text-rose-700 ring-rose-200"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="mt-6 space-y-5">
        {Array.from(grouped.values()).map((family) => (
          <section
            key={family.parentId}
            className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
          >
            <header className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {t("admin.family_label")}
                </p>
                <p className="text-lg font-black text-slate-900">
                  {family.parentName}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onChangePassword(family.parentId, family.parentName)
                }
                disabled={pending}
                className="rounded-xl bg-blue-500 px-3 py-2 text-xs font-black text-white shadow-sm active:scale-[0.98] disabled:opacity-50"
              >
                {t("admin.change_password")}
              </button>
            </header>

            <ul className="space-y-2">
              {family.kids.map((k) => (
                <li
                  key={k.id}
                  className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-base font-black text-slate-900">
                        {k.name}
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        {t(`grade.${k.grade}`)} ·{" "}
                        {t("admin.levels_passed", { n: k.levelsPassed })}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold">
                        <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-yellow-800 ring-1 ring-yellow-200">
                          🪙 {k.coinsBalance}
                        </span>
                        <span className="text-slate-500">
                          {t("admin.coins_breakdown", {
                            earned: k.coinsEarned,
                            redeemed: k.coinsRedeemed,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onRedeem(k)}
                        disabled={pending || k.coinsBalance <= 0}
                        className="rounded-xl bg-yellow-500 px-3 py-2 text-xs font-black text-white shadow-sm active:scale-[0.98] disabled:opacity-50"
                      >
                        {t("admin.redeem_button")}
                      </button>
                      <button
                        type="button"
                        onClick={() => onResetKid(k)}
                        disabled={pending}
                        className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-black text-white shadow-sm active:scale-[0.98] disabled:opacity-50"
                      >
                        {t("admin.reset_game")}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {grouped.size === 0 && (
          <p className="rounded-2xl bg-slate-50 p-4 text-center text-sm text-slate-500 ring-1 ring-slate-200">
            {t("admin.no_users")}
          </p>
        )}
      </div>
    </main>
  );
}
