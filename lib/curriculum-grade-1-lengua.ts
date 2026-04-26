import { questionsForGrade, minPassForGrade } from "./grades";
import type { Grade1LenguaLevel } from "./level-types";

const Q = questionsForGrade(1);
const MP = minPassForGrade(1);

interface Spec {
  variant: string;
  config?: Grade1LenguaLevel["config"];
  emoji: string;
  titleKey: string;
  subtitleKey: string;
  day: 1 | 2 | 3;
}

function buildLevels(
  theme: Grade1LenguaLevel["theme"],
  specs: Spec[],
): Grade1LenguaLevel[] {
  return specs.map((s, i) => ({
    id: i + 1,
    track: "language",
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
    showIntro: i === 0,
  }));
}

// ===== Separación de palabras =====
export const WORD_SEPARATION_LEVELS = buildLevels("word-separation", [
  { variant: "split-2", config: { wordCount: 2 }, emoji: "✂️", titleKey: "lvl.sep.l1.title", subtitleKey: "lvl.sep.l1.sub", day: 1 },
  { variant: "split-2", config: { wordCount: 2 }, emoji: "✂️", titleKey: "lvl.sep.l2.title", subtitleKey: "lvl.sep.l2.sub", day: 1 },
  { variant: "split-3", config: { wordCount: 3 }, emoji: "✂️", titleKey: "lvl.sep.l3.title", subtitleKey: "lvl.sep.l3.sub", day: 2 },
  { variant: "split-3", config: { wordCount: 3 }, emoji: "✂️", titleKey: "lvl.sep.l4.title", subtitleKey: "lvl.sep.l4.sub", day: 2 },
  { variant: "split-4", config: { wordCount: 4 }, emoji: "✂️", titleKey: "lvl.sep.l5.title", subtitleKey: "lvl.sep.l5.sub", day: 3 },
  { variant: "mix", emoji: "🔀", titleKey: "lvl.sep.l6.title", subtitleKey: "lvl.sep.l6.sub", day: 3 },
  { variant: "mix", emoji: "👑", titleKey: "lvl.sep.l7.title", subtitleKey: "lvl.sep.l7.sub", day: 3 },
]);

// ===== Lectura de palabras simples =====
export const SIMPLE_WORDS_READING_LEVELS = buildLevels("simple-words-reading", [
  { variant: "image-to-word", emoji: "👀", titleKey: "lvl.read.l1.title", subtitleKey: "lvl.read.l1.sub", day: 1 },
  { variant: "image-to-word", emoji: "👀", titleKey: "lvl.read.l2.title", subtitleKey: "lvl.read.l2.sub", day: 1 },
  { variant: "word-to-image", emoji: "🔍", titleKey: "lvl.read.l3.title", subtitleKey: "lvl.read.l3.sub", day: 2 },
  { variant: "word-to-image", emoji: "🔍", titleKey: "lvl.read.l4.title", subtitleKey: "lvl.read.l4.sub", day: 2 },
  { variant: "image-to-word", emoji: "📖", titleKey: "lvl.read.l5.title", subtitleKey: "lvl.read.l5.sub", day: 3 },
  { variant: "mix", emoji: "🔀", titleKey: "lvl.read.l6.title", subtitleKey: "lvl.read.l6.sub", day: 3 },
  { variant: "mix", emoji: "👑", titleKey: "lvl.read.l7.title", subtitleKey: "lvl.read.l7.sub", day: 3 },
]);

// ===== Escritura de palabras (completar) =====
export const WRITING_WORDS_LEVELS = buildLevels("writing-words", [
  { variant: "missing-first", emoji: "✏️", titleKey: "lvl.write.l1.title", subtitleKey: "lvl.write.l1.sub", day: 1 },
  { variant: "missing-first", emoji: "✏️", titleKey: "lvl.write.l2.title", subtitleKey: "lvl.write.l2.sub", day: 1 },
  { variant: "missing-middle", emoji: "✏️", titleKey: "lvl.write.l3.title", subtitleKey: "lvl.write.l3.sub", day: 2 },
  { variant: "missing-middle", emoji: "✏️", titleKey: "lvl.write.l4.title", subtitleKey: "lvl.write.l4.sub", day: 2 },
  { variant: "missing-last", emoji: "✏️", titleKey: "lvl.write.l5.title", subtitleKey: "lvl.write.l5.sub", day: 3 },
  { variant: "mix", emoji: "🔀", titleKey: "lvl.write.l6.title", subtitleKey: "lvl.write.l6.sub", day: 3 },
  { variant: "mix", emoji: "👑", titleKey: "lvl.write.l7.title", subtitleKey: "lvl.write.l7.sub", day: 3 },
]);

// ===== Mayúscula inicial =====
export const CAPITALIZATION_LEVELS = buildLevels("capitalization", [
  { variant: "name", emoji: "🔤", titleKey: "lvl.cap.l1.title", subtitleKey: "lvl.cap.l1.sub", day: 1 },
  { variant: "name", emoji: "🔤", titleKey: "lvl.cap.l2.title", subtitleKey: "lvl.cap.l2.sub", day: 1 },
  { variant: "sentence-start", emoji: "📝", titleKey: "lvl.cap.l3.title", subtitleKey: "lvl.cap.l3.sub", day: 2 },
  { variant: "sentence-start", emoji: "📝", titleKey: "lvl.cap.l4.title", subtitleKey: "lvl.cap.l4.sub", day: 2 },
  { variant: "mix", emoji: "🔀", titleKey: "lvl.cap.l5.title", subtitleKey: "lvl.cap.l5.sub", day: 3 },
  { variant: "mix", emoji: "👑", titleKey: "lvl.cap.l6.title", subtitleKey: "lvl.cap.l6.sub", day: 3 },
]);

// ===== Oraciones simples (orden) =====
export const SIMPLE_SENTENCES_LEVELS = buildLevels("simple-sentences", [
  { variant: "order-3", config: { wordCount: 3 }, emoji: "🧩", titleKey: "lvl.sent.l1.title", subtitleKey: "lvl.sent.l1.sub", day: 1 },
  { variant: "order-3", config: { wordCount: 3 }, emoji: "🧩", titleKey: "lvl.sent.l2.title", subtitleKey: "lvl.sent.l2.sub", day: 1 },
  { variant: "order-4", config: { wordCount: 4 }, emoji: "🧩", titleKey: "lvl.sent.l3.title", subtitleKey: "lvl.sent.l3.sub", day: 2 },
  { variant: "order-4", config: { wordCount: 4 }, emoji: "🧩", titleKey: "lvl.sent.l4.title", subtitleKey: "lvl.sent.l4.sub", day: 2 },
  { variant: "mix", emoji: "🔀", titleKey: "lvl.sent.l5.title", subtitleKey: "lvl.sent.l5.sub", day: 3 },
  { variant: "mix", emoji: "👑", titleKey: "lvl.sent.l6.title", subtitleKey: "lvl.sent.l6.sub", day: 3 },
]);

// ===== Comprensión de textos =====
export const TEXT_COMPREHENSION_LEVELS = buildLevels("text-comprehension", [
  { variant: "story", emoji: "📖", titleKey: "lvl.comp.l1.title", subtitleKey: "lvl.comp.l1.sub", day: 1 },
  { variant: "story", emoji: "📖", titleKey: "lvl.comp.l2.title", subtitleKey: "lvl.comp.l2.sub", day: 2 },
  { variant: "story", emoji: "📖", titleKey: "lvl.comp.l3.title", subtitleKey: "lvl.comp.l3.sub", day: 2 },
  { variant: "story", emoji: "📖", titleKey: "lvl.comp.l4.title", subtitleKey: "lvl.comp.l4.sub", day: 3 },
  { variant: "story", emoji: "👑", titleKey: "lvl.comp.l5.title", subtitleKey: "lvl.comp.l5.sub", day: 3 },
]);

// ===== Producción de textos =====
// Each level has 1 prompt; the kid types in a textarea, and a parent
// approves inline by entering their password.
const TP_MIN_CHARS = 30;

export const TEXT_PRODUCTION_LEVELS: Grade1LenguaLevel[] = [
  {
    id: 1, track: "language", theme: "text-production", grade: 1, day: 1,
    emoji: "🐶", titleKey: "lvl.tp.l1.title", subtitleKey: "lvl.tp.l1.sub",
    variant: "free", config: { promptKey: "tp.prompt.pet", minChars: TP_MIN_CHARS },
    questions: 1, minScore: 1, showIntro: true,
  },
  {
    id: 2, track: "language", theme: "text-production", grade: 1, day: 2,
    emoji: "🌞", titleKey: "lvl.tp.l2.title", subtitleKey: "lvl.tp.l2.sub",
    variant: "free", config: { promptKey: "tp.prompt.day", minChars: TP_MIN_CHARS },
    questions: 1, minScore: 1, showIntro: false,
  },
  {
    id: 3, track: "language", theme: "text-production", grade: 1, day: 2,
    emoji: "🏠", titleKey: "lvl.tp.l3.title", subtitleKey: "lvl.tp.l3.sub",
    variant: "free", config: { promptKey: "tp.prompt.house", minChars: TP_MIN_CHARS },
    questions: 1, minScore: 1, showIntro: false,
  },
  {
    id: 4, track: "language", theme: "text-production", grade: 1, day: 3,
    emoji: "👨‍👩‍👧", titleKey: "lvl.tp.l4.title", subtitleKey: "lvl.tp.l4.sub",
    variant: "free", config: { promptKey: "tp.prompt.family", minChars: TP_MIN_CHARS },
    questions: 1, minScore: 1, showIntro: false,
  },
  {
    id: 5, track: "language", theme: "text-production", grade: 1, day: 3,
    emoji: "👑", titleKey: "lvl.tp.l5.title", subtitleKey: "lvl.tp.l5.sub",
    variant: "free", config: { promptKey: "tp.prompt.story", minChars: TP_MIN_CHARS },
    questions: 1, minScore: 1, showIntro: false,
  },
];
