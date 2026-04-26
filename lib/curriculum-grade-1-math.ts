import { questionsForGrade, minPassForGrade } from "./grades";
import type { Grade1MathLevel } from "./level-types";

const Q = questionsForGrade(1);
const MP = minPassForGrade(1);

interface Spec {
  variant: string;
  config?: Grade1MathLevel["config"];
  emoji: string;
  titleKey: string;
  subtitleKey: string;
  day: 1 | 2 | 3;
  showIntro?: boolean;
}

function buildLevels(
  theme: Grade1MathLevel["theme"],
  specs: Spec[],
): Grade1MathLevel[] {
  return specs.map((s, i) => ({
    id: i + 1,
    track: "math",
    theme,
    grade: 1,
    day: s.day,
    emoji: s.emoji,
    titleKey: s.titleKey,
    subtitleKey: s.subtitleKey,
    variant: s.variant,
    config: s.config,
    questions: Q,
    minScore: MP,
    showIntro: s.showIntro ?? i === 0,
  }));
}

// ===== Conteo hasta 100 =====
export const COUNTING_100_LEVELS = buildLevels("counting-100", [
  { variant: "next", config: { range: [1, 10] }, emoji: "1️⃣", titleKey: "lvl.count.l1.title", subtitleKey: "lvl.count.l1.sub", day: 1 },
  { variant: "next", config: { range: [11, 30] }, emoji: "2️⃣", titleKey: "lvl.count.l2.title", subtitleKey: "lvl.count.l2.sub", day: 1 },
  { variant: "next", config: { range: [31, 60] }, emoji: "3️⃣", titleKey: "lvl.count.l3.title", subtitleKey: "lvl.count.l3.sub", day: 1 },
  { variant: "next", config: { range: [61, 100] }, emoji: "4️⃣", titleKey: "lvl.count.l4.title", subtitleKey: "lvl.count.l4.sub", day: 2 },
  { variant: "prev", config: { range: [1, 30] }, emoji: "⬅️", titleKey: "lvl.count.l5.title", subtitleKey: "lvl.count.l5.sub", day: 2 },
  { variant: "prev", config: { range: [31, 100] }, emoji: "⬅️", titleKey: "lvl.count.l6.title", subtitleKey: "lvl.count.l6.sub", day: 2 },
  { variant: "skip", config: { range: [2, 30], step: 2 }, emoji: "🦘", titleKey: "lvl.count.l7.title", subtitleKey: "lvl.count.l7.sub", day: 2 },
  { variant: "skip", config: { range: [5, 50], step: 5 }, emoji: "🖐️", titleKey: "lvl.count.l8.title", subtitleKey: "lvl.count.l8.sub", day: 3 },
  { variant: "skip", config: { range: [10, 100], step: 10 }, emoji: "🔟", titleKey: "lvl.count.l9.title", subtitleKey: "lvl.count.l9.sub", day: 3 },
  { variant: "count-objects", config: { range: [1, 10] }, emoji: "🔵", titleKey: "lvl.count.l10.title", subtitleKey: "lvl.count.l10.sub", day: 3 },
  { variant: "count-objects", config: { range: [1, 20] }, emoji: "🟢", titleKey: "lvl.count.l11.title", subtitleKey: "lvl.count.l11.sub", day: 3 },
  { variant: "mix", config: { range: [1, 100] }, emoji: "👑", titleKey: "lvl.count.l12.title", subtitleKey: "lvl.count.l12.sub", day: 3 },
]);

// ===== Reconocer números =====
export const NUMBER_RECOGNITION_LEVELS = buildLevels("number-recognition", [
  { variant: "word-to-digit", config: { range: [1, 10] }, emoji: "🔤", titleKey: "lvl.numrec.l1.title", subtitleKey: "lvl.numrec.l1.sub", day: 1 },
  { variant: "digit-to-word", config: { range: [1, 10] }, emoji: "🔢", titleKey: "lvl.numrec.l2.title", subtitleKey: "lvl.numrec.l2.sub", day: 1 },
  { variant: "word-to-digit", config: { range: [11, 30] }, emoji: "🔤", titleKey: "lvl.numrec.l3.title", subtitleKey: "lvl.numrec.l3.sub", day: 2 },
  { variant: "digit-to-word", config: { range: [11, 30] }, emoji: "🔢", titleKey: "lvl.numrec.l4.title", subtitleKey: "lvl.numrec.l4.sub", day: 2 },
  { variant: "count-to-digit", config: { range: [1, 10] }, emoji: "👀", titleKey: "lvl.numrec.l5.title", subtitleKey: "lvl.numrec.l5.sub", day: 2 },
  { variant: "find-digit", config: { range: [1, 30] }, emoji: "🔍", titleKey: "lvl.numrec.l6.title", subtitleKey: "lvl.numrec.l6.sub", day: 3 },
  { variant: "mix", config: { range: [1, 30] }, emoji: "🔀", titleKey: "lvl.numrec.l7.title", subtitleKey: "lvl.numrec.l7.sub", day: 3 },
  { variant: "mix", config: { range: [1, 30] }, emoji: "👑", titleKey: "lvl.numrec.l8.title", subtitleKey: "lvl.numrec.l8.sub", day: 3 },
]);

// ===== Comparar cantidades =====
export const COMPARING_QUANTITIES_LEVELS = buildLevels("comparing-quantities", [
  { variant: "visual", config: { range: [1, 10] }, emoji: "🍎", titleKey: "lvl.cmp.l1.title", subtitleKey: "lvl.cmp.l1.sub", day: 1 },
  { variant: "operator", config: { range: [1, 10] }, emoji: "⚖️", titleKey: "lvl.cmp.l2.title", subtitleKey: "lvl.cmp.l2.sub", day: 1 },
  { variant: "operator", config: { range: [11, 30] }, emoji: "⚖️", titleKey: "lvl.cmp.l3.title", subtitleKey: "lvl.cmp.l3.sub", day: 2 },
  { variant: "greater", config: { range: [1, 30] }, emoji: "📈", titleKey: "lvl.cmp.l4.title", subtitleKey: "lvl.cmp.l4.sub", day: 2 },
  { variant: "smaller", config: { range: [1, 30] }, emoji: "📉", titleKey: "lvl.cmp.l5.title", subtitleKey: "lvl.cmp.l5.sub", day: 2 },
  { variant: "operator", config: { range: [31, 100] }, emoji: "⚖️", titleKey: "lvl.cmp.l6.title", subtitleKey: "lvl.cmp.l6.sub", day: 3 },
  { variant: "mix", config: { range: [1, 100] }, emoji: "🔀", titleKey: "lvl.cmp.l7.title", subtitleKey: "lvl.cmp.l7.sub", day: 3 },
  { variant: "mix", config: { range: [1, 100] }, emoji: "👑", titleKey: "lvl.cmp.l8.title", subtitleKey: "lvl.cmp.l8.sub", day: 3 },
]);

// ===== Series numéricas =====
export const NUMBER_SERIES_LEVELS = buildLevels("number-series", [
  { variant: "next-step", config: { range: [1, 20], step: 1 }, emoji: "➕", titleKey: "lvl.ser.l1.title", subtitleKey: "lvl.ser.l1.sub", day: 1 },
  { variant: "next-step", config: { range: [2, 30], step: 2 }, emoji: "🦘", titleKey: "lvl.ser.l2.title", subtitleKey: "lvl.ser.l2.sub", day: 1 },
  { variant: "next-step", config: { range: [5, 50], step: 5 }, emoji: "🖐️", titleKey: "lvl.ser.l3.title", subtitleKey: "lvl.ser.l3.sub", day: 2 },
  { variant: "next-step", config: { range: [10, 100], step: 10 }, emoji: "🔟", titleKey: "lvl.ser.l4.title", subtitleKey: "lvl.ser.l4.sub", day: 2 },
  { variant: "missing-middle", config: { range: [1, 30], step: 1 }, emoji: "❓", titleKey: "lvl.ser.l5.title", subtitleKey: "lvl.ser.l5.sub", day: 2 },
  { variant: "next-step-back", config: { range: [1, 20], step: 1 }, emoji: "⬅️", titleKey: "lvl.ser.l6.title", subtitleKey: "lvl.ser.l6.sub", day: 3 },
  { variant: "mix", config: { range: [1, 100] }, emoji: "🔀", titleKey: "lvl.ser.l7.title", subtitleKey: "lvl.ser.l7.sub", day: 3 },
  { variant: "mix", config: { range: [1, 100] }, emoji: "👑", titleKey: "lvl.ser.l8.title", subtitleKey: "lvl.ser.l8.sub", day: 3 },
]);

// ===== Figuras geométricas =====
export const BASIC_SHAPES_LEVELS = buildLevels("basic-shapes", [
  { variant: "name-to-shape", emoji: "🔺", titleKey: "lvl.shapes.l1.title", subtitleKey: "lvl.shapes.l1.sub", day: 1 },
  { variant: "shape-to-name", emoji: "🔵", titleKey: "lvl.shapes.l2.title", subtitleKey: "lvl.shapes.l2.sub", day: 1 },
  { variant: "count", emoji: "🔢", titleKey: "lvl.shapes.l3.title", subtitleKey: "lvl.shapes.l3.sub", day: 2 },
  { variant: "sides", emoji: "📐", titleKey: "lvl.shapes.l4.title", subtitleKey: "lvl.shapes.l4.sub", day: 2 },
  { variant: "mix", emoji: "🔀", titleKey: "lvl.shapes.l5.title", subtitleKey: "lvl.shapes.l5.sub", day: 3 },
  { variant: "mix", emoji: "👑", titleKey: "lvl.shapes.l6.title", subtitleKey: "lvl.shapes.l6.sub", day: 3 },
]);

// ===== Sumas simples =====
export const SIMPLE_ADDITION_LEVELS = buildLevels("simple-addition", [
  { variant: "sum", config: { range: [1, 5] }, emoji: "➕", titleKey: "lvl.add.l1.title", subtitleKey: "lvl.add.l1.sub", day: 1 },
  { variant: "sum", config: { range: [1, 10] }, emoji: "➕", titleKey: "lvl.add.l2.title", subtitleKey: "lvl.add.l2.sub", day: 1 },
  { variant: "sum", config: { range: [1, 15] }, emoji: "➕", titleKey: "lvl.add.l3.title", subtitleKey: "lvl.add.l3.sub", day: 2 },
  { variant: "sum", config: { range: [1, 20] }, emoji: "➕", titleKey: "lvl.add.l4.title", subtitleKey: "lvl.add.l4.sub", day: 2 },
  { variant: "missing-addend", config: { range: [1, 10] }, emoji: "❓", titleKey: "lvl.add.l5.title", subtitleKey: "lvl.add.l5.sub", day: 2 },
  { variant: "missing-addend", config: { range: [1, 20] }, emoji: "❓", titleKey: "lvl.add.l6.title", subtitleKey: "lvl.add.l6.sub", day: 3 },
  { variant: "visual", config: { range: [1, 10] }, emoji: "🍎", titleKey: "lvl.add.l7.title", subtitleKey: "lvl.add.l7.sub", day: 3 },
  { variant: "mix", config: { range: [1, 20] }, emoji: "🔀", titleKey: "lvl.add.l8.title", subtitleKey: "lvl.add.l8.sub", day: 3 },
  { variant: "mix", config: { range: [1, 20] }, emoji: "👑", titleKey: "lvl.add.l9.title", subtitleKey: "lvl.add.l9.sub", day: 3 },
]);

// ===== Restas simples =====
export const SIMPLE_SUBTRACTION_LEVELS = buildLevels("simple-subtraction", [
  { variant: "sub", config: { range: [1, 5] }, emoji: "➖", titleKey: "lvl.sub.l1.title", subtitleKey: "lvl.sub.l1.sub", day: 1 },
  { variant: "sub", config: { range: [1, 10] }, emoji: "➖", titleKey: "lvl.sub.l2.title", subtitleKey: "lvl.sub.l2.sub", day: 1 },
  { variant: "sub", config: { range: [1, 15] }, emoji: "➖", titleKey: "lvl.sub.l3.title", subtitleKey: "lvl.sub.l3.sub", day: 2 },
  { variant: "sub", config: { range: [1, 20] }, emoji: "➖", titleKey: "lvl.sub.l4.title", subtitleKey: "lvl.sub.l4.sub", day: 2 },
  { variant: "missing-sub", config: { range: [1, 10] }, emoji: "❓", titleKey: "lvl.sub.l5.title", subtitleKey: "lvl.sub.l5.sub", day: 2 },
  { variant: "missing-sub", config: { range: [1, 20] }, emoji: "❓", titleKey: "lvl.sub.l6.title", subtitleKey: "lvl.sub.l6.sub", day: 3 },
  { variant: "visual", config: { range: [1, 10] }, emoji: "🍎", titleKey: "lvl.sub.l7.title", subtitleKey: "lvl.sub.l7.sub", day: 3 },
  { variant: "mix", config: { range: [1, 20] }, emoji: "👑", titleKey: "lvl.sub.l8.title", subtitleKey: "lvl.sub.l8.sub", day: 3 },
]);

// ===== Problemas cotidianos =====
export const DAILY_PROBLEMS_LEVELS = buildLevels("daily-problems", [
  { variant: "story-add", config: { range: [1, 10] }, emoji: "🛒", titleKey: "lvl.daily.l1.title", subtitleKey: "lvl.daily.l1.sub", day: 1 },
  { variant: "story-sub", config: { range: [1, 10] }, emoji: "🍪", titleKey: "lvl.daily.l2.title", subtitleKey: "lvl.daily.l2.sub", day: 2 },
  { variant: "story-add", config: { range: [1, 20] }, emoji: "🎁", titleKey: "lvl.daily.l3.title", subtitleKey: "lvl.daily.l3.sub", day: 2 },
  { variant: "story-sub", config: { range: [1, 20] }, emoji: "🍎", titleKey: "lvl.daily.l4.title", subtitleKey: "lvl.daily.l4.sub", day: 3 },
  { variant: "story-mix", config: { range: [1, 20] }, emoji: "🔀", titleKey: "lvl.daily.l5.title", subtitleKey: "lvl.daily.l5.sub", day: 3 },
  { variant: "story-mix", config: { range: [1, 20] }, emoji: "👑", titleKey: "lvl.daily.l6.title", subtitleKey: "lvl.daily.l6.sub", day: 3 },
]);
