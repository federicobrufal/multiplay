"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  findLearnLevelFor,
  formatLevelSubtitle,
  formatLevelTitle,
  totalLevels,
  type Level,
  type MathLevel,
  type LanguageLevel,
} from "@/lib/curriculum";
import {
  buildQuestions,
  type Question,
  type TextProductionQuestion,
} from "@/lib/questions";
import {
  approveTextSubmission,
  rejectTextSubmission,
  submitTextProduction,
} from "@/lib/text-submissions-db";
import { computeStars } from "@/lib/progress-helpers";
import { recordResult } from "@/lib/progress-db";
import { Character, Mascot } from "@/components/Mascot";
import { getMascotForLevel, type MascotVariant } from "@/lib/mascots";
import { audio } from "@/lib/audio";
import { loadCurrentStreak, saveStreak } from "@/lib/streak";
import { useI18n } from "@/lib/i18n/context";
import type { Track } from "@/lib/tracks";

const CELEBRATE_MOVES = [
  "animate-mv-jump",
  "animate-mv-boing",
  "animate-mv-shimmy",
] as const;

type Stage = "intro" | "playing" | "result";
type TFn = (key: string, vars?: Record<string, string | number>) => string;
type OptionValue = number | string;

function isCorrectAnswer(q: Question, option: OptionValue): boolean {
  if (q.type === "math" || q.type === "language") {
    return option === q.answer;
  }
  // input/order/match/text-production: not yet wired up to the
  // auto-advance flow. Each will need its own state machine.
  return false;
}

/** True if the question type is currently playable. New types render
 * a "Próximamente" stub until their component is built. */
function isPlayable(q: Question): boolean {
  return q.type === "math" || q.type === "language";
}

export default function LevelPlayer({
  level,
  track,
  theme,
  selectedMascot,
  userId,
}: {
  level: Level;
  track: Track;
  theme: string;
  selectedMascot: MascotVariant;
  userId: string;
}) {
  const [stage, setStage] = useState<Stage>(level.showIntro ? "intro" : "playing");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<Question[]>([]);
  const [locked, setLocked] = useState(false);
  const [picked, setPicked] = useState<OptionValue | null>(null);
  const [streak, setStreak] = useState(0);
  const [, startTransition] = useTransition();
  const [reward, setReward] = useState<{
    coinsEarned: number;
    newlyUnlockedMascotIds: number[];
  }>({ coinsEarned: 0, newlyUnlockedMascotIds: [] });

  useEffect(() => {
    setQuestions(buildQuestions(level));
    setIdx(0);
    setScore(0);
    setWrong([]);
    setPicked(null);
    setLocked(false);
    setStage(level.showIntro ? "intro" : "playing");
  }, [level.id, level.track, level.showIntro]);

  useEffect(() => {
    setStreak(loadCurrentStreak(userId));
  }, [userId]);

  useEffect(() => {
    saveStreak(userId, streak);
  }, [streak, userId]);

  useEffect(() => {
    audio.init();
    audio.playMusic("menu");
    return () => audio.stopAll();
  }, []);

  useEffect(() => {
    if (stage === "playing") {
      audio.playMusic("game");
    } else if (stage === "intro") {
      audio.playMusic("menu");
    }
  }, [stage]);

  function start() {
    setStage("playing");
  }

  function onPick(option: OptionValue) {
    if (locked) return;
    const q = questions[idx];
    const correct = isCorrectAnswer(q, option);
    setPicked(option);
    setLocked(true);
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
      setWrong((ws) => [...ws, q]);
    }
    setTimeout(
      () => {
        if (idx + 1 >= questions.length) {
          const finalScore = score + (correct ? 1 : 0);
          const passed = finalScore >= level.minScore;
          startTransition(async () => {
            const res = await recordResult(
              track,
              theme,
              level.id,
              finalScore,
              questions.length,
              level.minScore,
            );
            if (res.ok) {
              setReward({
                coinsEarned: res.coinsEarned,
                newlyUnlockedMascotIds: res.newlyUnlockedMascotIds,
              });
            }
          });
          audio.stopMusic();
          audio.playSfx(passed ? "win" : "lose");
          setStage("result");
        } else {
          setIdx((i) => i + 1);
          setPicked(null);
          setLocked(false);
        }
      },
      correct ? 550 : 1100,
    );
  }

  function retry() {
    setQuestions(buildQuestions(level));
    setIdx(0);
    setScore(0);
    setWrong([]);
    setPicked(null);
    setLocked(false);
    setStage("playing");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-4 py-4 sm:max-w-2xl sm:px-6 sm:py-6">
      {stage === "intro" && (
        <Intro level={level} selectedMascot={selectedMascot} onStart={start} />
      )}
      {stage === "playing" &&
        questions[idx] &&
        questions[idx].type === "text-production" && (
          <TextProductionStage
            level={level}
            track={track}
            theme={theme}
            question={questions[idx] as TextProductionQuestion}
            selectedMascot={selectedMascot}
            onPassed={() => {
              setScore(1);
              audio.stopMusic();
              audio.playSfx("win");
              setStage("result");
            }}
          />
        )}
      {stage === "playing" &&
        questions[idx] &&
        questions[idx].type !== "text-production" && (
          <Playing
            level={level}
            question={questions[idx]}
            index={idx}
            total={questions.length}
            score={score}
            streak={streak}
            picked={picked}
            locked={locked}
            onPick={onPick}
            selectedMascot={selectedMascot}
          />
        )}
      {stage === "result" && (
        <Result
          level={level}
          track={track}
          theme={theme}
          score={score}
          total={questions.length}
          wrong={wrong}
          coinsEarned={reward.coinsEarned}
          newlyUnlockedMascotIds={reward.newlyUnlockedMascotIds}
          onRetry={retry}
        />
      )}
    </main>
  );
}

function pickIntroMascot(
  level: Level,
  t: TFn,
): {
  mood: "happy" | "excited" | "think";
  messages: string[];
} {
  if (level.track === "language") {
    if (level.theme === "letters-and-sounds") {
      return {
        mood: "excited",
        messages: [
          t("lang.intro.letters_and_sounds.title"),
          t("lang.intro.letters_and_sounds.body"),
        ],
      };
    }
    if (level.theme === "nouns-verbs") {
      if (level.topic === "final") {
        return {
          mood: "think",
          messages: [t("lang.intro.final.title"), t("lang.intro.final.body")],
        };
      }
      return {
        mood: "excited",
        messages: [
          t(`lang.intro.${level.topic.replace("-", "_")}.title`),
          t(`lang.intro.${level.topic.replace("-", "_")}.body`),
        ],
      };
    }
    // grade-1 lengua other themes — generic intro
    return {
      mood: "happy",
      messages: [t("intro.single_practice"), t("intro.single_you_can")],
    };
  }
  // sciences and others — generic
  if (level.track === "social-sciences" || level.track === "natural-sciences") {
    return {
      mood: "happy",
      messages: [t("intro.single_practice"), t("intro.single_you_can")],
    };
  }

  // Math — tables-specific messages
  if (level.track === "math" && level.theme === "tables") {
    if (level.kind === "learn") {
      const table = level.tables[0];
      const first = level.factors?.[0] ?? 1;
      const last = level.factors?.[level.factors.length - 1] ?? 10;
      return {
        mood: "excited",
        messages: [
          t("intro.learn_title", { table, emoji: level.emoji }),
          t("intro.learn_range", { t: table, first, last }),
          t("intro.learn_look"),
        ],
      };
    }
    if (level.tables.length === 1) {
      return {
        mood: "happy",
        messages: [t("intro.single_practice"), t("intro.single_you_can")],
      };
    }
    if (level.tables.length === 9 && level.emoji === "👑") {
      return {
        mood: "think",
        messages: [t("intro.final_title"), t("intro.final_breath")],
      };
    }
  }
  // Grade 1 math (counting, comparing, addition, etc.)
  return {
    mood: "happy",
    messages: [t("intro.single_practice"), t("intro.single_you_can")],
  };
}

function Intro({
  level,
  selectedMascot,
  onStart,
}: {
  level: Level;
  selectedMascot: MascotVariant;
  onStart: () => void;
}) {
  const { t } = useI18n();
  const mascot = pickIntroMascot(level, t);
  // Lookup the per-theme instructions (e.g. "Vas a comparar cantidades..."
  // for comparing-quantities). Falls back to a generic line if missing.
  const instructionsKey = `theme.intro.${level.theme.replace(/-/g, "_")}`;
  const instructionsText = t(instructionsKey);
  const hasInstructions = instructionsText !== instructionsKey;

  return (
    <div className="flex flex-1 flex-col">
      <TopBar backHref={`/?track=${level.track}&theme=${level.theme}`} />

      {/* Hero — emoji + title */}
      <div className="mt-10 mb-6 text-center">
        <div className="text-7xl">{level.emoji}</div>
        <h1 className="mt-4 text-3xl font-black text-slate-900">
          {formatLevelTitle(level, t)}
        </h1>
        <p className="mt-1 text-slate-600">
          {formatLevelSubtitle(level, t)}
        </p>
      </div>

      {/* Instructions — what the kid will do */}
      {hasInstructions && (
        <div className="rounded-2xl bg-blue-50 px-4 py-4 ring-1 ring-blue-200">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
            📋 {t("level.what_to_do")}
          </p>
          <p className="mt-1 text-base font-semibold text-slate-800">
            {instructionsText}
          </p>
        </div>
      )}

      {/* Reference card (math/tables + language only) */}
      {level.track === "math" && level.theme === "tables" && level.kind === "learn" && (
        <TableReference
          table={level.tables[0]}
          factors={level.factors ?? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        />
      )}

      {level.track === "math" && level.theme === "tables" && level.kind === "mix" && (
        <MixTablesReference level={level} />
      )}

      {level.track === "language" && <LanguageReference level={level} />}

      {/* Mascot encouragement */}
      <div className="mt-4">
        <Mascot
          mood={mascot.mood}
          message={mascot.messages}
          size="md"
          variant={selectedMascot}
        />
      </div>

      {/* Pass rule — small, near the button */}
      <p className="mt-auto pt-6 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
        {t("level.intro_rule", {
          min: level.minScore,
          total: level.questions,
        })}
      </p>

      <button
        onClick={onStart}
        className="mt-3 w-full rounded-2xl bg-brand-500 py-4 text-lg font-black text-white shadow-lg shadow-brand-500/30 active:scale-[0.99]"
      >
        {t("level.start")}
      </button>
    </div>
  );
}

function TableReference({
  table,
  factors,
}: {
  table: number;
  factors: number[];
}) {
  const { t } = useI18n();
  const first = factors[0];
  const last = factors[factors.length - 1];
  return (
    <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-center text-sm font-semibold text-slate-700">
        {t("level.table_ref", { table, t: table, first, last })}
      </p>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {factors.map((b) => (
          <li
            key={b}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700"
          >
            <span>
              {table} × {b}
            </span>
            <span className="font-black text-brand-600">= {table * b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MixTablesReference({
  level,
}: {
  level: import("@/lib/curriculum").TablesMathLevel;
}) {
  const { t } = useI18n();
  return (
    <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-center text-sm font-semibold text-slate-700">
        {t("level.practice_tables")}
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {level.tables.map((tbl) => (
          <span
            key={tbl}
            className="rounded-full bg-brand-100 px-3 py-1 text-sm font-bold text-brand-700"
          >
            × {tbl}
          </span>
        ))}
      </div>
    </div>
  );
}

function LanguageReference({ level }: { level: LanguageLevel }) {
  const { t } = useI18n();
  let examplesKey: string | null = null;
  if (level.theme === "letters-and-sounds") {
    examplesKey = "lang.intro.letters_and_sounds.examples";
  } else if (level.theme === "nouns-verbs") {
    const topicKey = level.topic === "final" ? "final" : level.topic.replace("-", "_");
    examplesKey = `lang.intro.${topicKey}.examples`;
  }
  if (!examplesKey) return null;
  return (
    <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-center text-sm text-slate-700">
        {t(examplesKey)}
      </p>
    </div>
  );
}

function Playing({
  level,
  question,
  index,
  total,
  score,
  streak,
  picked,
  locked,
  onPick,
  selectedMascot,
}: {
  level: Level;
  question: Question;
  index: number;
  total: number;
  score: number;
  streak: number;
  picked: OptionValue | null;
  locked: boolean;
  onPick: (n: OptionValue) => void;
  selectedMascot: MascotVariant;
}) {
  const { t } = useI18n();
  const pct = Math.round((index / total) * 100);

  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [anim, setAnim] = useState<string | null>(null);

  useEffect(() => {
    setFeedback(null);
    setAnim(null);
  }, [index]);

  useEffect(() => {
    if (picked == null) return;
    const correct = isCorrectAnswer(question, picked);
    setFeedback(correct ? "correct" : "wrong");
    const next = correct
      ? CELEBRATE_MOVES[Math.floor(Math.random() * CELEBRATE_MOVES.length)]
      : "animate-shake";
    setAnim(null);
    requestAnimationFrame(() => setAnim(next));
  }, [picked, question]);

  const mascotMood: "happy" | "celebrate" | "sad" =
    feedback === "correct"
      ? "celebrate"
      : feedback === "wrong"
      ? "sad"
      : "happy";

  return (
    <div className="flex flex-1 flex-col">
      <TopBar backHref={`/?track=${level.track}&theme=${level.theme}`} />
      <div className="mt-4">
        <div className="flex items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-500">
            {index + 1} / {total}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>✅ {score}</span>
          <span>{t("level.goal", { n: level.minScore })}</span>
        </div>
        {streak >= 2 && (
          <div className="mt-1 flex flex-wrap items-center gap-x-1 text-[14px] leading-tight">
            <span className="text-xs font-bold text-amber-700">
              {t("level.streak_label")}
            </span>
            {Array.from({ length: Math.min(streak, 80) }, (_, i) => (
              <span key={i}>🔥</span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center">
        <Character
          variant={selectedMascot}
          size="sm"
          mood={mascotMood}
          animClass={anim}
          onAnimationEnd={() => setAnim(null)}
        />
      </div>

      <QuestionPrompt question={question} />

      <OptionsGrid
        question={question}
        picked={picked}
        locked={locked}
        onPick={onPick}
      />
    </div>
  );
}

function QuestionPrompt({ question }: { question: Question }) {
  const { t } = useI18n();
  if (question.type === "math") {
    return (
      <div key={`${question.a}-${question.b}`} className="mt-2 flex flex-col items-center animate-pop">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {t("level.question_label")}
        </p>
        <div className="mt-1 text-6xl font-black text-slate-900 sm:text-7xl md:text-8xl">
          {question.a} × {question.b}
        </div>
      </div>
    );
  }
  // language / input / order / match / text-production all share the
  // same prompt + optional context layout.
  const context = "context" in question ? question.context : undefined;
  return (
    <div className="mt-3 flex flex-col items-center text-center animate-pop">
      <p className="text-base font-bold text-slate-900 sm:text-lg">
        {question.prompt}
      </p>
      {context && (
        <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-4xl font-black text-slate-900 ring-1 ring-amber-200 sm:text-5xl">
          {context}
        </p>
      )}
    </div>
  );
}

function OptionsGrid({
  question,
  picked,
  locked,
  onPick,
}: {
  question: Question;
  picked: OptionValue | null;
  locked: boolean;
  onPick: (n: OptionValue) => void;
}) {
  // Stubs for not-yet-implemented question types. Once a level using
  // one of these is added, replace the corresponding case with its
  // dedicated component (Input / Order / Match / TextProduction).
  if (
    question.type === "input" ||
    question.type === "order" ||
    question.type === "match" ||
    question.type === "text-production"
  ) {
    return (
      <div className="mt-auto rounded-2xl bg-slate-50 p-6 text-center text-slate-500 ring-1 ring-slate-200">
        <p className="text-3xl">🚧</p>
        <p className="mt-2 text-sm font-bold">
          Componente en construcción
        </p>
        <p className="mt-1 text-xs">
          Tipo: <code className="font-mono">{question.type}</code>
        </p>
      </div>
    );
  }

  const options: OptionValue[] = question.options;
  const n = options.length;

  // Math options are numbers — bigger font, 2 columns, 1-line buttons.
  // Language options are strings — variable length, single column for 2-option
  // (yes/no) questions, two-column otherwise but smaller font.
  const isMath = question.type === "math";
  const layoutCols = isMath ? "grid-cols-2" : n <= 2 ? "grid-cols-1" : "grid-cols-2";
  const sizeCls = isMath
    ? n >= 8
      ? "py-3 text-xl sm:py-4 sm:text-2xl"
      : n >= 6
      ? "py-4 text-xl sm:py-5 sm:text-2xl"
      : "py-5 text-2xl sm:py-6 sm:text-3xl"
    : "py-4 px-3 text-base sm:py-5 sm:text-lg";

  return (
    <div className={`mt-auto grid gap-2.5 pt-6 sm:gap-3 ${layoutCols}`}>
      {options.map((opt) => {
        const isPicked = picked === opt;
        const isCorrect = opt === question.answer;
        let cls = `rounded-2xl bg-white ${sizeCls} font-black text-slate-900 shadow-sm ring-2 ring-slate-200 active:scale-[0.98] break-words text-center`;
        if (locked) {
          if (isCorrect)
            cls += " !ring-brand-500 !bg-brand-50 !text-brand-700 animate-pop";
          else if (isPicked)
            cls += " !ring-rose-500 !bg-rose-50 !text-rose-700 animate-shake";
          else cls += " opacity-60";
        } else {
          cls += " hover:ring-brand-500";
        }
        return (
          <button
            key={String(opt)}
            onClick={() => onPick(opt)}
            disabled={locked}
            className={cls}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function findWeakTable(
  level: import("@/lib/curriculum").TablesMathLevel,
  wrong: Question[],
): number | null {
  if (wrong.length === 0) return null;
  const counts = new Map<number, number>();
  const allowed = new Set(level.tables);
  for (const q of wrong) {
    if (q.type !== "math") continue;
    if (allowed.has(q.a)) counts.set(q.a, (counts.get(q.a) ?? 0) + 1);
    else if (allowed.has(q.b)) counts.set(q.b, (counts.get(q.b) ?? 0) + 1);
  }
  if (counts.size === 0) return null;
  let best = -1;
  let bestCount = 0;
  for (const [tbl, c] of counts) {
    if (c > bestCount) {
      best = tbl;
      bestCount = c;
    }
  }
  return best === -1 ? null : best;
}

function Result({
  level,
  track,
  theme,
  score,
  total,
  wrong,
  coinsEarned,
  newlyUnlockedMascotIds,
  onRetry,
}: {
  level: Level;
  track: Track;
  theme: string;
  score: number;
  total: number;
  wrong: Question[];
  coinsEarned: number;
  newlyUnlockedMascotIds: number[];
  onRetry: () => void;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const passed = score >= level.minScore;
  const stars = computeStars(score, total);
  const next = level.id + 1;
  const totalForTheme = totalLevels(track, theme);

  // Math-only "weak table" suggestion.
  const weakTable =
    level.track === "math" && level.theme === "tables"
      ? findWeakTable(level, wrong)
      : null;
  const reviewLevel = weakTable != null ? findLearnLevelFor(weakTable) : undefined;
  const suggestReview = !passed && reviewLevel && reviewLevel.id !== level.id;

  const resultMood = passed
    ? stars === 3
      ? "celebrate"
      : "happy"
    : "sad";
  // Only show a "new mascot" if the kid actually unlocked one (i.e.,
  // this pass completed a theme).
  const unlockedMascot =
    passed && newlyUnlockedMascotIds.length > 0
      ? getMascotForLevel(newlyUnlockedMascotIds[0])
      : undefined;
  const resultMessage = passed
    ? stars === 3
      ? t("level.result_3_stars")
      : stars === 2
      ? t("level.result_2_stars")
      : t("level.result_1_star")
    : t("level.result_failed", { n: level.minScore - score });
  const backToMapHref = `/?track=${track}&theme=${theme}`;

  return (
    <div className="flex flex-1 flex-col">
      <TopBar backHref={`/?track=${level.track}&theme=${level.theme}`} />
      <div className="mt-6 flex flex-1 flex-col items-center justify-center text-center">
        <Character mood={resultMood} size="lg" variant={unlockedMascot} />
        <h1 className="mt-4 text-3xl font-black text-slate-900">
          {passed ? t("level.passed_title") : t("level.not_passed_title")}
        </h1>
        <p className="mt-1 text-slate-600">{resultMessage}</p>
        {passed && unlockedMascot && (
          <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
              {newlyUnlockedMascotIds.length > 1
                ? t("level.new_mascots_n", { n: newlyUnlockedMascotIds.length })
                : t("level.new_mascot")}
            </p>
            <p className="mt-0.5 text-lg font-black text-amber-900">
              {t("level.meet_mascot", { name: unlockedMascot.name })}
            </p>
          </div>
        )}
        {passed && coinsEarned > 0 && (
          <div className="mt-3 rounded-2xl bg-yellow-50 px-4 py-3 ring-1 ring-yellow-200">
            <p className="text-xs font-bold uppercase tracking-wide text-yellow-700">
              {t("level.coins_earned_label")}
            </p>
            <p className="mt-0.5 text-lg font-black text-yellow-900">
              🪙 +{coinsEarned} {t("level.coins_earned_word")}
            </p>
          </div>
        )}

        <div className="mt-6 text-5xl">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={i < stars ? "text-amber-400 animate-pop" : "text-slate-200"}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              ★
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-slate-200">
          <div className="text-xs font-semibold uppercase text-slate-500">
            {t("level.score")}
          </div>
          <div className="text-3xl font-black text-slate-900">
            {score} <span className="text-slate-400">/ {total}</span>
          </div>
        </div>

        {suggestReview && reviewLevel && weakTable != null && (
          <div className="mt-6 w-full rounded-2xl bg-amber-50 p-4 text-left ring-1 ring-amber-200">
            <p className="text-sm font-bold text-amber-900">
              {t("level.weak_hint_title", { table: weakTable })}
            </p>
            <p className="mt-1 text-xs text-amber-800">
              {t("level.weak_hint_sub", {
                id: reviewLevel.id,
                title: formatLevelTitle(reviewLevel, t),
              })}
            </p>
            <button
              onClick={() =>
                router.push(`/level/math/tables/${reviewLevel.id}`)
              }
              className="mt-3 w-full rounded-xl bg-amber-500 py-3 text-sm font-black text-white shadow-sm active:scale-[0.99]"
            >
              {t("level.weak_hint_button", { table: weakTable })}
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3 pb-4">
        {passed ? (
          <button
            onClick={() => {
              if (next <= totalForTheme)
                router.push(`/level/${track}/${theme}/${next}`);
              else router.push(backToMapHref);
            }}
            className="w-full rounded-2xl bg-brand-500 py-4 text-lg font-black text-white shadow-lg shadow-brand-500/30 active:scale-[0.99]"
          >
            {next <= totalForTheme ? t("level.next") : t("level.back_to_map")}
          </button>
        ) : (
          <button
            onClick={onRetry}
            className="w-full rounded-2xl bg-brand-500 py-4 text-lg font-black text-white shadow-lg shadow-brand-500/30 active:scale-[0.99]"
          >
            {t("level.retry")}
          </button>
        )}
        <Link
          href={backToMapHref}
          className="block w-full rounded-2xl bg-white py-3 text-center text-sm font-bold text-slate-700 ring-1 ring-slate-200"
        >
          {t("level.back_to_map")}
        </Link>
      </div>
    </div>
  );
}

function TopBar({ backHref = "/" }: { backHref?: string }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center justify-between">
      <Link
        href={backHref}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-lg font-black text-white shadow-md shadow-brand-500/30 ring-1 ring-brand-600 active:scale-95"
        aria-label={t("topbar.back")}
      >
        ←
      </Link>
      <span className="text-sm font-bold text-slate-500">
        {t("meta.app_name")}
      </span>
      <div className="h-10 w-10" />
    </div>
  );
}

// =================================================================
//                    TEXT PRODUCTION STAGE
// =================================================================
// Kid types in a textarea, then a parent approves inline by entering
// their password on the kid's screen. Approval marks the level passed.

function TextProductionStage({
  level,
  track,
  theme,
  question,
  selectedMascot,
  onPassed,
}: {
  level: Level;
  track: Track;
  theme: string;
  question: TextProductionQuestion;
  selectedMascot: MascotVariant;
  onPassed: () => void;
}) {
  const { t } = useI18n();
  const [content, setContent] = useState("");
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [pending, setPending] = useState(false);

  const minChars = question.minChars;
  const trimmed = content.trim();
  const canSubmit = trimmed.length >= minChars && !pending;

  function onSubmit() {
    if (!canSubmit) return;
    setPending(true);
    startTransition(async () => {
      const res = await submitTextProduction(
        track,
        theme,
        level.id,
        trimmed,
        minChars,
      );
      setPending(false);
      if (res.ok) {
        setSubmissionId(res.submissionId);
        setShowApprovalModal(true);
      } else {
        window.alert(res.error);
      }
    });
  }

  function onApproved() {
    setShowApprovalModal(false);
    setSubmissionId(null);
    onPassed();
  }

  function onRejected(fb: string) {
    setShowApprovalModal(false);
    setSubmissionId(null);
    setFeedback(fb);
    setContent("");
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar backHref={`/?track=${level.track}&theme=${level.theme}`} />
      <div className="mt-4">
        <Character variant={selectedMascot} size="sm" mood="happy" />
      </div>

      <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-center ring-1 ring-amber-200">
        <p className="text-sm font-bold uppercase tracking-wide text-amber-700">
          {t("tp.write_about")}
        </p>
        <p className="mt-1 text-lg font-black text-amber-900 sm:text-xl">
          {t(question.prompt)}
        </p>
      </div>

      {feedback && (
        <div className="mt-3 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700 ring-1 ring-rose-200">
          <span className="font-black">📝 </span>
          {feedback}
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        placeholder={t("tp.placeholder")}
        className="mt-4 w-full rounded-2xl bg-white p-4 text-base font-semibold text-slate-900 ring-2 ring-slate-200 focus:ring-brand-500"
      />

      <p className="mt-2 text-right text-xs font-bold text-slate-500">
        {trimmed.length} / {minChars}
      </p>

      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className="mt-auto w-full rounded-2xl bg-brand-500 py-4 text-lg font-black text-white shadow-lg shadow-brand-500/30 active:scale-[0.99] disabled:opacity-50"
      >
        {pending ? t("tp.submitting") : t("tp.show_to_parent")}
      </button>

      {showApprovalModal && submissionId && (
        <ApprovalModal
          submissionId={submissionId}
          content={trimmed}
          minScore={level.minScore}
          onClose={() => setShowApprovalModal(false)}
          onApproved={onApproved}
          onRejected={onRejected}
        />
      )}
    </div>
  );
}

function ApprovalModal({
  submissionId,
  content,
  minScore,
  onClose,
  onApproved,
  onRejected,
}: {
  submissionId: string;
  content: string;
  minScore: number;
  onClose: () => void;
  onApproved: () => void;
  onRejected: (feedback: string) => void;
}) {
  const { t } = useI18n();
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [mode, setMode] = useState<"choose" | "reject">("choose");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onApprove() {
    setError(null);
    if (!password.trim()) {
      setError(t("kids.parent_mode_password_required"));
      return;
    }
    startTransition(async () => {
      const res = await approveTextSubmission(submissionId, password, minScore);
      if (res.ok) {
        onApproved();
      } else {
        setError(res.error);
      }
    });
  }

  function onReject() {
    setError(null);
    if (!password.trim()) {
      setError(t("kids.parent_mode_password_required"));
      return;
    }
    if (!feedback.trim()) {
      setError(t("tp.feedback_required"));
      return;
    }
    startTransition(async () => {
      const res = await rejectTextSubmission(submissionId, password, feedback);
      if (res.ok) {
        onRejected(feedback);
      } else {
        setError(res.error);
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
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-3 flex items-center gap-3">
          <span className="text-3xl">📝</span>
          <div>
            <h2 className="text-lg font-black text-slate-900">
              {t("tp.approval_title")}
            </h2>
            <p className="text-xs text-slate-600">{t("tp.approval_sub")}</p>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-800 ring-1 ring-slate-200">
          {content}
        </div>

        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("auth.password_placeholder")}
          className="mt-3 w-full rounded-xl bg-slate-50 px-3 py-3 text-sm font-semibold ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500"
        />

        {mode === "reject" && (
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={2}
            placeholder={t("tp.feedback_placeholder")}
            className="mt-2 w-full rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500"
          />
        )}

        {error && (
          <p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 ring-1 ring-rose-200">
            {error}
          </p>
        )}

        {mode === "choose" ? (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setMode("reject")}
              disabled={pending}
              className="flex-1 rounded-xl bg-rose-100 px-3 py-3 text-sm font-black text-rose-700 hover:bg-rose-200 disabled:opacity-50"
            >
              {t("tp.reject_button")}
            </button>
            <button
              type="button"
              onClick={onApprove}
              disabled={pending}
              className="flex-1 rounded-xl bg-brand-500 px-3 py-3 text-sm font-black text-white shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              {pending ? t("kids.parent_mode_verifying") : t("tp.approve_button")}
            </button>
          </div>
        ) : (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setMode("choose")}
              disabled={pending}
              className="flex-1 rounded-xl bg-slate-100 px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
            >
              {t("kids.parent_mode_cancel")}
            </button>
            <button
              type="button"
              onClick={onReject}
              disabled={pending}
              className="flex-1 rounded-xl bg-rose-500 px-3 py-3 text-sm font-black text-white shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              {pending ? t("kids.parent_mode_verifying") : t("tp.confirm_reject")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
