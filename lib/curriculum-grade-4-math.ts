import { Q_COUNT, MIN_PASS } from "./level-types";
import type { Grade4MathLevel } from "./level-types";

interface Spec {
  variant: string;
  config?: Grade4MathLevel["config"];
  emoji: string;
  titleKey: string;
  subtitleKey: string;
  day: 1 | 2 | 3;
  showIntro?: boolean;
}

function buildLevels(
  theme: Grade4MathLevel["theme"],
  specs: Spec[],
): Grade4MathLevel[] {
  return specs.map((s, i) => ({
    id: i + 1,
    track: "math",
    theme,
    grade: 4,
    day: s.day,
    emoji: s.emoji,
    titleKey: s.titleKey,
    subtitleKey: s.subtitleKey,
    variant: s.variant,
    config: s.config,
    questions: Q_COUNT,
    minScore: MIN_PASS,
    showIntro: s.showIntro ?? i === 0,
  }));
}

// Convenience: numeric levels share simple "numbered" titles.
function numbered(n: number, isFinal = false) {
  return {
    titleKey: isFinal ? "level.numbered_final" : "level.numbered",
    subtitleKey: "level.numbered_sub",
    titleVars: { n },
  };
}

// Helper to inline the title vars when building levels with numbered titles.
function buildNumbered(
  theme: Grade4MathLevel["theme"],
  specs: Array<{
    variant: string;
    config?: Grade4MathLevel["config"];
    emoji: string;
    day: 1 | 2 | 3;
    showIntro?: boolean;
  }>,
): Grade4MathLevel[] {
  return specs.map((s, i) => {
    const n = i + 1;
    const isFinal = i === specs.length - 1;
    return {
      id: n,
      track: "math" as const,
      theme,
      grade: 4 as const,
      day: s.day,
      emoji: s.emoji,
      titleKey: isFinal ? "level.numbered_final" : "level.numbered",
      titleVars: { n },
      subtitleKey: "level.numbered_sub",
      variant: s.variant,
      config: s.config,
      questions: Q_COUNT,
      minScore: MIN_PASS,
      showIntro: s.showIntro ?? i === 0,
    };
  });
}

void buildLevels;
void numbered;

// ===== Números hasta 10.000 =====
export const NUMBERS_10K_LEVELS = buildNumbered("numbers-10k", [
  { variant: "digit-to-word", config: { range: [10, 99] }, emoji: "🔢", day: 1 },
  { variant: "word-to-digit", config: { range: [10, 99] }, emoji: "🔤", day: 1 },
  { variant: "digit-to-word", config: { range: [100, 999] }, emoji: "🔢", day: 1 },
  { variant: "word-to-digit", config: { range: [100, 999] }, emoji: "🔤", day: 2 },
  { variant: "digit-to-word", config: { range: [1000, 9999] }, emoji: "🔢", day: 2 },
  { variant: "word-to-digit", config: { range: [1000, 9999] }, emoji: "🔤", day: 2 },
  { variant: "place-value", config: { range: [1000, 9999] }, emoji: "📍", day: 3 },
  { variant: "compare", config: { range: [1000, 9999] }, emoji: "⚖️", day: 3 },
  { variant: "mix", config: { range: [1, 9999] }, emoji: "🔀", day: 3 },
  { variant: "mix", config: { range: [1, 9999] }, emoji: "👑", day: 3 },
]);

// ===== Sumas y restas con llevadas =====
export const ADDITION_SUBTRACTION_CARRY_LEVELS = buildNumbered("addition-subtraction-carry", [
  { variant: "sum", config: { range: [10, 99] }, emoji: "➕", day: 1 },
  { variant: "sub", config: { range: [10, 99] }, emoji: "➖", day: 1 },
  { variant: "sum", config: { range: [100, 999] }, emoji: "➕", day: 1 },
  { variant: "sub", config: { range: [100, 999] }, emoji: "➖", day: 2 },
  { variant: "sum", config: { range: [1000, 9999] }, emoji: "➕", day: 2 },
  { variant: "sub", config: { range: [1000, 9999] }, emoji: "➖", day: 2 },
  { variant: "missing", config: { range: [10, 999] }, emoji: "❓", day: 3 },
  { variant: "mix", config: { range: [10, 999] }, emoji: "🔀", day: 3 },
  { variant: "mix", config: { range: [100, 9999] }, emoji: "👑", day: 3 },
]);

// ===== Multiplicación por 1 cifra =====
export const MULTIPLICATION_1DIGIT_LEVELS = buildNumbered("multiplication-1digit", [
  { variant: "mult", config: { range: [10, 99] }, emoji: "✖️", day: 1 },
  { variant: "mult", config: { range: [10, 99] }, emoji: "✖️", day: 1 },
  { variant: "mult", config: { range: [100, 999] }, emoji: "✖️", day: 2 },
  { variant: "mult", config: { range: [100, 999] }, emoji: "✖️", day: 2 },
  { variant: "missing", config: { range: [10, 99] }, emoji: "❓", day: 3 },
  { variant: "mix", config: { range: [10, 999] }, emoji: "🔀", day: 3 },
  { variant: "mix", config: { range: [10, 999] }, emoji: "👑", day: 3 },
]);

// ===== Multiplicación por 2 cifras =====
export const MULTIPLICATION_2DIGIT_LEVELS = buildNumbered("multiplication-2digit", [
  { variant: "mult2", config: { range: [10, 99] }, emoji: "✖️", day: 1 },
  { variant: "mult2", config: { range: [10, 99] }, emoji: "✖️", day: 2 },
  { variant: "mult2", config: { range: [100, 999] }, emoji: "✖️", day: 2 },
  { variant: "mult2", config: { range: [100, 999] }, emoji: "✖️", day: 3 },
  { variant: "mix", config: { range: [10, 999] }, emoji: "🔀", day: 3 },
  { variant: "mix", config: { range: [10, 999] }, emoji: "👑", day: 3 },
]);

// ===== División simple =====
export const SIMPLE_DIVISION_LEVELS = buildNumbered("simple-division", [
  { variant: "div", config: { range: [2, 50] }, emoji: "➗", day: 1 },
  { variant: "div", config: { range: [10, 100] }, emoji: "➗", day: 1 },
  { variant: "div", config: { range: [50, 500] }, emoji: "➗", day: 2 },
  { variant: "missing", config: { range: [10, 100] }, emoji: "❓", day: 2 },
  { variant: "div", config: { range: [100, 1000] }, emoji: "➗", day: 3 },
  { variant: "mix", config: { range: [10, 1000] }, emoji: "🔀", day: 3 },
  { variant: "mix", config: { range: [10, 1000] }, emoji: "👑", day: 3 },
]);

// ===== Resolución de problemas =====
export const PROBLEM_SOLVING_LEVELS = buildNumbered("problem-solving", [
  { variant: "story-add", config: { range: [10, 99] }, emoji: "🛒", day: 1 },
  { variant: "story-sub", config: { range: [10, 99] }, emoji: "🍪", day: 1 },
  { variant: "story-mult", config: { range: [2, 20] }, emoji: "✖️", day: 2 },
  { variant: "story-div", config: { range: [2, 20] }, emoji: "➗", day: 2 },
  { variant: "story-mix", config: { range: [10, 999] }, emoji: "🔀", day: 3 },
  { variant: "story-mix", config: { range: [10, 999] }, emoji: "👑", day: 3 },
]);

// ===== Tablas y gráficos =====
export const TABLES_GRAPHS_LEVELS = buildNumbered("tables-graphs", [
  { variant: "bar-most", emoji: "📊", day: 1 },
  { variant: "bar-least", emoji: "📊", day: 1 },
  { variant: "bar-total", emoji: "📊", day: 2 },
  { variant: "bar-diff", emoji: "📊", day: 2 },
  { variant: "mix", emoji: "🔀", day: 3 },
  { variant: "mix", emoji: "👑", day: 3 },
]);
