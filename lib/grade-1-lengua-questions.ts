import type { Grade1LenguaLevel } from "./level-types";
import {
  shuffle,
  type LanguageQuestion,
  type TextProductionQuestion,
} from "./questions";
import { LETTER_WORDS, ALL_LETTERS } from "./letters-bank";

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr.slice()).slice(0, n);
}

function shuffleOptions<T>(answer: T, distractors: T[]): T[] {
  return shuffle([answer, ...distractors]);
}

// ===== Banco de oraciones cortas (para separación / orden) =====

const SENTENCES_2: string[][] = [
  ["el", "sol"],
  ["la", "luna"],
  ["mi", "casa"],
  ["el", "perro"],
  ["mi", "gato"],
  ["la", "flor"],
  ["el", "auto"],
  ["la", "vaca"],
];

const SENTENCES_3: string[][] = [
  ["el", "perro", "corre"],
  ["mi", "gato", "duerme"],
  ["la", "vaca", "come"],
  ["el", "sol", "brilla"],
  ["la", "flor", "crece"],
  ["mi", "papá", "ríe"],
  ["el", "pato", "nada"],
  ["mi", "abuela", "canta"],
  ["el", "globo", "vuela"],
  ["el", "barco", "navega"],
  ["la", "luna", "ilumina"],
];

const SENTENCES_4: string[][] = [
  ["el", "perro", "corre", "rápido"],
  ["mi", "gato", "duerme", "tranquilo"],
  ["la", "vaca", "come", "pasto"],
  ["el", "sol", "brilla", "fuerte"],
  ["mi", "abuela", "cocina", "rico"],
  ["el", "pato", "nada", "feliz"],
  ["el", "auto", "anda", "lento"],
  ["mi", "hermano", "juega", "mucho"],
];

// ===== Banco de palabras simples para lectura =====

const SIMPLE_WORDS: Array<{ word: string; emoji: string }> = [];
for (const letter of ALL_LETTERS) {
  for (const w of LETTER_WORDS[letter] ?? []) {
    SIMPLE_WORDS.push({ word: w.word, emoji: w.emoji });
  }
}

// ===== Banco de nombres propios (para mayúscula) =====

const NAMES = ["Juan", "María", "Lucas", "Sofía", "Pedro", "Ana", "Tomás", "Lucía"];
const ACTIONS = [
  "juega",
  "come",
  "duerme",
  "corre",
  "canta",
  "salta",
  "ríe",
  "lee",
];

const SENTENCE_STARTS = [
  "el perro corre",
  "mi mamá cocina",
  "la luna brilla",
  "el sol sale",
  "mi gato duerme",
  "los niños juegan",
  "la flor crece",
];

// ===== Banco de stories cortas para comprensión =====

interface Story {
  text: string;
  questions: Array<{ q: string; answer: string; distractors: string[] }>;
}

const STORIES: Story[] = [
  {
    text: "Lucas tiene un perro llamado Rocky. Rocky es marrón y le gusta correr en el parque. Todas las tardes salen juntos.",
    questions: [
      { q: "¿Cómo se llama el perro?", answer: "Rocky", distractors: ["Lucas", "Toto", "Bobby"] },
      { q: "¿De qué color es Rocky?", answer: "marrón", distractors: ["negro", "blanco", "gris"] },
      { q: "¿Dónde corren juntos?", answer: "en el parque", distractors: ["en la casa", "en la escuela", "en la playa"] },
    ],
  },
  {
    text: "María va al colegio en bicicleta. Le gusta mucho la matemática y dibujar. Su mejor amiga se llama Sofía.",
    questions: [
      { q: "¿Cómo va María al colegio?", answer: "en bicicleta", distractors: ["en auto", "caminando", "en colectivo"] },
      { q: "¿Qué materia le gusta?", answer: "matemática", distractors: ["lengua", "música", "gimnasia"] },
      { q: "¿Cómo se llama su amiga?", answer: "Sofía", distractors: ["María", "Lucía", "Ana"] },
    ],
  },
  {
    text: "El gato Mimi se subió al árbol y no pudo bajar. Los bomberos llegaron y lo rescataron. Mimi volvió a su casa contento.",
    questions: [
      { q: "¿Cómo se llama el gato?", answer: "Mimi", distractors: ["Toto", "Rocky", "Pelusa"] },
      { q: "¿A dónde se subió?", answer: "al árbol", distractors: ["al techo", "al auto", "a la pared"] },
      { q: "¿Quiénes lo rescataron?", answer: "los bomberos", distractors: ["la policía", "los doctores", "los maestros"] },
    ],
  },
  {
    text: "Hoy es el cumpleaños de Pedro. Cumple 7 años. Sus amigos le trajeron muchos regalos y comieron torta de chocolate.",
    questions: [
      { q: "¿De quién es el cumpleaños?", answer: "de Pedro", distractors: ["de Juan", "de Lucas", "de Tomás"] },
      { q: "¿Cuántos años cumple?", answer: "7 años", distractors: ["6 años", "8 años", "5 años"] },
      { q: "¿De qué era la torta?", answer: "de chocolate", distractors: ["de vainilla", "de fresa", "de limón"] },
    ],
  },
  {
    text: "La maestra Ana enseña a leer y a escribir. Tiene 25 alumnos y a todos les da una manzana cuando llegan al colegio.",
    questions: [
      { q: "¿Cómo se llama la maestra?", answer: "Ana", distractors: ["María", "Lucía", "Sofía"] },
      { q: "¿Qué les da a los alumnos?", answer: "una manzana", distractors: ["un caramelo", "una banana", "un libro"] },
      { q: "¿Cuántos alumnos tiene?", answer: "25", distractors: ["20", "30", "15"] },
    ],
  },
];

// ===== Generadores =====

// Separación de palabras
function buildWordSeparation(level: Grade1LenguaLevel): LanguageQuestion {
  const variant = level.variant;
  let pool: string[][];
  if (variant === "split-2") pool = SENTENCES_2;
  else if (variant === "split-3") pool = SENTENCES_3;
  else if (variant === "split-4") pool = SENTENCES_4;
  else pool = pick([SENTENCES_2, SENTENCES_3, SENTENCES_4]);

  const sentence = pick(pool);
  const merged = sentence.join("");
  const correct = sentence.join(" ");

  // Distractor: insert space at wrong position
  const distractors: string[] = [];
  for (let i = 1; i < merged.length && distractors.length < 5; i++) {
    if (merged[i] === " ") continue;
    const fake = merged.slice(0, i) + " " + merged.slice(i);
    if (fake !== correct && !distractors.includes(fake)) {
      distractors.push(fake);
    }
  }
  // Add the merged version itself as a distractor too
  if (!distractors.includes(merged)) distractors.push(merged);

  return {
    type: "language",
    prompt: "¿Cuál es la separación correcta?",
    context: merged,
    answer: correct,
    options: shuffleOptions(correct, pickN(distractors, 3)),
  };
}

// Lectura de palabras simples
function buildReading(level: Grade1LenguaLevel): LanguageQuestion {
  const variant = level.variant;
  if (variant === "image-to-word" || variant === "mix") {
    if (Math.random() < 0.5 || variant === "image-to-word") {
      const target = pick(SIMPLE_WORDS);
      const distractors = pickN(
        SIMPLE_WORDS.filter((w) => w.word !== target.word),
        3,
      ).map((w) => w.word);
      return {
        type: "language",
        prompt: "¿Qué palabra es?",
        context: target.emoji,
        answer: target.word,
        options: shuffleOptions(target.word, distractors),
      };
    }
  }
  // word-to-image: show word, pick emoji
  const target = pick(SIMPLE_WORDS);
  const distractors = pickN(
    SIMPLE_WORDS.filter((w) => w.emoji !== target.emoji),
    3,
  ).map((w) => w.emoji);
  return {
    type: "language",
    prompt: `¿Cuál es ${target.word}?`,
    answer: target.emoji,
    options: shuffleOptions(target.emoji, distractors),
  };
}

// Escritura — completar palabra
function buildWriting(level: Grade1LenguaLevel): LanguageQuestion {
  const variant = level.variant;
  const target = pick(SIMPLE_WORDS);
  const word = target.word;

  let pos: number;
  if (variant === "missing-first") pos = 0;
  else if (variant === "missing-last") pos = word.length - 1;
  else if (variant === "missing-middle") {
    pos = Math.floor(word.length / 2);
  } else {
    // mix
    pos = Math.floor(Math.random() * word.length);
  }

  const correct = word[pos].toUpperCase();
  // Skip if it's an accented vowel (avoid showing accents in 4 options)
  if (!/^[A-ZÁÉÍÓÚÑ]$/.test(correct)) {
    return buildWriting(level);
  }
  const masked = word.slice(0, pos) + "_" + word.slice(pos + 1);

  const allLetters = "ABCDEFGHIJLMNOPQRSTUVZ".split("");
  const distractors = pickN(
    allLetters.filter((l) => l !== correct),
    3,
  );

  return {
    type: "language",
    prompt: "¿Qué letra falta?",
    context: `${masked} ${target.emoji}`,
    answer: correct,
    options: shuffleOptions(correct, distractors),
  };
}

// Mayúscula inicial — elegir versión correctamente capitalizada
function buildCapitalization(level: Grade1LenguaLevel): LanguageQuestion {
  const variant = level.variant;

  if (variant === "name" || (variant === "mix" && Math.random() < 0.5)) {
    const name = pick(NAMES);
    const action = pick(ACTIONS);
    const correct = `${name} ${action}`;
    const lc = name.toLowerCase();
    const distractors = [
      `${lc} ${action}`,
      `${lc} ${action.charAt(0).toUpperCase()}${action.slice(1)}`,
      `${name} ${action.charAt(0).toUpperCase()}${action.slice(1)}`,
    ];
    return {
      type: "language",
      prompt: "¿Cuál está bien escrito?",
      answer: correct,
      options: shuffleOptions(correct, distractors),
    };
  }
  // sentence-start
  const sentence = pick(SENTENCE_STARTS);
  const correct = sentence.charAt(0).toUpperCase() + sentence.slice(1);
  const lc = sentence;
  const distractors = [
    lc,
    sentence.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    correct.split(" ").map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
  ].filter((s) => s !== correct);
  return {
    type: "language",
    prompt: "¿Cuál está bien escrito?",
    answer: correct,
    options: shuffleOptions(correct, pickN(distractors, 3)),
  };
}

// Oraciones simples — orden de palabras (MCQ con 4 versiones)
function buildSimpleSentences(level: Grade1LenguaLevel): LanguageQuestion {
  const variant = level.variant;
  let pool: string[][];
  if (variant === "order-3") pool = SENTENCES_3;
  else if (variant === "order-4") pool = SENTENCES_4;
  else pool = pick([SENTENCES_3, SENTENCES_4]);

  const sentence = pick(pool);
  const correct = sentence.join(" ");

  // Build 3 wrong orderings
  const distractors: string[] = [];
  let attempts = 0;
  while (distractors.length < 3 && attempts < 30) {
    attempts++;
    const shuffled = shuffle(sentence.slice()).join(" ");
    if (shuffled !== correct && !distractors.includes(shuffled)) {
      distractors.push(shuffled);
    }
  }

  const shuffledForContext = shuffle(sentence.slice()).join(" / ");

  return {
    type: "language",
    prompt: "¿Cuál es el orden correcto?",
    context: shuffledForContext,
    answer: correct,
    options: shuffleOptions(correct, distractors),
  };
}

// Comprensión de textos
function buildComprehension(_level: Grade1LenguaLevel): LanguageQuestion {
  const story = pick(STORIES);
  const q = pick(story.questions);
  return {
    type: "language",
    prompt: q.q,
    context: story.text,
    answer: q.answer,
    options: shuffleOptions(q.answer, q.distractors),
  };
}

// ===== Producción de textos =====

function buildTextProduction(level: Grade1LenguaLevel): TextProductionQuestion {
  // The actual prompt text is rendered by the player via i18n
  // (it looks up `level.config.promptKey`). We pass the raw key here so
  // the player can resolve it.
  const promptKey = level.config?.promptKey ?? "tp.prompt.default";
  const minChars = level.config?.minChars ?? 30;
  return {
    type: "text-production",
    prompt: promptKey,
    minChars,
  };
}

// ===== Dispatcher =====

const themeBuilders: Record<
  Exclude<Grade1LenguaLevel["theme"], "text-production">,
  (level: Grade1LenguaLevel) => LanguageQuestion
> = {
  "word-separation": buildWordSeparation,
  "simple-words-reading": buildReading,
  "writing-words": buildWriting,
  "capitalization": buildCapitalization,
  "simple-sentences": buildSimpleSentences,
  "text-comprehension": buildComprehension,
};

export function buildGrade1LenguaQuestions(
  level: Grade1LenguaLevel,
): Array<LanguageQuestion | TextProductionQuestion> {
  if (level.theme === "text-production") {
    return [buildTextProduction(level)];
  }
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
