import type { Grade4MathLevel } from "./level-types";
import { shuffle, type LanguageQuestion } from "./questions";

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr.slice()).slice(0, n);
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleOptions<T>(answer: T, distractors: T[]): T[] {
  return shuffle([answer, ...distractors]);
}

function fmt(n: number): string {
  // Format integer with thousands separator (Spanish style: dot).
  return n.toLocaleString("es-AR");
}

function numericDistractors(answer: number, range: [number, number]): string[] {
  const [min, max] = range;
  const candidates = new Set<number>();
  // For large numbers, use bigger deltas.
  const span = Math.max(2, Math.floor((max - min) / 100));
  for (const d of [-1, 1, -2, 2, -span, span, -span * 2, span * 2, 10, -10]) {
    const v = answer + d;
    if (v >= min && v <= max && v !== answer) candidates.add(v);
  }
  while (candidates.size < 3) {
    const v = randInt(min, max);
    if (v !== answer) candidates.add(v);
  }
  return pickN([...candidates], 3).map(fmt);
}

// ---------------- numbers-10k ----------------

const NUM_WORDS_BASIC: Record<number, string> = {
  1: "uno", 2: "dos", 3: "tres", 4: "cuatro", 5: "cinco",
  6: "seis", 7: "siete", 8: "ocho", 9: "nueve", 10: "diez",
  11: "once", 12: "doce", 13: "trece", 14: "catorce", 15: "quince",
  16: "dieciséis", 17: "diecisiete", 18: "dieciocho", 19: "diecinueve",
  20: "veinte", 30: "treinta", 40: "cuarenta", 50: "cincuenta",
  60: "sesenta", 70: "setenta", 80: "ochenta", 90: "noventa",
  100: "cien", 200: "doscientos", 300: "trescientos", 400: "cuatrocientos",
  500: "quinientos", 600: "seiscientos", 700: "setecientos",
  800: "ochocientos", 900: "novecientos", 1000: "mil",
};

function numToWords(n: number): string {
  if (NUM_WORDS_BASIC[n]) return NUM_WORDS_BASIC[n];
  if (n < 100) {
    const tens = Math.floor(n / 10) * 10;
    const ones = n - tens;
    if (n < 30) {
      // 21-29 are special: veintiuno, veintidós...
      if (tens === 20) return "veinti" + NUM_WORDS_BASIC[ones];
    }
    return NUM_WORDS_BASIC[tens] + " y " + NUM_WORDS_BASIC[ones];
  }
  if (n < 1000) {
    const hundreds = Math.floor(n / 100) * 100;
    const rest = n - hundreds;
    const hStr = hundreds === 100 ? "ciento" : NUM_WORDS_BASIC[hundreds];
    return rest === 0 ? NUM_WORDS_BASIC[hundreds] : `${hStr} ${numToWords(rest)}`;
  }
  if (n < 10000) {
    const thousands = Math.floor(n / 1000);
    const rest = n - thousands * 1000;
    const tStr = thousands === 1 ? "mil" : `${numToWords(thousands)} mil`;
    return rest === 0 ? tStr : `${tStr} ${numToWords(rest)}`;
  }
  return String(n);
}

function buildNumbers10k(level: Grade4MathLevel): LanguageQuestion {
  const variant = level.variant;
  const range = level.config?.range ?? [1000, 9999];

  if (variant === "digit-to-word") {
    const n = randInt(range[0], range[1]);
    const answer = numToWords(n);
    const distractors: string[] = [];
    while (distractors.length < 3) {
      const m = randInt(range[0], range[1]);
      const w = numToWords(m);
      if (w !== answer && !distractors.includes(w)) distractors.push(w);
    }
    return {
      type: "language",
      prompt: "¿Cómo se escribe en letras?",
      context: fmt(n),
      answer,
      options: shuffleOptions(answer, distractors),
    };
  }
  if (variant === "word-to-digit") {
    const n = randInt(range[0], range[1]);
    const answer = fmt(n);
    return {
      type: "language",
      prompt: "¿Qué número es?",
      context: numToWords(n),
      answer,
      options: shuffleOptions(answer, numericDistractors(n, range)),
    };
  }
  if (variant === "place-value") {
    const n = randInt(range[0], range[1]);
    const positions = ["unidad", "decena", "centena", "unidad de mil"];
    const digits = String(n).split("").reverse(); // index = power
    const idx = randInt(0, Math.min(3, digits.length - 1));
    const digit = digits[idx];
    return {
      type: "language",
      prompt: `En el número ${fmt(n)}, el dígito en la ${positions[idx]} es:`,
      answer: digit,
      options: shuffleOptions(
        digit,
        ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
          .filter((d) => d !== digit)
          .slice(0, 3),
      ),
    };
  }
  if (variant === "compare") {
    const a = randInt(range[0], range[1]);
    let b = randInt(range[0], range[1]);
    while (b === a) b = randInt(range[0], range[1]);
    const answer = a > b ? "mayor que" : "menor que";
    return {
      type: "language",
      prompt: `${fmt(a)} es ____ ${fmt(b)}`,
      answer,
      options: shuffle(["mayor que", "menor que", "igual a"]),
    };
  }
  // mix
  return buildNumbers10k({
    ...level,
    variant: pick(["digit-to-word", "word-to-digit", "place-value", "compare"]),
  });
}

// ---------------- addition-subtraction-carry ----------------

function buildAddSubCarry(level: Grade4MathLevel): LanguageQuestion {
  const variant = level.variant;
  const range = level.config?.range ?? [10, 999];

  if (variant === "sum") {
    const a = randInt(range[0], range[1]);
    const b = randInt(range[0], range[1]);
    const answer = a + b;
    return {
      type: "language",
      prompt: "¿Cuánto es?",
      context: `${fmt(a)} + ${fmt(b)} = ?`,
      answer: fmt(answer),
      options: shuffleOptions(fmt(answer), numericDistractors(answer, [1, range[1] * 2])),
    };
  }
  if (variant === "sub") {
    const a = randInt(range[0] + 50, range[1]);
    const b = randInt(range[0], a - 1);
    const answer = a - b;
    return {
      type: "language",
      prompt: "¿Cuánto es?",
      context: `${fmt(a)} - ${fmt(b)} = ?`,
      answer: fmt(answer),
      options: shuffleOptions(fmt(answer), numericDistractors(answer, [0, range[1]])),
    };
  }
  if (variant === "missing") {
    const a = randInt(range[0], range[1]);
    const b = randInt(range[0], range[1]);
    const total = a + b;
    return {
      type: "language",
      prompt: "¿Qué número falta?",
      context: `${fmt(a)} + ? = ${fmt(total)}`,
      answer: fmt(b),
      options: shuffleOptions(fmt(b), numericDistractors(b, [1, range[1] * 2])),
    };
  }
  // mix
  return buildAddSubCarry({
    ...level,
    variant: pick(["sum", "sub", "missing"]),
  });
}

// ---------------- multiplication-1digit ----------------

function buildMult1(level: Grade4MathLevel): LanguageQuestion {
  const variant = level.variant;
  const range = level.config?.range ?? [10, 999];

  if (variant === "mult") {
    const a = randInt(range[0], range[1]);
    const b = randInt(2, 9);
    const answer = a * b;
    return {
      type: "language",
      prompt: "¿Cuánto es?",
      context: `${fmt(a)} × ${b} = ?`,
      answer: fmt(answer),
      options: shuffleOptions(fmt(answer), numericDistractors(answer, [1, range[1] * 9])),
    };
  }
  if (variant === "missing") {
    const a = randInt(range[0], range[1]);
    const b = randInt(2, 9);
    const product = a * b;
    return {
      type: "language",
      prompt: "¿Qué número falta?",
      context: `${fmt(a)} × ? = ${fmt(product)}`,
      answer: String(b),
      options: shuffleOptions(String(b), pickN(["2", "3", "4", "5", "6", "7", "8", "9"].filter((n) => n !== String(b)), 3)),
    };
  }
  // mix
  return buildMult1({ ...level, variant: pick(["mult", "missing"]) });
}

// ---------------- multiplication-2digit ----------------

function buildMult2(level: Grade4MathLevel): LanguageQuestion {
  const variant = level.variant;
  const range = level.config?.range ?? [10, 999];

  if (variant === "mult2") {
    const a = randInt(range[0], range[1]);
    const b = randInt(11, 99);
    const answer = a * b;
    return {
      type: "language",
      prompt: "¿Cuánto es?",
      context: `${fmt(a)} × ${b} = ?`,
      answer: fmt(answer),
      options: shuffleOptions(fmt(answer), numericDistractors(answer, [1, range[1] * 99])),
    };
  }
  // mix
  return buildMult2({ ...level, variant: "mult2" });
}

// ---------------- simple-division ----------------

function buildDivision(level: Grade4MathLevel): LanguageQuestion {
  const variant = level.variant;
  const range = level.config?.range ?? [10, 100];

  if (variant === "div") {
    const divisor = randInt(2, 9);
    const quotient = randInt(2, Math.max(2, Math.floor(range[1] / divisor)));
    const dividend = divisor * quotient;
    return {
      type: "language",
      prompt: "¿Cuánto es?",
      context: `${fmt(dividend)} ÷ ${divisor} = ?`,
      answer: String(quotient),
      options: shuffleOptions(String(quotient), numericDistractors(quotient, [1, range[1]])),
    };
  }
  if (variant === "missing") {
    const divisor = randInt(2, 9);
    const quotient = randInt(2, 20);
    const dividend = divisor * quotient;
    return {
      type: "language",
      prompt: "¿Qué número falta?",
      context: `${fmt(dividend)} ÷ ? = ${quotient}`,
      answer: String(divisor),
      options: shuffleOptions(String(divisor), pickN(["2", "3", "4", "5", "6", "7", "8", "9"].filter((n) => n !== String(divisor)), 3)),
    };
  }
  return buildDivision({ ...level, variant: pick(["div", "missing"]) });
}

// ---------------- problem-solving ----------------

const STORY_ADD_TPL = (a: number, b: number) => [
  `Tengo ${a} figuritas y consigo ${b} más. ¿Cuántas tengo en total?`,
  `En la biblioteca hay ${a} libros. Compran ${b} más. ¿Cuántos libros hay ahora?`,
  `Junté ${a} pesos para mi cumple y mi tía me da ${b} más. ¿Cuántos junto?`,
];

const STORY_SUB_TPL = (a: number, b: number) => [
  `Tenía ${a} caramelos y comí ${b}. ¿Cuántos me quedan?`,
  `Había ${a} pájaros en el árbol y se fueron ${b}. ¿Cuántos quedan?`,
  `Compré ${a} pesos de comida y me dieron ${b} de vuelto. ¿Cuánto pagué?`,
];

const STORY_MULT_TPL = (a: number, b: number) => [
  `Hay ${a} cajas con ${b} lápices cada una. ¿Cuántos lápices hay en total?`,
  `Compré ${a} paquetes de ${b} caramelos cada uno. ¿Cuántos caramelos compré?`,
  `${a} amigos juntan ${b} figuritas cada uno. ¿Cuántas figuritas hay?`,
];

const STORY_DIV_TPL = (a: number, b: number) => [
  `Tengo ${a * b} galletitas y las reparto entre ${a} amigos. ¿Cuántas le toca a cada uno?`,
  `${a * b} alumnos se sientan en ${a} mesas. ¿Cuántos en cada mesa?`,
  `${a * b} caramelos se reparten en ${a} bolsas. ¿Cuántos hay en cada bolsa?`,
];

function buildProblemSolving(level: Grade4MathLevel): LanguageQuestion {
  const variant = level.variant;
  const range = level.config?.range ?? [10, 99];

  if (variant === "story-add") {
    const a = randInt(range[0], Math.floor(range[1] / 2));
    const b = randInt(range[0], range[1] - a);
    const answer = a + b;
    const tpls = STORY_ADD_TPL(a, b);
    return {
      type: "language",
      prompt: pick(tpls),
      answer: fmt(answer),
      options: shuffleOptions(fmt(answer), numericDistractors(answer, [1, range[1] * 2])),
    };
  }
  if (variant === "story-sub") {
    const a = randInt(range[0] + 5, range[1]);
    const b = randInt(range[0], a - 1);
    const answer = a - b;
    const tpls = STORY_SUB_TPL(a, b);
    return {
      type: "language",
      prompt: pick(tpls),
      answer: fmt(answer),
      options: shuffleOptions(fmt(answer), numericDistractors(answer, [0, range[1]])),
    };
  }
  if (variant === "story-mult") {
    const a = randInt(2, range[1]);
    const b = randInt(2, range[1]);
    const answer = a * b;
    const tpls = STORY_MULT_TPL(a, b);
    return {
      type: "language",
      prompt: pick(tpls),
      answer: fmt(answer),
      options: shuffleOptions(fmt(answer), numericDistractors(answer, [1, a * b * 2])),
    };
  }
  if (variant === "story-div") {
    const a = randInt(2, range[1]);
    const b = randInt(2, range[1]);
    const answer = b;
    const tpls = STORY_DIV_TPL(a, b);
    return {
      type: "language",
      prompt: pick(tpls),
      answer: fmt(answer),
      options: shuffleOptions(fmt(answer), numericDistractors(answer, [1, range[1] * 2])),
    };
  }
  // story-mix
  return buildProblemSolving({
    ...level,
    variant: pick(["story-add", "story-sub", "story-mult", "story-div"]),
  });
}

// ---------------- tables-graphs (curated mini-datasets) ----------------

interface DataSet {
  context: string;
  data: Array<[string, number]>;
}

const DATA_SETS: DataSet[] = [
  {
    context: "Ventas por día",
    data: [["Lun", 5], ["Mar", 8], ["Mié", 3], ["Jue", 6]],
  },
  {
    context: "Goles por partido",
    data: [["P1", 2], ["P2", 4], ["P3", 1], ["P4", 3]],
  },
  {
    context: "Libros leídos por mes",
    data: [["Ene", 3], ["Feb", 5], ["Mar", 7], ["Abr", 2]],
  },
  {
    context: "Horas de estudio",
    data: [["Lun", 2], ["Mar", 3], ["Mié", 1], ["Jue", 4], ["Vie", 2]],
  },
  {
    context: "Frutas vendidas",
    data: [["Manzanas", 10], ["Peras", 6], ["Naranjas", 8]],
  },
];

function visualBar(n: number): string {
  return "▓".repeat(Math.min(n, 12));
}

function buildTablesGraphs(level: Grade4MathLevel): LanguageQuestion {
  const variant = level.variant;
  const ds = pick(DATA_SETS);
  const lines = ds.data
    .map(([k, v]) => `${k}: ${visualBar(v)} ${v}`)
    .join("\n");
  const ctx = `${ds.context}\n${lines}`;
  const labels = ds.data.map(([k]) => k);

  if (variant === "bar-most") {
    const max = Math.max(...ds.data.map(([, v]) => v));
    const winner = ds.data.find(([, v]) => v === max)![0];
    return {
      type: "language",
      prompt: "¿Cuál tiene MÁS?",
      context: ctx,
      answer: winner,
      options: shuffleOptions(winner, labels.filter((l) => l !== winner).slice(0, 3)),
    };
  }
  if (variant === "bar-least") {
    const min = Math.min(...ds.data.map(([, v]) => v));
    const winner = ds.data.find(([, v]) => v === min)![0];
    return {
      type: "language",
      prompt: "¿Cuál tiene MENOS?",
      context: ctx,
      answer: winner,
      options: shuffleOptions(winner, labels.filter((l) => l !== winner).slice(0, 3)),
    };
  }
  if (variant === "bar-total") {
    const total = ds.data.reduce((s, [, v]) => s + v, 0);
    return {
      type: "language",
      prompt: "¿Cuánto hay en total?",
      context: ctx,
      answer: String(total),
      options: shuffleOptions(
        String(total),
        [String(total + 1), String(total - 1), String(total + 2)],
      ),
    };
  }
  if (variant === "bar-diff") {
    const max = Math.max(...ds.data.map(([, v]) => v));
    const min = Math.min(...ds.data.map(([, v]) => v));
    const diff = max - min;
    return {
      type: "language",
      prompt: "¿Cuál es la diferencia entre el más alto y el más bajo?",
      context: ctx,
      answer: String(diff),
      options: shuffleOptions(
        String(diff),
        [String(diff + 1), String(diff - 1), String(diff + 2)],
      ),
    };
  }
  // mix
  return buildTablesGraphs({
    ...level,
    variant: pick(["bar-most", "bar-least", "bar-total", "bar-diff"]),
  });
}

// ---------------- Dispatcher ----------------

const themeBuilders: Record<
  Grade4MathLevel["theme"],
  (level: Grade4MathLevel) => LanguageQuestion
> = {
  "numbers-10k": buildNumbers10k,
  "addition-subtraction-carry": buildAddSubCarry,
  "multiplication-1digit": buildMult1,
  "multiplication-2digit": buildMult2,
  "simple-division": buildDivision,
  "problem-solving": buildProblemSolving,
  "tables-graphs": buildTablesGraphs,
};

export function buildGrade4MathQuestions(
  level: Grade4MathLevel,
): LanguageQuestion[] {
  const fn = themeBuilders[level.theme];
  const out: LanguageQuestion[] = [];
  const seen = new Set<string>();
  let safety = 0;
  const HARD_TRY = level.questions * 30;
  while (out.length < level.questions && safety < HARD_TRY) {
    safety++;
    const q = fn(level);
    const key = `${q.prompt}|${q.context ?? ""}|${q.answer}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  while (out.length < level.questions) {
    out.push(fn(level));
  }
  return out;
}
