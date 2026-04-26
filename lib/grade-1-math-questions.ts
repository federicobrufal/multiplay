import type { Grade1MathLevel } from "./level-types";
import { shuffle, type LanguageQuestion } from "./questions";

// ===== Helpers =====

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr.slice()).slice(0, n);
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleOptions(answer: string, distractors: string[]): string[] {
  return shuffle([answer, ...distractors]);
}

/** Generate 3 numeric distractors close to the correct answer. */
function numericDistractors(answer: number, range: [number, number]): string[] {
  const [min, max] = range;
  const candidates = new Set<number>();
  for (let d of [-1, 1, -2, 2, -3, 3, -5, 5, 10, -10]) {
    const v = answer + d;
    if (v >= min && v <= max && v !== answer) candidates.add(v);
  }
  while (candidates.size < 3) {
    const v = randInt(min, max);
    if (v !== answer) candidates.add(v);
  }
  return pickN([...candidates], 3).map(String);
}

const NUM_WORDS_ES: Record<number, string> = {
  0: "cero", 1: "uno", 2: "dos", 3: "tres", 4: "cuatro", 5: "cinco",
  6: "seis", 7: "siete", 8: "ocho", 9: "nueve", 10: "diez",
  11: "once", 12: "doce", 13: "trece", 14: "catorce", 15: "quince",
  16: "dieciséis", 17: "diecisiete", 18: "dieciocho", 19: "diecinueve",
  20: "veinte", 21: "veintiuno", 22: "veintidós", 23: "veintitrés",
  24: "veinticuatro", 25: "veinticinco", 26: "veintiséis",
  27: "veintisiete", 28: "veintiocho", 29: "veintinueve", 30: "treinta",
};

function numToWord(n: number): string | undefined {
  return NUM_WORDS_ES[n];
}

const COUNT_EMOJIS = ["🔵", "🟢", "🟡", "🔴", "⭐", "🍎", "🐶", "❤️"];

/** Named emoji groups for the "compare groups" visual question, where
 * the kid picks the name of the group that has more. */
const NAMED_EMOJIS: Array<{ emoji: string; singular: string }> = [
  { emoji: "🍎", singular: "manzana" },
  { emoji: "🐶", singular: "perro" },
  { emoji: "❤️", singular: "corazón" },
  { emoji: "⭐", singular: "estrella" },
  { emoji: "🐱", singular: "gato" },
  { emoji: "🦋", singular: "mariposa" },
  { emoji: "🌸", singular: "flor" },
  { emoji: "🍌", singular: "banana" },
  { emoji: "⚽", singular: "pelota" },
  { emoji: "🎈", singular: "globo" },
  { emoji: "🐝", singular: "abeja" },
  { emoji: "🐟", singular: "pez" },
];

function emojiRow(n: number, emoji?: string): string {
  const e = emoji ?? pick(COUNT_EMOJIS);
  return Array.from({ length: n }, () => e).join("");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Spanish plural with the basic rules (handles -ón → -ones). */
function pluralEs(word: string): string {
  if (word.endsWith("ón")) return word.slice(0, -2) + "ones";
  if (word.endsWith("z")) return word.slice(0, -1) + "ces";
  const last = word.slice(-1);
  if ("aeiouáéíóú".includes(last)) return word + "s";
  return word + "es";
}

// ===== Conteo hasta 100 =====

function buildCounting(level: Grade1MathLevel): LanguageQuestion {
  const variant = level.variant;
  const range = level.config?.range ?? [1, 100];
  const step = level.config?.step ?? 1;

  if (variant === "next") {
    const n = randInt(range[0], range[1] - 1);
    const answer = String(n + 1);
    return {
      type: "language",
      prompt: `¿Qué número viene después de ${n}?`,
      answer,
      options: shuffleOptions(answer, numericDistractors(n + 1, range)),
    };
  }
  if (variant === "prev") {
    const n = randInt(range[0] + 1, range[1]);
    const answer = String(n - 1);
    return {
      type: "language",
      prompt: `¿Qué número viene antes de ${n}?`,
      answer,
      options: shuffleOptions(answer, numericDistractors(n - 1, range)),
    };
  }
  if (variant === "skip") {
    const start = randInt(range[0], range[1] - step * 4);
    const sequence = [start, start + step, start + step * 2];
    const answer = String(start + step * 3);
    return {
      type: "language",
      prompt: "¿Qué número sigue?",
      context: sequence.join(" · ") + " · ?",
      answer,
      options: shuffleOptions(
        answer,
        numericDistractors(start + step * 3, range),
      ),
    };
  }
  if (variant === "count-objects") {
    const n = randInt(range[0], range[1]);
    return {
      type: "language",
      prompt: "¿Cuántos hay?",
      context: emojiRow(n),
      answer: String(n),
      options: shuffleOptions(String(n), numericDistractors(n, range)),
    };
  }
  // mix
  const variants = ["next", "prev", "skip", "count-objects"];
  return buildCounting({ ...level, variant: pick(variants) });
}

// ===== Reconocer números =====

function buildNumberRecognition(level: Grade1MathLevel): LanguageQuestion {
  const variant = level.variant;
  const range = level.config?.range ?? [1, 30];

  if (variant === "word-to-digit") {
    let n = randInt(range[0], Math.min(range[1], 30));
    if (!numToWord(n)) n = randInt(1, 20);
    const word = numToWord(n)!;
    const answer = String(n);
    return {
      type: "language",
      prompt: `¿Qué número es "${word}"?`,
      answer,
      options: shuffleOptions(answer, numericDistractors(n, range)),
    };
  }
  if (variant === "digit-to-word") {
    let n = randInt(range[0], Math.min(range[1], 30));
    if (!numToWord(n)) n = randInt(1, 20);
    const answer = numToWord(n)!;
    const distractors: string[] = [];
    while (distractors.length < 3) {
      const m = randInt(1, 30);
      const w = numToWord(m);
      if (w && w !== answer && !distractors.includes(w)) distractors.push(w);
    }
    return {
      type: "language",
      prompt: `¿Cómo se escribe el ${n}?`,
      answer,
      options: shuffleOptions(answer, distractors),
    };
  }
  if (variant === "count-to-digit") {
    const n = randInt(range[0], range[1]);
    return {
      type: "language",
      prompt: "¿Cuántos hay? Elegí el número.",
      context: emojiRow(n),
      answer: String(n),
      options: shuffleOptions(String(n), numericDistractors(n, range)),
    };
  }
  if (variant === "find-digit") {
    const n = randInt(range[0], range[1]);
    return {
      type: "language",
      prompt: `¿Cuál es el número ${numToWord(n) ?? n}?`,
      answer: String(n),
      options: shuffleOptions(String(n), numericDistractors(n, range)),
    };
  }
  // mix
  const variants = ["word-to-digit", "digit-to-word", "count-to-digit", "find-digit"];
  return buildNumberRecognition({ ...level, variant: pick(variants) });
}

// ===== Comparar cantidades =====

function buildComparing(level: Grade1MathLevel): LanguageQuestion {
  const variant = level.variant;
  const range = level.config?.range ?? [1, 100];

  if (variant === "visual") {
    const [opt1, opt2] = pickN(NAMED_EMOJIS, 2);
    const count1 = randInt(range[0], range[1]);
    let count2 = randInt(range[0], range[1]);
    while (count2 === count1) count2 = randInt(range[0], range[1]);
    const winner = count1 > count2 ? opt1 : opt2;
    const loser = count1 > count2 ? opt2 : opt1;
    const winnerName = capitalize(pluralEs(winner.singular));
    const loserName = capitalize(pluralEs(loser.singular));
    return {
      type: "language",
      prompt: "¿Qué grupo tiene más?",
      context: `${emojiRow(count1, opt1.emoji)}     ${emojiRow(count2, opt2.emoji)}`,
      answer: winnerName,
      options: shuffle([winnerName, loserName]),
    };
  }
  if (variant === "operator") {
    const a = randInt(range[0], range[1]);
    const b = randInt(range[0], range[1]);
    let answer: string;
    if (a > b) answer = "mayor que";
    else if (a < b) answer = "menor que";
    else answer = "igual a";
    return {
      type: "language",
      prompt: `${a} es ____ ${b}`,
      answer,
      options: shuffle(["mayor que", "menor que", "igual a"]),
    };
  }
  if (variant === "greater") {
    const opts = pickN(
      Array.from({ length: range[1] - range[0] + 1 }, (_, i) => i + range[0]),
      4,
    );
    const max = Math.max(...opts);
    return {
      type: "language",
      prompt: "¿Cuál es el número MAYOR?",
      answer: String(max),
      options: opts.map(String),
    };
  }
  if (variant === "smaller") {
    const opts = pickN(
      Array.from({ length: range[1] - range[0] + 1 }, (_, i) => i + range[0]),
      4,
    );
    const min = Math.min(...opts);
    return {
      type: "language",
      prompt: "¿Cuál es el número MENOR?",
      answer: String(min),
      options: opts.map(String),
    };
  }
  // mix
  const variants = ["visual", "operator", "greater", "smaller"];
  return buildComparing({ ...level, variant: pick(variants) });
}

// ===== Series numéricas =====

function buildSeries(level: Grade1MathLevel): LanguageQuestion {
  const variant = level.variant;
  const range = level.config?.range ?? [1, 100];
  const step = level.config?.step ?? 1;

  if (variant === "next-step") {
    const start = randInt(range[0], range[1] - step * 4);
    const sequence = [start, start + step, start + step * 2];
    const answer = String(start + step * 3);
    return {
      type: "language",
      prompt: "¿Qué número sigue?",
      context: sequence.join(" · ") + " · ?",
      answer,
      options: shuffleOptions(answer, numericDistractors(start + step * 3, range)),
    };
  }
  if (variant === "next-step-back") {
    const start = randInt(range[0] + step * 4, range[1]);
    const sequence = [start, start - step, start - step * 2];
    const answer = String(start - step * 3);
    return {
      type: "language",
      prompt: "¿Qué número sigue?",
      context: sequence.join(" · ") + " · ?",
      answer,
      options: shuffleOptions(answer, numericDistractors(start - step * 3, range)),
    };
  }
  if (variant === "missing-middle") {
    const start = randInt(range[0], range[1] - step * 3);
    const a = start;
    const missing = start + step;
    const c = start + step * 2;
    return {
      type: "language",
      prompt: "¿Qué número falta?",
      context: `${a} · ? · ${c}`,
      answer: String(missing),
      options: shuffleOptions(String(missing), numericDistractors(missing, range)),
    };
  }
  // mix
  const variants = ["next-step", "next-step-back", "missing-middle"];
  return buildSeries({
    ...level,
    variant: pick(variants),
    config: { ...level.config, step: pick([1, 2, 5, 10]) },
  });
}

// ===== Figuras geométricas =====

const SHAPES: Array<{ name: string; emoji: string; sides: number }> = [
  { name: "círculo", emoji: "⚪", sides: 0 },
  { name: "triángulo", emoji: "🔺", sides: 3 },
  { name: "cuadrado", emoji: "🟧", sides: 4 },
  { name: "estrella", emoji: "⭐", sides: 5 },
  { name: "rombo", emoji: "🔶", sides: 4 },
  { name: "corazón", emoji: "❤️", sides: 0 },
];

function buildShapes(level: Grade1MathLevel): LanguageQuestion {
  const variant = level.variant;

  if (variant === "name-to-shape") {
    const target = pick(SHAPES);
    const distractors = pickN(
      SHAPES.filter((s) => s.name !== target.name),
      3,
    );
    return {
      type: "language",
      prompt: `¿Cuál es un ${target.name}?`,
      answer: target.emoji,
      options: shuffleOptions(target.emoji, distractors.map((s) => s.emoji)),
    };
  }
  if (variant === "shape-to-name") {
    const target = pick(SHAPES);
    const distractors = pickN(
      SHAPES.filter((s) => s.name !== target.name),
      3,
    );
    return {
      type: "language",
      prompt: "¿Cómo se llama esta figura?",
      context: target.emoji,
      answer: target.name,
      options: shuffleOptions(target.name, distractors.map((s) => s.name)),
    };
  }
  if (variant === "count") {
    const target = pick(SHAPES);
    const targetCount = randInt(1, 8);
    const otherShapes = SHAPES.filter((s) => s.name !== target.name);
    const filler = pickN(otherShapes, 3);
    const fillerCount = randInt(2, 5);
    const fillers: string[] = [];
    for (let i = 0; i < fillerCount; i++) fillers.push(pick(filler).emoji);
    const arr: string[] = [];
    for (let i = 0; i < targetCount; i++) arr.push(target.emoji);
    arr.push(...fillers);
    const distractorPool = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
      .filter((n) => n !== String(targetCount));
    return {
      type: "language",
      prompt: `¿Cuántos ${pluralEs(target.name)} hay?`,
      context: shuffle(arr).join(" "),
      answer: String(targetCount),
      options: shuffleOptions(String(targetCount), pickN(distractorPool, 3)),
    };
  }
  if (variant === "sides") {
    const withSides = SHAPES.filter((s) => s.sides > 0);
    const target = pick(withSides);
    const answer = String(target.sides);
    return {
      type: "language",
      prompt: `¿Cuántos lados tiene un ${target.name}?`,
      context: target.emoji,
      answer,
      options: shuffleOptions(
        answer,
        ["3", "4", "5", "6"].filter((n) => n !== answer).slice(0, 3),
      ),
    };
  }
  // mix
  const variants = ["name-to-shape", "shape-to-name", "count", "sides"];
  return buildShapes({ ...level, variant: pick(variants) });
}

// ===== Sumas y restas =====

function buildAddition(level: Grade1MathLevel): LanguageQuestion {
  const variant = level.variant;
  const range = level.config?.range ?? [1, 20];

  if (variant === "sum") {
    const max = range[1];
    const a = randInt(1, Math.floor(max / 2));
    const b = randInt(1, max - a);
    const answer = a + b;
    return {
      type: "language",
      prompt: "¿Cuánto es?",
      context: `${a} + ${b} = ?`,
      answer: String(answer),
      options: shuffleOptions(String(answer), numericDistractors(answer, [1, max])),
    };
  }
  if (variant === "missing-addend") {
    const max = range[1];
    const a = randInt(1, max - 1);
    const total = randInt(a + 1, max);
    const missing = total - a;
    return {
      type: "language",
      prompt: "¿Qué número falta?",
      context: `${a} + ? = ${total}`,
      answer: String(missing),
      options: shuffleOptions(String(missing), numericDistractors(missing, [1, max])),
    };
  }
  if (variant === "visual") {
    const a = randInt(1, 5);
    const b = randInt(1, 5);
    return {
      type: "language",
      prompt: "¿Cuántos hay en total?",
      context: `${emojiRow(a)} + ${emojiRow(b)}`,
      answer: String(a + b),
      options: shuffleOptions(String(a + b), numericDistractors(a + b, [1, 20])),
    };
  }
  // mix
  const variants = ["sum", "missing-addend", "visual"];
  return buildAddition({ ...level, variant: pick(variants) });
}

function buildSubtraction(level: Grade1MathLevel): LanguageQuestion {
  const variant = level.variant;
  const range = level.config?.range ?? [1, 20];

  if (variant === "sub") {
    const max = range[1];
    const a = randInt(2, max);
    const b = randInt(1, a - 1);
    const answer = a - b;
    return {
      type: "language",
      prompt: "¿Cuánto es?",
      context: `${a} - ${b} = ?`,
      answer: String(answer),
      options: shuffleOptions(String(answer), numericDistractors(answer, [0, max])),
    };
  }
  if (variant === "missing-sub") {
    const max = range[1];
    const a = randInt(2, max);
    const result = randInt(1, a - 1);
    const missing = a - result;
    return {
      type: "language",
      prompt: "¿Qué número falta?",
      context: `${a} - ? = ${result}`,
      answer: String(missing),
      options: shuffleOptions(String(missing), numericDistractors(missing, [1, max])),
    };
  }
  if (variant === "visual") {
    const a = randInt(3, 8);
    const b = randInt(1, a - 1);
    return {
      type: "language",
      prompt: "Te quedás con...",
      context: `${emojiRow(a)} − ${emojiRow(b)}`,
      answer: String(a - b),
      options: shuffleOptions(String(a - b), numericDistractors(a - b, [0, 20])),
    };
  }
  // mix
  const variants = ["sub", "missing-sub", "visual"];
  return buildSubtraction({ ...level, variant: pick(variants) });
}

// ===== Problemas cotidianos =====

const STORY_ADD_TEMPLATES: Array<(a: number, b: number) => string> = [
  (a, b) => `Tengo ${a} caramelos y me dan ${b} más. ¿Cuántos tengo?`,
  (a, b) => `Hay ${a} pájaros en el árbol y vienen ${b} más. ¿Cuántos hay ahora?`,
  (a, b) => `Junté ${a} figuritas y mi amigo me regaló ${b}. ¿Cuántas tengo?`,
  (a, b) => `En el cumple comí ${a} galletitas y después ${b} más. ¿Cuántas en total?`,
];

const STORY_SUB_TEMPLATES: Array<(a: number, b: number) => string> = [
  (a, b) => `Tenía ${a} caramelos y comí ${b}. ¿Cuántos me quedan?`,
  (a, b) => `Había ${a} pájaros y se fueron ${b}. ¿Cuántos quedan?`,
  (a, b) => `Tengo ${a} figuritas y le regalo ${b} a mi amigo. ¿Cuántas me quedan?`,
  (a, b) => `Mi mamá compró ${a} manzanas y comimos ${b}. ¿Cuántas quedan?`,
];

function buildDailyProblems(level: Grade1MathLevel): LanguageQuestion {
  const variant = level.variant;
  const range = level.config?.range ?? [1, 20];

  if (variant === "story-add") {
    const max = range[1];
    const a = randInt(1, Math.floor(max / 2));
    const b = randInt(1, max - a);
    const tpl = pick(STORY_ADD_TEMPLATES);
    const answer = a + b;
    return {
      type: "language",
      prompt: tpl(a, b),
      answer: String(answer),
      options: shuffleOptions(String(answer), numericDistractors(answer, [0, max])),
    };
  }
  if (variant === "story-sub") {
    const max = range[1];
    const a = randInt(2, max);
    const b = randInt(1, a - 1);
    const tpl = pick(STORY_SUB_TEMPLATES);
    const answer = a - b;
    return {
      type: "language",
      prompt: tpl(a, b),
      answer: String(answer),
      options: shuffleOptions(String(answer), numericDistractors(answer, [0, max])),
    };
  }
  // mix
  return buildDailyProblems({
    ...level,
    variant: pick(["story-add", "story-sub"]),
  });
}

// ===== Central dispatcher =====

export function buildGrade1MathQuestions(
  level: Grade1MathLevel,
): LanguageQuestion[] {
  const fn = themeBuilders[level.theme];
  const out: LanguageQuestion[] = [];
  const seen = new Set<string>();
  let safety = 0;
  // Try hard to keep all questions unique. After enough tries, accept
  // duplicates so we always finish (small pools — like 6 shapes — would
  // otherwise loop forever).
  const HARD_TRY = level.questions * 30;
  while (out.length < level.questions && safety < HARD_TRY) {
    safety++;
    const q = fn(level);
    const key = `${q.prompt}|${q.context ?? ""}|${q.answer}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  // Fallback: pad with whatever the generator returns if we couldn't
  // hit `level.questions` unique items.
  while (out.length < level.questions) {
    out.push(fn(level));
  }
  return out;
}

const themeBuilders: Record<
  Grade1MathLevel["theme"],
  (level: Grade1MathLevel) => LanguageQuestion
> = {
  "counting-100": buildCounting,
  "number-recognition": buildNumberRecognition,
  "comparing-quantities": buildComparing,
  "number-series": buildSeries,
  "basic-shapes": buildShapes,
  "simple-addition": buildAddition,
  "simple-subtraction": buildSubtraction,
  "daily-problems": buildDailyProblems,
};
