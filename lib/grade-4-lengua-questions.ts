import type { Grade4LenguaLevel } from "./level-types";
import {
  shuffle,
  type LanguageQuestion,
  type TextProductionQuestion,
} from "./questions";

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr.slice()).slice(0, n);
}

function shuffleOptions<T>(answer: T, distractors: T[]): T[] {
  return shuffle([answer, ...distractors]);
}

// =================================================================
//                       NARRATIVE COMPREHENSION
// =================================================================

interface Story {
  text: string;
  questions: Array<{ q: string; answer: string; distractors: string[] }>;
}

const NARRATIVE_STORIES: Story[] = [
  {
    text: "Tomás caminaba por el bosque cuando encontró una pequeña ardilla atrapada bajo un tronco. Con cuidado levantó el tronco y la ardilla salió corriendo entre los árboles. Tomás siguió su camino contento por haberla ayudado.",
    questions: [
      { q: "¿Quién es el personaje principal?", answer: "Tomás", distractors: ["la ardilla", "el bosque", "el tronco"] },
      { q: "¿Dónde transcurre la historia?", answer: "en el bosque", distractors: ["en la escuela", "en su casa", "en la playa"] },
      { q: "¿Qué animal aparece?", answer: "una ardilla", distractors: ["un perro", "un pájaro", "un gato"] },
      { q: "¿Qué hizo Tomás?", answer: "ayudó a la ardilla", distractors: ["la atacó", "la ignoró", "la asustó"] },
    ],
  },
  {
    text: "La pequeña Lucía perdió su juguete favorito en el parque. Lloró durante un rato hasta que su mamá tuvo una idea: volvieron al banco donde habían comido y allí estaba el juguete, esperándola.",
    questions: [
      { q: "¿Qué perdió Lucía?", answer: "su juguete favorito", distractors: ["su mochila", "su libro", "su dinero"] },
      { q: "¿Dónde lo perdió?", answer: "en el parque", distractors: ["en la escuela", "en casa", "en el cine"] },
      { q: "¿Quién la ayudó?", answer: "su mamá", distractors: ["un amigo", "su papá", "la maestra"] },
      { q: "¿Dónde estaba el juguete?", answer: "en el banco del parque", distractors: ["en su casa", "en la escuela", "en la calle"] },
    ],
  },
  {
    text: "Era un día muy frío. Mateo y su perro Toby decidieron salir a caminar. Toby corría feliz entre la nieve mientras Mateo lo seguía abrigado con su gorro y su bufanda.",
    questions: [
      { q: "¿Cómo se llama el perro?", answer: "Toby", distractors: ["Mateo", "Rocky", "Bobby"] },
      { q: "¿Cómo estaba el día?", answer: "frío con nieve", distractors: ["caluroso", "lluvioso", "ventoso"] },
      { q: "¿Qué llevaba Mateo?", answer: "gorro y bufanda", distractors: ["malla y ojotas", "remera", "uniforme"] },
      { q: "¿Cómo se sentía el perro?", answer: "feliz", distractors: ["triste", "asustado", "enojado"] },
    ],
  },
  {
    text: "Ana plantó una semilla en una maceta y la regó todos los días. Después de varias semanas, una pequeña planta empezó a crecer. Ana estaba muy orgullosa de su trabajo.",
    questions: [
      { q: "¿Qué plantó Ana?", answer: "una semilla", distractors: ["un árbol grande", "una flor", "un cactus"] },
      { q: "¿Dónde la plantó?", answer: "en una maceta", distractors: ["en el jardín", "en el parque", "en la calle"] },
      { q: "¿Cada cuánto la regaba?", answer: "todos los días", distractors: ["nunca", "una vez", "los domingos"] },
      { q: "¿Cómo se sintió Ana al verla crecer?", answer: "orgullosa", distractors: ["triste", "enojada", "aburrida"] },
    ],
  },
];

function buildNarrativeComprehension(): LanguageQuestion {
  const story = pick(NARRATIVE_STORIES);
  const q = pick(story.questions);
  return {
    type: "language",
    prompt: q.q,
    context: story.text,
    answer: q.answer,
    options: shuffleOptions(q.answer, q.distractors),
  };
}

// =================================================================
//                       EVENT SEQUENCE
// =================================================================

const EVENT_SEQUENCES: Array<{ events: string[] }> = [
  { events: ["Se despertó", "Desayunó", "Se durmió"] },
  { events: ["Cocinó la pasta", "Hirvió el agua", "Comió"] },
  { events: ["Plantó la semilla", "La regó cada día", "Apareció la flor"] },
  { events: ["Se puso la pijama", "Se cepilló los dientes", "Se durmió"] },
  { events: ["Compró las entradas", "Llegó al cine", "Vio la película"] },
  { events: ["Encendió la compu", "Escribió el trabajo", "Apagó la compu"] },
  { events: ["Fue al super", "Pagó en la caja", "Volvió a casa con las bolsas"] },
  { events: ["Se levantó", "Desayunó", "Fue a la escuela", "Volvió a casa"] },
  { events: ["Hizo la tarea", "Cenó", "Se acostó", "Se durmió"] },
];

function buildEventSequence(level: Grade4LenguaLevel): LanguageQuestion {
  const variant = level.variant;
  const wantedLength = variant === "order-4" ? 4 : 3;
  const candidates = EVENT_SEQUENCES.filter((s) => s.events.length === wantedLength);
  const seq = pick(candidates.length > 0 ? candidates : EVENT_SEQUENCES);
  const correct = seq.events.join(" → ");

  // Build 3 wrong orderings
  const distractors: string[] = [];
  let attempts = 0;
  while (distractors.length < 3 && attempts < 30) {
    attempts++;
    const shuffled = shuffle(seq.events.slice()).join(" → ");
    if (shuffled !== correct && !distractors.includes(shuffled)) {
      distractors.push(shuffled);
    }
  }

  return {
    type: "language",
    prompt: "¿Cuál es el orden correcto?",
    context: shuffle(seq.events.slice()).join(" / "),
    answer: correct,
    options: shuffleOptions(correct, distractors),
  };
}

// =================================================================
//                  CAPITALIZATION & PUNCTUATION
// =================================================================

const CAP_QUESTIONS: Array<{ correct: string; distractors: string[] }> = [
  { correct: "Juan juega al fútbol.", distractors: ["juan juega al fútbol.", "juan juega al fútbol", "Juan Juega al Fútbol."] },
  { correct: "María vive en Buenos Aires.", distractors: ["maría vive en buenos aires.", "María vive en buenos aires.", "maría vive en Buenos Aires"] },
  { correct: "Tomás compró un libro.", distractors: ["tomás compró un libro.", "Tomás Compró Un Libro.", "tomás Compró un libro"] },
  { correct: "Mi perro se llama Rocky.", distractors: ["Mi perro se llama rocky.", "mi perro se llama Rocky", "mi perro Se llama Rocky."] },
  { correct: "El río Paraná es muy largo.", distractors: ["el río Paraná es muy largo.", "El río paraná es muy largo.", "el río paraná es muy largo"] },
];

const PERIOD_QUESTIONS: Array<{ correct: string; distractors: string[] }> = [
  { correct: "El sol brilla.", distractors: ["El sol brilla", "el sol brilla", "El sol brilla,"] },
  { correct: "Hoy hace frío.", distractors: ["hoy hace frío.", "Hoy hace frío", "Hoy hace frio."] },
  { correct: "Mi mamá cocina rico.", distractors: ["mi mamá cocina rico.", "Mi mamá cocina rico", "Mi Mamá cocina rico."] },
  { correct: "El niño corre rápido.", distractors: ["el niño corre rápido.", "El niño corre rápido", "El Niño Corre rápido."] },
];

function buildCapitalizationPunctuation(level: Grade4LenguaLevel): LanguageQuestion {
  const variant = level.variant;
  let bank: typeof CAP_QUESTIONS;
  if (variant === "capital") bank = CAP_QUESTIONS;
  else if (variant === "period") bank = PERIOD_QUESTIONS;
  else bank = pick([CAP_QUESTIONS, PERIOD_QUESTIONS]);

  const item = pick(bank);
  return {
    type: "language",
    prompt: "¿Cuál está bien escrito?",
    answer: item.correct,
    options: shuffleOptions(item.correct, item.distractors.slice(0, 3)),
  };
}

// =================================================================
//                       WORD CLASSIFICATION
// =================================================================

const NOUNS_4 = ["perro", "casa", "escuela", "auto", "libro", "amigo", "ciudad", "puerta", "ventana", "manzana", "lápiz", "computadora", "silla", "música", "tiempo"];
const VERBS_4 = ["correr", "saltar", "comer", "leer", "escribir", "jugar", "estudiar", "pintar", "cantar", "bailar", "trabajar", "cocinar", "viajar"];
const ADJECTIVES_4 = ["alto", "rojo", "feliz", "rápido", "grande", "lindo", "viejo", "nuevo", "fuerte", "tranquilo", "amarillo", "frío", "valiente", "amable"];

const SENTENCES_FOR_CLASSIFY: Array<{ sentence: string; noun?: string; verb?: string; adjective?: string }> = [
  { sentence: "El perro grande corre rápido.", noun: "perro", verb: "corre", adjective: "grande" },
  { sentence: "Mi amigo lee un libro nuevo.", noun: "amigo", verb: "lee", adjective: "nuevo" },
  { sentence: "La casa amarilla es bonita.", noun: "casa", verb: "es", adjective: "amarilla" },
  { sentence: "Mi hermana canta canciones tristes.", noun: "hermana", verb: "canta", adjective: "tristes" },
  { sentence: "El niño valiente saltó alto.", noun: "niño", verb: "saltó", adjective: "valiente" },
];

function buildWordClassification(level: Grade4LenguaLevel): LanguageQuestion {
  const variant = level.variant;

  if (variant === "identify-noun") {
    const noun = pick(NOUNS_4);
    const distractors = [pick(VERBS_4), pick(ADJECTIVES_4), pick(VERBS_4)];
    return {
      type: "language",
      prompt: "¿Cuál es un sustantivo?",
      answer: noun,
      options: shuffleOptions(noun, distractors),
    };
  }
  if (variant === "identify-verb") {
    const verb = pick(VERBS_4);
    const distractors = [pick(NOUNS_4), pick(ADJECTIVES_4), pick(NOUNS_4)];
    return {
      type: "language",
      prompt: "¿Cuál es un verbo?",
      answer: verb,
      options: shuffleOptions(verb, distractors),
    };
  }
  if (variant === "identify-adjective") {
    const adj = pick(ADJECTIVES_4);
    const distractors = [pick(NOUNS_4), pick(VERBS_4), pick(NOUNS_4)];
    return {
      type: "language",
      prompt: "¿Cuál es un adjetivo?",
      answer: adj,
      options: shuffleOptions(adj, distractors),
    };
  }
  if (variant === "classify") {
    const target = pick([...NOUNS_4, ...VERBS_4, ...ADJECTIVES_4]);
    let answer = "Sustantivo";
    if (VERBS_4.includes(target)) answer = "Verbo";
    else if (ADJECTIVES_4.includes(target)) answer = "Adjetivo";
    return {
      type: "language",
      prompt: `La palabra "${target}" es:`,
      answer,
      options: shuffle(["Sustantivo", "Verbo", "Adjetivo"]),
    };
  }
  // mix — find a specific word in a sentence
  const item = pick(SENTENCES_FOR_CLASSIFY);
  const targetType = pick(["noun", "verb", "adjective"] as const);
  const correct =
    targetType === "noun"
      ? item.noun!
      : targetType === "verb"
      ? item.verb!
      : item.adjective!;
  const words = item.sentence.replace(".", "").split(" ");
  const distractors = pickN(
    words.filter((w) => w.toLowerCase() !== correct.toLowerCase()),
    3,
  );
  const promptByType: Record<typeof targetType, string> = {
    noun: "¿Cuál es el sustantivo?",
    verb: "¿Cuál es el verbo?",
    adjective: "¿Cuál es el adjetivo?",
  };
  return {
    type: "language",
    prompt: promptByType[targetType],
    context: item.sentence,
    answer: correct,
    options: shuffleOptions(correct, distractors),
  };
}

// =================================================================
//                  INFORMATIVE COMPREHENSION
// =================================================================

const INFO_TEXTS: Story[] = [
  {
    text: "Los pingüinos son aves que no pueden volar pero nadan muy bien. Viven en lugares fríos como la Antártida. Comen peces, calamares y krill. Las hembras y los machos turnan para cuidar el huevo.",
    questions: [
      { q: "¿Los pingüinos pueden volar?", answer: "no", distractors: ["sí", "solo a veces"] },
      { q: "¿Qué comen los pingüinos?", answer: "peces, calamares y krill", distractors: ["solo plantas", "solo carne", "frutas"] },
      { q: "¿Dónde viven?", answer: "en lugares fríos", distractors: ["en el desierto", "en la selva", "en la ciudad"] },
      { q: "¿Quién cuida el huevo?", answer: "el macho y la hembra", distractors: ["solo el macho", "solo la hembra", "los hijos"] },
    ],
  },
  {
    text: "El sol es una estrella enorme que está en el centro del sistema solar. La Tierra y otros 7 planetas giran alrededor. Sin el sol no habría vida porque da luz y calor.",
    questions: [
      { q: "¿Qué es el sol?", answer: "una estrella", distractors: ["un planeta", "una luna", "un cometa"] },
      { q: "¿Cuántos planetas giran a su alrededor?", answer: "8", distractors: ["3", "5", "10"] },
      { q: "¿Por qué es importante el sol?", answer: "da luz y calor", distractors: ["da agua", "da comida", "da viento"] },
      { q: "¿Qué pasa sin el sol?", answer: "no habría vida", distractors: ["llovería más", "haría calor", "nada"] },
    ],
  },
  {
    text: "Las plantas necesitan luz solar, agua y dióxido de carbono para hacer la fotosíntesis. En este proceso, producen oxígeno que respiramos. Por eso son tan importantes para los seres vivos.",
    questions: [
      { q: "¿Qué necesitan las plantas para la fotosíntesis?", answer: "luz solar, agua y CO2", distractors: ["solo agua", "solo sol", "solo viento"] },
      { q: "¿Qué producen las plantas?", answer: "oxígeno", distractors: ["dióxido de carbono", "nitrógeno", "humo"] },
      { q: "¿Por qué son importantes las plantas?", answer: "producen oxígeno", distractors: ["dan sombra solamente", "decoran", "ocupan espacio"] },
      { q: "¿Cómo se llama el proceso?", answer: "fotosíntesis", distractors: ["respiración", "digestión", "fermentación"] },
    ],
  },
];

function buildInformativeComprehension(): LanguageQuestion {
  const story = pick(INFO_TEXTS);
  const q = pick(story.questions);
  return {
    type: "language",
    prompt: q.q,
    context: story.text,
    answer: q.answer,
    options: shuffleOptions(q.answer, q.distractors),
  };
}

// =================================================================
//                    TEXT PRODUCTION (sentence/short)
// =================================================================

function buildTextProduction(level: Grade4LenguaLevel): TextProductionQuestion {
  const promptKey = level.config?.promptKey ?? "tp.prompt.default";
  const minChars = level.config?.minChars ?? 30;
  return {
    type: "text-production",
    prompt: promptKey,
    minChars,
  };
}

// =================================================================
//                          DISPATCHER
// =================================================================

const themeBuilders: Record<
  Exclude<Grade4LenguaLevel["theme"], "sentence-production" | "short-text-production">,
  (level: Grade4LenguaLevel) => LanguageQuestion
> = {
  "narrative-comprehension": () => buildNarrativeComprehension(),
  "event-sequence": buildEventSequence,
  "capitalization-punctuation": buildCapitalizationPunctuation,
  "word-classification": buildWordClassification,
  "informative-comprehension": () => buildInformativeComprehension(),
};

export function buildGrade4LenguaQuestions(
  level: Grade4LenguaLevel,
): Array<LanguageQuestion | TextProductionQuestion> {
  if (
    level.theme === "sentence-production" ||
    level.theme === "short-text-production"
  ) {
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
