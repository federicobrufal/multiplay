/**
 * Bank of words + emojis indexed by their first letter (lowercase).
 * Used by the "Letras y sonidos" theme (1° grado).
 *
 * - Each word is concrete (recognizable by a 6-7yo).
 * - Each word has an emoji that visually represents it.
 * - Words are split into `animal` and `object` categories so question
 *   variants like "¿qué animal empieza con G?" can filter accordingly.
 */

export type WordCategory = "animal" | "object";

export interface LetterWord {
  word: string;
  emoji: string;
  category: WordCategory;
}

export const LETTER_WORDS: Record<string, LetterWord[]> = {
  a: [
    { word: "araña", emoji: "🕷️", category: "animal" },
    { word: "abeja", emoji: "🐝", category: "animal" },
    { word: "avión", emoji: "✈️", category: "object" },
    { word: "auto", emoji: "🚗", category: "object" },
  ],
  b: [
    { word: "barco", emoji: "⛵", category: "object" },
    { word: "banana", emoji: "🍌", category: "object" },
    { word: "ballena", emoji: "🐋", category: "animal" },
  ],
  c: [
    { word: "casa", emoji: "🏠", category: "object" },
    { word: "caballo", emoji: "🐴", category: "animal" },
    { word: "cama", emoji: "🛏️", category: "object" },
    { word: "conejo", emoji: "🐰", category: "animal" },
  ],
  d: [
    { word: "dado", emoji: "🎲", category: "object" },
    { word: "delfín", emoji: "🐬", category: "animal" },
  ],
  e: [
    { word: "elefante", emoji: "🐘", category: "animal" },
    { word: "estrella", emoji: "⭐", category: "object" },
  ],
  f: [
    { word: "flor", emoji: "🌸", category: "object" },
    { word: "foca", emoji: "🦭", category: "animal" },
    { word: "frutilla", emoji: "🍓", category: "object" },
  ],
  g: [
    { word: "gato", emoji: "🐈", category: "animal" },
    { word: "gallina", emoji: "🐔", category: "animal" },
    { word: "globo", emoji: "🎈", category: "object" },
  ],
  h: [
    { word: "helado", emoji: "🍦", category: "object" },
    { word: "hormiga", emoji: "🐜", category: "animal" },
  ],
  j: [
    { word: "jugo", emoji: "🧃", category: "object" },
    { word: "jirafa", emoji: "🦒", category: "animal" },
  ],
  l: [
    { word: "león", emoji: "🦁", category: "animal" },
    { word: "luna", emoji: "🌙", category: "object" },
    { word: "libro", emoji: "📕", category: "object" },
  ],
  m: [
    { word: "manzana", emoji: "🍎", category: "object" },
    { word: "mariposa", emoji: "🦋", category: "animal" },
    { word: "mono", emoji: "🐒", category: "animal" },
  ],
  n: [
    { word: "nube", emoji: "☁️", category: "object" },
  ],
  o: [
    { word: "oso", emoji: "🐻", category: "animal" },
    { word: "ojo", emoji: "👁️", category: "object" },
  ],
  p: [
    { word: "perro", emoji: "🐶", category: "animal" },
    { word: "pelota", emoji: "⚽", category: "object" },
    { word: "pato", emoji: "🦆", category: "animal" },
    { word: "pizza", emoji: "🍕", category: "object" },
  ],
  q: [
    { word: "queso", emoji: "🧀", category: "object" },
  ],
  r: [
    { word: "ratón", emoji: "🐭", category: "animal" },
    { word: "rosa", emoji: "🌹", category: "object" },
    { word: "regalo", emoji: "🎁", category: "object" },
  ],
  s: [
    { word: "sol", emoji: "☀️", category: "object" },
    { word: "serpiente", emoji: "🐍", category: "animal" },
    { word: "sandía", emoji: "🍉", category: "object" },
  ],
  t: [
    { word: "tortuga", emoji: "🐢", category: "animal" },
    { word: "tomate", emoji: "🍅", category: "object" },
    { word: "tigre", emoji: "🐯", category: "animal" },
    { word: "torta", emoji: "🎂", category: "object" },
  ],
  u: [
    { word: "uva", emoji: "🍇", category: "object" },
  ],
  v: [
    { word: "vaca", emoji: "🐄", category: "animal" },
    { word: "vela", emoji: "🕯️", category: "object" },
  ],
  y: [
    { word: "yo-yo", emoji: "🪀", category: "object" },
  ],
  z: [
    { word: "zapato", emoji: "👟", category: "object" },
    { word: "zorro", emoji: "🦊", category: "animal" },
  ],
};

/** Letter groups used to gate which letters appear in each level. */
export const VOWELS = ["a", "e", "i", "o", "u"];
export const CONSONANTS_1 = ["m", "p", "s", "l", "t"]; // primeras consonantes simples
export const CONSONANTS_2 = ["b", "d", "f", "g", "n", "r"];
export const CONSONANTS_3 = ["c", "v", "j", "h", "z", "y", "q"];

/** All letters present in the bank. */
export const ALL_LETTERS = Object.keys(LETTER_WORDS);

/** Pairs of visually-similar letters for the "letter-visual" variant. */
export const VISUALLY_SIMILAR: Record<string, string[]> = {
  d: ["b", "p", "q"],
  b: ["d", "p", "q"],
  p: ["q", "b", "d"],
  q: ["p", "b", "d"],
  m: ["n", "w", "h"],
  n: ["m", "h", "u"],
  o: ["c", "q", "g"],
  c: ["g", "o", "e"],
  g: ["q", "o", "c"],
  e: ["c", "f", "l"],
  f: ["e", "t", "l"],
  l: ["i", "t", "f"],
  t: ["f", "l", "i"],
  i: ["l", "j", "t"],
  v: ["w", "u", "y"],
  u: ["v", "n", "w"],
};

/** Pick a random word for a letter. */
export function wordFor(letter: string): LetterWord | undefined {
  const list = LETTER_WORDS[letter];
  if (!list || list.length === 0) return undefined;
  return list[Math.floor(Math.random() * list.length)];
}

/** Pick a word for a letter filtered by category. Returns undefined
 * if no word in that category exists for the letter. */
export function wordForCategory(
  letter: string,
  category: WordCategory,
): LetterWord | undefined {
  const list = (LETTER_WORDS[letter] ?? []).filter(
    (w) => w.category === category,
  );
  if (list.length === 0) return undefined;
  return list[Math.floor(Math.random() * list.length)];
}

/** Letters that have at least one word in the given category. */
export function lettersWithCategory(
  letters: string[],
  category: WordCategory,
): string[] {
  return letters.filter((l) =>
    (LETTER_WORDS[l] ?? []).some((w) => w.category === category),
  );
}
