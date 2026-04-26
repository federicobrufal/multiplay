import type {
  Level,
  MathLevel,
  TablesMathLevel,
  Grade1LenguaLevel,
  ConceptLevel,
} from "./curriculum";
import type { Grade4MathLevel } from "./level-types";
import { buildLanguageQuestions } from "./language-questions";
import { buildLettersQuestions } from "./letters-questions";
import { buildGrade1MathQuestions } from "./grade-1-math-questions";
import { buildGrade4MathQuestions } from "./grade-4-math-questions";
import { buildGrade1LenguaQuestions } from "./grade-1-lengua-questions";
import { buildGrade4LenguaQuestions } from "./grade-4-lengua-questions";
import type { Grade4LenguaLevel } from "./level-types";
import { buildSciencesQuestions } from "./grade-1-sciences-questions";

// ============================================================
//   Question type variants — 5 UI patterns cover all exercises
//   for grades 1-6:
//   1. Choice (math + language MCQ)         — variants below
//   2. Input        (one-line text/number)  — InputQuestion
//   3. Order        (tap-to-order items)    — OrderQuestion
//   4. Match        (pair two columns)      — MatchQuestion
//   5. TextProd     (free text + parent OK) — TextProductionQuestion
// ============================================================

/** Multiple-choice with numeric prompt rendered as "a × b". */
export interface MathQuestion {
  type: "math";
  a: number;
  b: number;
  answer: number;
  options: number[];
}

/** Multiple-choice with string prompt + optional sentence context. */
export interface LanguageQuestion {
  type: "language";
  prompt: string;
  context?: string;
  answer: string;
  options: string[];
}

/** Free input (text or number). Validated by case-insensitive trim match. */
export interface InputQuestion {
  type: "input";
  prompt: string;
  context?: string;
  answer: string;
  inputKind: "text" | "number";
}

/** Drag-/tap-to-order items. The user must reproduce `correctOrder`
 * (UI shuffles the items for display). */
export interface OrderQuestion {
  type: "order";
  prompt: string;
  items: string[];
  correctOrder: string[];
}

/** Pair items from a left column with their match in the right column.
 * Validation: every left maps to its corresponding right. */
export interface MatchQuestion {
  type: "match";
  prompt: string;
  pairs: Array<{ left: string; right: string }>;
}

/** Free-text production (essay-style). Pass requires:
 *   1) length >= minChars
 *   2) parent approval (re-auth via password) on the kid's screen
 * Architecture supports future AI auto-review (`reviewer_type='ai'`). */
export interface TextProductionQuestion {
  type: "text-production";
  prompt: string;
  minChars: number;
}

export type Question =
  | MathQuestion
  | LanguageQuestion
  | InputQuestion
  | OrderQuestion
  | MatchQuestion
  | TextProductionQuestion;

/**
 * Number of answer choices per question — grows with level.
 * +2 options every 4 levels, starting at 4, capped at 8. (Math only.)
 *   Lv 1-4: 4  · Lv 5-8: 6  · Lv 9+: 8
 */
export function optionsCountForLevel(levelId: number): number {
  return Math.min(8, 4 + 2 * Math.floor((levelId - 1) / 4));
}

export function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function makeOptions(answer: number, count: number): number[] {
  const opts = new Set<number>([answer]);
  const pool: number[] = [];
  for (let d = 1; d <= 12; d++) {
    pool.push(answer + d, answer - d, answer + d * 2, answer - d * 2);
  }
  const filtered = pool.filter((n) => n > 0 && n !== answer && n <= 120);
  const shuffled = shuffle(filtered);
  for (const n of shuffled) {
    if (opts.size >= count) break;
    opts.add(n);
  }
  while (opts.size < count) {
    const n = Math.max(1, Math.floor(Math.random() * 100));
    if (n !== answer) opts.add(n);
  }
  return shuffle(Array.from(opts));
}

export function buildMathQuestions(level: TablesMathLevel): MathQuestion[] {
  const pool: Array<[number, number]> = [];
  const seen = new Set<string>();
  const addPair = (a: number, b: number) => {
    const key = `${a},${b}`;
    if (!seen.has(key)) {
      seen.add(key);
      pool.push([a, b]);
    }
  };

  if (level.kind === "learn") {
    const t = level.tables[0];
    const factors = level.factors ?? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (const b of factors) {
      addPair(t, b);
      addPair(b, t);
    }
  } else {
    for (const t of level.tables) {
      for (let b = 1; b <= 10; b++) addPair(t, b);
    }
  }

  const recentWindow = Math.max(1, Math.min(pool.length - 1, 6));
  const picked: Array<[number, number]> = [];
  while (picked.length < level.questions) {
    const recent = new Set(
      picked.slice(-recentWindow).map(([a, b]) => `${a},${b}`),
    );
    const fresh = pool.filter(([a, b]) => !recent.has(`${a},${b}`));
    const source = fresh.length > 0 ? fresh : pool;
    const pick = source[Math.floor(Math.random() * source.length)];
    picked.push(pick);
  }

  const optionsCount = optionsCountForLevel(level.id);
  return picked.map(([a, b]) => {
    const answer = a * b;
    return {
      type: "math",
      a,
      b,
      answer,
      options: makeOptions(answer, optionsCount),
    };
  });
}

const GRADE_4_MATH_THEMES = new Set<string>([
  "numbers-10k",
  "addition-subtraction-carry",
  "multiplication-1digit",
  "multiplication-2digit",
  "simple-division",
  "problem-solving",
  "tables-graphs",
]);

const GRADE_4_LENGUA_THEMES = new Set<string>([
  "narrative-comprehension",
  "event-sequence",
  "capitalization-punctuation",
  "word-classification",
  "sentence-production",
  "informative-comprehension",
  "short-text-production",
]);

export function buildQuestions(level: Level): Question[] {
  if (level.track === "math") {
    if (level.theme === "tables") return buildMathQuestions(level);
    if (GRADE_4_MATH_THEMES.has(level.theme)) {
      return buildGrade4MathQuestions(level as Grade4MathLevel);
    }
    return buildGrade1MathQuestions(level as import("./curriculum").Grade1MathLevel);
  }
  if (level.track === "language") {
    if (level.theme === "letters-and-sounds") return buildLettersQuestions(level);
    if (level.theme === "nouns-verbs") return buildLanguageQuestions(level);
    if (GRADE_4_LENGUA_THEMES.has(level.theme)) {
      return buildGrade4LenguaQuestions(level as Grade4LenguaLevel);
    }
    return buildGrade1LenguaQuestions(level as Grade1LenguaLevel);
  }
  // social-sciences / natural-sciences
  return buildSciencesQuestions(level as ConceptLevel);
}
