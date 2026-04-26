import type { LettersLevel, LettersVariant } from "./level-types";
import { shuffle, type LanguageQuestion } from "./questions";
import {
  ALL_LETTERS,
  LETTER_WORDS,
  VISUALLY_SIMILAR,
  lettersWithCategory,
  wordFor,
  wordForCategory,
} from "./letters-bank";

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr.slice()).slice(0, n);
}

function shuffleOptions(answer: string, distractors: string[]): string[] {
  return shuffle([answer, ...distractors]);
}

const PROMPT = {
  letterFromWord: "¿Con qué letra empieza?",
  letterVisual: (letter: string) =>
    `¿Cuál es la letra "${letter.toUpperCase()}"?`,
  wordFromLetter: (letter: string) =>
    `¿Qué palabra empieza con "${letter.toUpperCase()}"?`,
  animalFromLetter: (letter: string) =>
    `¿Qué animal empieza con "${letter.toUpperCase()}"?`,
  objectFromLetter: (letter: string) =>
    `¿Qué cosa empieza con "${letter.toUpperCase()}"?`,
  missingLetter: "¿Qué letra falta?",
};

/** "¿Con qué letra empieza?" — show emoji of a word, ask its first letter. */
function buildLetterFromWord(letters: string[]): LanguageQuestion {
  const letter = pick(letters);
  const w = wordFor(letter);
  if (!w) {
    // Fallback: shouldn't happen if bank is well-defined.
    return buildLetterFromWord(ALL_LETTERS.filter((l) => wordFor(l)));
  }
  const distractors = pickN(
    letters.filter((l) => l !== letter),
    3,
  );
  const upper = (s: string) => s.toUpperCase();
  return {
    type: "language",
    prompt: PROMPT.letterFromWord,
    context: w.emoji,
    answer: upper(letter),
    options: shuffleOptions(upper(letter), distractors.map(upper)),
  };
}

/** Visual letter recognition — show a letter, options are visually similar. */
function buildLetterVisual(letters: string[]): LanguageQuestion {
  const letter = pick(letters);
  const similar = VISUALLY_SIMILAR[letter] ?? [];
  const pool = similar.length > 0
    ? similar
    : letters.filter((l) => l !== letter);
  const distractors = pickN(pool, 3);
  const upper = (s: string) => s.toUpperCase();
  return {
    type: "language",
    prompt: PROMPT.letterVisual(letter),
    answer: upper(letter),
    options: shuffleOptions(upper(letter), distractors.map(upper)),
  };
}

/** "¿Qué palabra empieza con X?" — show a letter, options are 4 words. */
function buildWordFromLetter(
  letters: string[],
  category?: "animal" | "object",
): LanguageQuestion {
  const eligible = category
    ? lettersWithCategory(letters, category)
    : letters.filter((l) => (LETTER_WORDS[l] ?? []).length > 0);
  if (eligible.length === 0) {
    // Fallback to any letters with words
    return buildWordFromLetter(ALL_LETTERS.filter((l) => wordFor(l)));
  }
  const letter = pick(eligible);
  const correct = category
    ? wordForCategory(letter, category)
    : wordFor(letter);
  if (!correct) return buildWordFromLetter(letters, category);

  const otherLetters = eligible.filter((l) => l !== letter);
  const distractorWords: string[] = [];
  for (const l of pickN(otherLetters, 6)) {
    const w = category ? wordForCategory(l, category) : wordFor(l);
    if (w && w.word !== correct.word) distractorWords.push(w.word);
    if (distractorWords.length >= 3) break;
  }
  const promptFn = category === "animal"
    ? PROMPT.animalFromLetter
    : category === "object"
    ? PROMPT.objectFromLetter
    : PROMPT.wordFromLetter;
  return {
    type: "language",
    prompt: promptFn(letter),
    answer: correct.word,
    options: shuffleOptions(correct.word, distractorWords.slice(0, 3)),
  };
}

/** "_asa" — show word with first letter missing, ask which letter fits. */
function buildMissingLetter(letters: string[]): LanguageQuestion {
  const letter = pick(letters);
  const w = wordFor(letter);
  if (!w) return buildMissingLetter(ALL_LETTERS.filter((l) => wordFor(l)));
  const masked = "_" + w.word.slice(1);
  const distractors = pickN(
    letters.filter((l) => l !== letter),
    3,
  );
  const upper = (s: string) => s.toUpperCase();
  return {
    type: "language",
    prompt: PROMPT.missingLetter,
    context: `${masked} ${w.emoji}`,
    answer: upper(letter),
    options: shuffleOptions(upper(letter), distractors.map(upper)),
  };
}

const MIX_VARIANTS: LettersVariant[] = [
  "letter-from-word",
  "letter-visual",
  "word-from-letter",
  "animal-from-letter",
  "object-from-letter",
  "missing-letter",
];

function buildOne(
  variant: LettersVariant,
  letters: string[],
): LanguageQuestion {
  switch (variant) {
    case "letter-from-word":
      return buildLetterFromWord(letters);
    case "letter-visual":
      return buildLetterVisual(letters);
    case "word-from-letter":
      return buildWordFromLetter(letters);
    case "animal-from-letter":
      return buildWordFromLetter(letters, "animal");
    case "object-from-letter":
      return buildWordFromLetter(letters, "object");
    case "missing-letter":
      return buildMissingLetter(letters);
    case "mix":
      return buildOne(pick(MIX_VARIANTS), letters);
  }
}

export function buildLettersQuestions(
  level: LettersLevel,
): LanguageQuestion[] {
  const out: LanguageQuestion[] = [];
  const seen = new Set<string>();
  let safety = 0;
  const HARD_TRY = level.questions * 30;
  while (out.length < level.questions && safety < HARD_TRY) {
    safety++;
    const q = buildOne(level.variant, level.letters);
    const key = `${q.prompt}|${q.context ?? ""}|${q.answer}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  while (out.length < level.questions) {
    out.push(buildOne(level.variant, level.letters));
  }
  return out;
}
