import type { ConceptLevel } from "./level-types";
import { shuffle, type LanguageQuestion } from "./questions";
import { SCIENCE_BANKS, type Fact } from "./sciences-banks";

function shuffleOptions<T>(answer: T, distractors: T[]): T[] {
  return shuffle([answer, ...distractors]);
}

function factToQuestion(fact: Fact): LanguageQuestion {
  return {
    type: "language",
    prompt: fact.prompt,
    context: fact.context,
    answer: fact.answer,
    options: shuffleOptions(fact.answer, fact.distractors.slice(0, 3)),
  };
}

export function buildSciencesQuestions(
  level: ConceptLevel,
): LanguageQuestion[] {
  const bank = SCIENCE_BANKS[level.theme] ?? [];
  if (bank.length === 0) return [];

  const out: LanguageQuestion[] = [];
  // Shuffle bank, take questions in order. If bank smaller than the
  // level's question count, pad by re-shuffling.
  const pool = shuffle(bank.slice());
  let i = 0;
  while (out.length < level.questions) {
    if (i >= pool.length) {
      // Reshuffle for more variety on small banks.
      pool.push(...shuffle(bank.slice()));
    }
    out.push(factToQuestion(pool[i]));
    i++;
  }
  return out;
}
