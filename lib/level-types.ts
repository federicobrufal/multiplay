import type { Track } from "./tracks";
import type { Grade } from "./grades";

export const Q_COUNT = 14;
export const MIN_PASS = 12;

export type LevelKind = "learn" | "mix";

interface BaseLevel {
  id: number;
  track: Track;
  /** Theme slug within the track (e.g. "tables", "nouns-verbs").
   * Multiple themes per track let us add new content without rewriting
   * the curriculum index. */
  theme: string;
  /** Grade this level belongs to (1°-7° primary). The active kid's grade
   * filters which content they see. */
  grade: Grade;
  day: 1 | 2 | 3;
  /** i18n key + vars for the level title. */
  titleKey: string;
  titleVars?: Record<string, string | number>;
  /** i18n key + vars for the subtitle. */
  subtitleKey: string;
  subtitleVars?: Record<string, string | number>;
  questions: number;
  minScore: number;
  emoji: string;
  /** Whether to show the full intro screen at the start of this level
   * (concept explanation + examples). Math levels always do. Language
   * uses it only on the first level of each topic. */
  showIntro: boolean;
}

/** Multiplication-tables math level (4° grado). */
export interface TablesMathLevel extends BaseLevel {
  track: "math";
  theme: "tables";
  kind: LevelKind;
  tables: number[];
  /** Optional — restrict factors (b in a×b) for "learn" levels (e.g. [1..5]) */
  factors?: number[];
}

/** Generic grade-1 math level. Each theme reads its own config bag. */
export interface Grade1MathLevel extends BaseLevel {
  track: "math";
  theme:
    | "counting-100"
    | "number-recognition"
    | "comparing-quantities"
    | "number-series"
    | "basic-shapes"
    | "simple-addition"
    | "simple-subtraction"
    | "daily-problems";
  variant: string;
  config?: {
    range?: [number, number];
    step?: number;
  };
}

export type MathLevel = TablesMathLevel | Grade1MathLevel;

export type LanguageTopic =
  | "noun-common"
  | "noun-proper"
  | "noun-mix"
  | "adjective"
  | "verb"
  | "final";

export type LanguageQuestionType =
  /** Identify a word of a given class among 4 options. */
  | "identify"
  /** Find the noun in a sentence with exactly one noun. */
  | "find-noun-1"
  /** Count how many nouns there are in a sentence (multiple nouns). */
  | "count-nouns"
  /** Classify a single word: common vs proper noun. */
  | "classify-noun"
  /** Classify a noun pulled out of a sentence: common vs proper. */
  | "classify-noun-in-sentence"
  /** Choose the correctly capitalized sentence. */
  | "capitalization"
  /** Adjective that best describes a given noun (subject). */
  | "describe-with-adjective"
  /** Find the adjective inside a sentence with one adjective. */
  | "find-adjective"
  /** Verb that expresses what a given subject does. */
  | "subject-verb"
  /** Find the verb inside a sentence with one verb. */
  | "find-verb"
  /** Mix of all language types (used by the final challenge). */
  | "all";

/** Existing nouns-and-verbs theme (4° grado). */
export interface NounsVerbsLevel extends BaseLevel {
  track: "language";
  theme: "nouns-verbs";
  topic: LanguageTopic;
  questionTypes: LanguageQuestionType[];
}

/** Variants of question generation for the letters-and-sounds theme. */
export type LettersVariant =
  /** Show a word's emoji, ask which letter it starts with. */
  | "letter-from-word"
  /** Show a letter, ask which one (visual recognition among similar letters). */
  | "letter-visual"
  /** Show a letter, ask which word (with emoji) starts with it. */
  | "word-from-letter"
  /** Ask which animal starts with X. */
  | "animal-from-letter"
  /** Ask which object/place starts with X. */
  | "object-from-letter"
  /** Show "_asa", ask which letter is missing. */
  | "missing-letter"
  /** Mix of all variants for review/final levels. */
  | "mix";

export interface LettersLevel extends BaseLevel {
  track: "language";
  theme: "letters-and-sounds";
  variant: LettersVariant;
  /** Letters in scope for this level (lowercase). For mix/final, this is the
   * full set the kid has seen so far. */
  letters: string[];
}

/** Grade 1 Lengua themes other than letters-and-sounds. */
export interface Grade1LenguaLevel extends BaseLevel {
  track: "language";
  theme:
    | "word-separation"
    | "simple-words-reading"
    | "writing-words"
    | "capitalization"
    | "simple-sentences"
    | "text-comprehension"
    | "text-production";
  variant: string;
  config?: {
    wordCount?: number;
    difficulty?: "easy" | "medium" | "hard";
    /** For text-production: i18n key for the writing prompt. */
    promptKey?: string;
    /** For text-production: minimum characters required to submit. */
    minChars?: number;
  };
}

/** Generic concept-MCQ level used by Sciences themes (curated facts). */
export interface ConceptLevel extends BaseLevel {
  track: "social-sciences" | "natural-sciences";
  theme: string;
  variant?: string;
}

export type LanguageLevel =
  | NounsVerbsLevel
  | LettersLevel
  | Grade1LenguaLevel;

export type Level = MathLevel | LanguageLevel | ConceptLevel;
