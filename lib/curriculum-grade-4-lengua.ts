import { Q_COUNT, MIN_PASS } from "./level-types";
import type { Grade4LenguaLevel } from "./level-types";

interface Spec {
  variant: string;
  config?: Grade4LenguaLevel["config"];
  emoji: string;
  day: 1 | 2 | 3;
  showIntro?: boolean;
}

function buildLevels(
  theme: Grade4LenguaLevel["theme"],
  specs: Spec[],
  questionCount: number = Q_COUNT,
  minScore: number = MIN_PASS,
): Grade4LenguaLevel[] {
  return specs.map((s, i) => {
    const n = i + 1;
    const isFinal = i === specs.length - 1;
    return {
      id: n,
      track: "language" as const,
      theme,
      grade: 4 as const,
      day: s.day,
      emoji: s.emoji,
      titleKey: isFinal ? "level.numbered_final" : "level.numbered",
      titleVars: { n },
      subtitleKey: "level.numbered_sub",
      variant: s.variant,
      config: s.config,
      questions: questionCount,
      minScore,
      showIntro: s.showIntro ?? i === 0,
    };
  });
}

// ===== Narrative comprehension =====
export const NARRATIVE_COMPREHENSION_LEVELS = buildLevels(
  "narrative-comprehension",
  [
    { variant: "story", emoji: "📖", day: 1 },
    { variant: "story", emoji: "📖", day: 1 },
    { variant: "story", emoji: "📖", day: 2 },
    { variant: "story", emoji: "📖", day: 2 },
    { variant: "story", emoji: "📖", day: 3 },
    { variant: "story", emoji: "👑", day: 3 },
  ],
);

// ===== Event sequence =====
export const EVENT_SEQUENCE_LEVELS = buildLevels(
  "event-sequence",
  [
    { variant: "order-3", emoji: "🔢", day: 1 },
    { variant: "order-3", emoji: "🔢", day: 1 },
    { variant: "order-4", emoji: "🔢", day: 2 },
    { variant: "order-4", emoji: "🔢", day: 2 },
    { variant: "mix", emoji: "🔀", day: 3 },
    { variant: "mix", emoji: "👑", day: 3 },
  ],
);

// ===== Capitalization & punctuation =====
export const CAPITALIZATION_PUNCTUATION_LEVELS = buildLevels(
  "capitalization-punctuation",
  [
    { variant: "capital", emoji: "🔤", day: 1 },
    { variant: "capital", emoji: "🔤", day: 1 },
    { variant: "period", emoji: "📝", day: 2 },
    { variant: "period", emoji: "📝", day: 2 },
    { variant: "mix", emoji: "🔀", day: 3 },
    { variant: "mix", emoji: "👑", day: 3 },
  ],
);

// ===== Word classification =====
export const WORD_CLASSIFICATION_LEVELS = buildLevels(
  "word-classification",
  [
    { variant: "identify-noun", emoji: "🏷️", day: 1 },
    { variant: "identify-verb", emoji: "🏃", day: 1 },
    { variant: "identify-adjective", emoji: "🌈", day: 2 },
    { variant: "classify", emoji: "🔀", day: 2 },
    { variant: "classify", emoji: "🔀", day: 3 },
    { variant: "mix", emoji: "👑", day: 3 },
  ],
);

// ===== Informative comprehension =====
export const INFORMATIVE_COMPREHENSION_LEVELS = buildLevels(
  "informative-comprehension",
  [
    { variant: "info", emoji: "📚", day: 1 },
    { variant: "info", emoji: "📚", day: 2 },
    { variant: "info", emoji: "📚", day: 2 },
    { variant: "info", emoji: "📚", day: 3 },
    { variant: "info", emoji: "👑", day: 3 },
  ],
);

// ===== Sentence production (TextProduction) =====
export const SENTENCE_PRODUCTION_LEVELS = buildLevels(
  "sentence-production",
  [
    { variant: "free", config: { promptKey: "g4tp.sentence.school", minChars: 15 }, emoji: "🏫", day: 1 },
    { variant: "free", config: { promptKey: "g4tp.sentence.friend", minChars: 15 }, emoji: "👥", day: 1 },
    { variant: "free", config: { promptKey: "g4tp.sentence.family", minChars: 20 }, emoji: "👨‍👩‍👧", day: 2 },
    { variant: "free", config: { promptKey: "g4tp.sentence.weekend", minChars: 20 }, emoji: "🎉", day: 2 },
    { variant: "free", config: { promptKey: "g4tp.sentence.dream", minChars: 25 }, emoji: "💭", day: 3 },
  ],
  1,
  1,
);

// ===== Short text production (TextProduction) =====
export const SHORT_TEXT_PRODUCTION_LEVELS = buildLevels(
  "short-text-production",
  [
    { variant: "free", config: { promptKey: "g4tp.text.pet", minChars: 80 }, emoji: "🐶", day: 1 },
    { variant: "free", config: { promptKey: "g4tp.text.day", minChars: 80 }, emoji: "🌞", day: 2 },
    { variant: "free", config: { promptKey: "g4tp.text.adventure", minChars: 100 }, emoji: "🏞️", day: 2 },
    { variant: "free", config: { promptKey: "g4tp.text.summer", minChars: 100 }, emoji: "☀️", day: 3 },
    { variant: "free", config: { promptKey: "g4tp.text.invention", minChars: 120 }, emoji: "💡", day: 3 },
  ],
  1,
  1,
);
