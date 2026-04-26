"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  familyCreateKid,
  familyDeleteKid,
  familyRedeemCoins,
  familyRenameKid,
  familySetKidGrade,
} from "./actions";

export interface FamilyKid {
  id: string;
  name: string;
  grade: number;
  levelsPassed: number;
  coinsEarned: number;
  coinsRedeemed: number;
  coinsBalance: number;
}

const GRADES = [1, 2, 3, 4, 5, 6, 7] as const;

export default function FamilyClient({
  parentName,
  kids,
  firstRun,
}: {
  parentName: string;
  kids: FamilyKid[];
  firstRun: boolean;
}) {
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

  function onRename(k: FamilyKid) {
    const name = window.prompt(
      t("family.rename_prompt", { name: k.name }),
      k.name,
    );
    if (name === null) return;
    startTransition(async () => {
      const res = await familyRenameKid(k.id, name);
      if (res.ok) {
        showToast("ok", t("family.rename_done"));
        router.refresh();
      } else showToast("err", `❌ ${res.error}`);
    });
  }

  function onChangeGrade(k: FamilyKid) {
    const cur = k.grade;
    const input = window.prompt(
      t("family.grade_prompt", { name: k.name }),
      String(cur),
    );
    if (input === null) return;
    const g = parseInt(input.trim(), 10);
    if (!Number.isInteger(g) || g < 1 || g > 7) {
      showToast("err", t("family.grade_invalid"));
      return;
    }
    startTransition(async () => {
      const res = await familySetKidGrade(k.id, g);
      if (res.ok) {
        showToast("ok", t("family.grade_done"));
        router.refresh();
      } else showToast("err", `❌ ${res.error}`);
    });
  }

  function onDelete(k: FamilyKid) {
    if (!window.confirm(t("family.delete_confirm", { name: k.name }))) return;
    startTransition(async () => {
      const res = await familyDeleteKid(k.id);
      if (res.ok) {
        showToast("ok", t("family.delete_done", { name: k.name }));
        router.refresh();
      } else showToast("err", `❌ ${res.error}`);
    });
  }

  function onRedeem(k: FamilyKid) {
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
      const res = await familyRedeemCoins(k.id, amount, trimmed);
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

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 pb-24">
      <header className="flex items-center gap-3">
        <Link
          href="/kids"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-lg font-black text-white shadow-md shadow-brand-500/30 ring-1 ring-brand-600 active:scale-95"
          aria-label={t("topbar.back")}
        >
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {t("family.title")}
          </h1>
          <p className="text-sm text-slate-600">
            {t("family.subtitle", { name: parentName })}
          </p>
        </div>
      </header>

      {firstRun && (
        <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-900 ring-1 ring-amber-200">
          {t("family.firstrun_msg")}
        </div>
      )}

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

      <section className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">
          {t("family.add_kid_title")}
        </h2>
        <form
          action={async (fd) => {
            await familyCreateKid(fd);
            router.refresh();
          }}
          className="mt-2 flex flex-wrap gap-2"
        >
          <input
            name="name"
            type="text"
            placeholder={t("family.add_kid_placeholder")}
            minLength={1}
            maxLength={30}
            required
            className="min-w-0 flex-1 rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500"
          />
          <select
            name="grade"
            required
            defaultValue=""
            className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500"
          >
            <option value="" disabled>
              {t("family.grade_placeholder")}
            </option>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {t(`grade.${g}`)}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-black text-white shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {t("family.add_kid_button")}
          </button>
        </form>
      </section>

      <ul className="mt-6 space-y-3">
        {kids.length === 0 && (
          <li className="rounded-2xl bg-slate-50 p-4 text-center text-sm text-slate-500 ring-1 ring-slate-200">
            {t("family.no_kids")}
          </li>
        )}
        {kids.map((k) => (
          <li
            key={k.id}
            className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-lg font-black text-slate-900">{k.name}</p>
                <p className="text-xs font-semibold text-slate-500">
                  {t(`grade.${k.grade}`)} ·{" "}
                  {t("admin.levels_passed", { n: k.levelsPassed })}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
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
                  onClick={() => onRename(k)}
                  disabled={pending}
                  className="rounded-xl bg-blue-500 px-3 py-2 text-xs font-black text-white shadow-sm active:scale-[0.98] disabled:opacity-50"
                >
                  {t("family.rename_button")}
                </button>
                <button
                  type="button"
                  onClick={() => onChangeGrade(k)}
                  disabled={pending}
                  className="rounded-xl bg-purple-500 px-3 py-2 text-xs font-black text-white shadow-sm active:scale-[0.98] disabled:opacity-50"
                >
                  {t("family.grade_button")}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(k)}
                  disabled={pending}
                  className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-black text-white shadow-sm active:scale-[0.98] disabled:opacity-50"
                >
                  {t("family.delete_button")}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
