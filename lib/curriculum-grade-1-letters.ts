import { questionsForGrade, minPassForGrade } from "./grades";
import type { LettersLevel, LettersVariant } from "./level-types";
import {
  CONSONANTS_1,
  CONSONANTS_2,
  CONSONANTS_3,
  VOWELS,
} from "./letters-bank";

interface Spec {
  variant: LettersVariant;
  letters: string[];
  emoji: string;
  titleKey: string;
  subtitleKey: string;
  day: 1 | 2 | 3;
}

const VOWELS_AND_C1 = [...VOWELS, ...CONSONANTS_1];
const FIRST_TWO_GROUPS = [...VOWELS, ...CONSONANTS_1, ...CONSONANTS_2];
const ALL_TAUGHT = [
  ...VOWELS,
  ...CONSONANTS_1,
  ...CONSONANTS_2,
  ...CONSONANTS_3,
];

const SPECS: Spec[] = [
  // 1-5: letter-from-word (¿con qué letra empieza X?), expanding letter groups
  {
    variant: "letter-from-word",
    letters: VOWELS,
    emoji: "🅰️",
    titleKey: "lvl.letters.l1.title",
    subtitleKey: "lvl.letters.l1.sub",
    day: 1,
  },
  {
    variant: "letter-from-word",
    letters: CONSONANTS_1,
    emoji: "🅱️",
    titleKey: "lvl.letters.l2.title",
    subtitleKey: "lvl.letters.l2.sub",
    day: 1,
  },
  {
    variant: "letter-from-word",
    letters: CONSONANTS_2,
    emoji: "🆎",
    titleKey: "lvl.letters.l3.title",
    subtitleKey: "lvl.letters.l3.sub",
    day: 1,
  },
  {
    variant: "letter-from-word",
    letters: CONSONANTS_3,
    emoji: "🔠",
    titleKey: "lvl.letters.l4.title",
    subtitleKey: "lvl.letters.l4.sub",
    day: 2,
  },
  {
    variant: "letter-from-word",
    letters: ALL_TAUGHT,
    emoji: "🔀",
    titleKey: "lvl.letters.l5.title",
    subtitleKey: "lvl.letters.l5.sub",
    day: 2,
  },

  // 6: visual letter recognition
  {
    variant: "letter-visual",
    letters: ALL_TAUGHT,
    emoji: "👀",
    titleKey: "lvl.letters.l6.title",
    subtitleKey: "lvl.letters.l6.sub",
    day: 2,
  },

  // 7: word-from-letter (¿qué palabra empieza con S?)
  {
    variant: "word-from-letter",
    letters: ALL_TAUGHT,
    emoji: "📖",
    titleKey: "lvl.letters.l7.title",
    subtitleKey: "lvl.letters.l7.sub",
    day: 2,
  },

  // 8: animals only
  {
    variant: "animal-from-letter",
    letters: ALL_TAUGHT,
    emoji: "🐾",
    titleKey: "lvl.letters.l8.title",
    subtitleKey: "lvl.letters.l8.sub",
    day: 3,
  },

  // 9: objects only
  {
    variant: "object-from-letter",
    letters: ALL_TAUGHT,
    emoji: "🎒",
    titleKey: "lvl.letters.l9.title",
    subtitleKey: "lvl.letters.l9.sub",
    day: 3,
  },

  // 10: mix of variants 1-9
  {
    variant: "mix",
    letters: ALL_TAUGHT,
    emoji: "🌟",
    titleKey: "lvl.letters.l10.title",
    subtitleKey: "lvl.letters.l10.sub",
    day: 3,
  },

  // 11: missing letter ("_asa")
  {
    variant: "missing-letter",
    letters: ALL_TAUGHT,
    emoji: "✏️",
    titleKey: "lvl.letters.l11.title",
    subtitleKey: "lvl.letters.l11.sub",
    day: 3,
  },

  // 12: final challenge
  {
    variant: "mix",
    letters: ALL_TAUGHT,
    emoji: "👑",
    titleKey: "lvl.letters.l12.title",
    subtitleKey: "lvl.letters.l12.sub",
    day: 3,
  },
];

export const LETTERS_LEVELS: LettersLevel[] = SPECS.map((s, i) => ({
  id: i + 1,
  track: "language",
  theme: "letters-and-sounds",
  grade: 1,
  day: s.day,
  emoji: s.emoji,
  titleKey: s.titleKey,
  subtitleKey: s.subtitleKey,
  variant: s.variant,
  letters: s.letters,
  questions: questionsForGrade(1),
  minScore: minPassForGrade(1),
  showIntro: i === 0, // intro only on first level
}));

// Reference to silence unused-import if VOWELS_AND_C1/FIRST_TWO_GROUPS are
// removed in future iterations — keeps the IIFE-style helpers above.
void VOWELS_AND_C1;
void FIRST_TWO_GROUPS;
