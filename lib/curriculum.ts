import { MATH_LEVELS } from "./curriculum-math";
import { LANGUAGE_LEVELS } from "./curriculum-language";
import { LETTERS_LEVELS } from "./curriculum-grade-1-letters";
import {
  COUNTING_100_LEVELS,
  NUMBER_RECOGNITION_LEVELS,
  COMPARING_QUANTITIES_LEVELS,
  NUMBER_SERIES_LEVELS,
  BASIC_SHAPES_LEVELS,
  SIMPLE_ADDITION_LEVELS,
  SIMPLE_SUBTRACTION_LEVELS,
  DAILY_PROBLEMS_LEVELS,
} from "./curriculum-grade-1-math";
import {
  NUMBERS_10K_LEVELS,
  ADDITION_SUBTRACTION_CARRY_LEVELS,
  MULTIPLICATION_1DIGIT_LEVELS,
  MULTIPLICATION_2DIGIT_LEVELS,
  SIMPLE_DIVISION_LEVELS,
  PROBLEM_SOLVING_LEVELS,
  TABLES_GRAPHS_LEVELS,
} from "./curriculum-grade-4-math";
import {
  WORD_SEPARATION_LEVELS,
  SIMPLE_WORDS_READING_LEVELS,
  WRITING_WORDS_LEVELS,
  CAPITALIZATION_LEVELS,
  SIMPLE_SENTENCES_LEVELS,
  TEXT_COMPREHENSION_LEVELS,
  TEXT_PRODUCTION_LEVELS,
} from "./curriculum-grade-1-lengua";
import {
  NARRATIVE_COMPREHENSION_LEVELS,
  EVENT_SEQUENCE_LEVELS,
  CAPITALIZATION_PUNCTUATION_LEVELS,
  WORD_CLASSIFICATION_LEVELS,
  SENTENCE_PRODUCTION_LEVELS,
  INFORMATIVE_COMPREHENSION_LEVELS,
  SHORT_TEXT_PRODUCTION_LEVELS,
} from "./curriculum-grade-4-lengua";
import {
  FAMILY_AND_ROLES_LEVELS,
  SCHOOL_LEVELS,
  COEXISTENCE_RULES_LEVELS,
  NEARBY_SPACES_LEVELS,
  SPATIAL_ORIENTATION_LEVELS,
  TRANSPORTATION_LEVELS,
  JOBS_AND_PROFESSIONS_LEVELS,
  HUMAN_BODY_LEVELS,
  SENSES_LEVELS,
  HEALTHY_EATING_LEVELS,
  MATERIALS_AND_OBJECTS_LEVELS,
  PLANTS_LEVELS,
  ANIMALS_LEVELS,
  WATER_LEVELS,
  CLIMATE_LEVELS,
} from "./curriculum-grade-1-sciences";
import {
  CARDINAL_ORIENTATION_LEVELS,
  COMMUNITY_INSTITUTIONS_LEVELS,
  SOCIAL_NORMS_LEVELS,
  TRANSPORTATION_TYPES_LEVELS,
  TIME_CHANGES_LEVELS,
  ARGENTINA_BASICS_LEVELS,
  ECONOMIC_ACTIVITIES_LEVELS,
  LIVING_NONLIVING_LEVELS,
  BODY_ORGANS_LEVELS,
  NUTRITION_LEVELS,
  MATTER_STATES_LEVELS,
  MATERIAL_CHANGES_LEVELS,
  WATER_IMPORTANCE_LEVELS,
  ENVIRONMENT_CARE_LEVELS,
} from "./curriculum-grade-4-sciences";
import type { Level, MathLevel, TablesMathLevel } from "./level-types";
import type { Track } from "./tracks";
import type { ThemeSlug } from "./themes";

export {
  Q_COUNT,
  MIN_PASS,
  type Level,
  type LevelKind,
  type MathLevel,
  type TablesMathLevel,
  type Grade1MathLevel,
  type Grade1LenguaLevel,
  type ConceptLevel,
  type LanguageLevel,
  type LanguageTopic,
  type LanguageQuestionType,
} from "./level-types";

/**
 * Registry of levels by (track, theme). Themes not present here have
 * no levels yet (placeholder UI shows "Próximamente"). Each theme's
 * level list is grade-specific via the `grade` field on each Level.
 */
const REGISTRY: Partial<Record<Track, Partial<Record<ThemeSlug, Level[]>>>> = {
  math: {
    tables: MATH_LEVELS,
    // Grade 1
    "counting-100": COUNTING_100_LEVELS,
    "number-recognition": NUMBER_RECOGNITION_LEVELS,
    "comparing-quantities": COMPARING_QUANTITIES_LEVELS,
    "number-series": NUMBER_SERIES_LEVELS,
    "basic-shapes": BASIC_SHAPES_LEVELS,
    "simple-addition": SIMPLE_ADDITION_LEVELS,
    "simple-subtraction": SIMPLE_SUBTRACTION_LEVELS,
    "daily-problems": DAILY_PROBLEMS_LEVELS,
    // Grade 4
    "numbers-10k": NUMBERS_10K_LEVELS,
    "addition-subtraction-carry": ADDITION_SUBTRACTION_CARRY_LEVELS,
    "multiplication-1digit": MULTIPLICATION_1DIGIT_LEVELS,
    "multiplication-2digit": MULTIPLICATION_2DIGIT_LEVELS,
    "simple-division": SIMPLE_DIVISION_LEVELS,
    "problem-solving": PROBLEM_SOLVING_LEVELS,
    "tables-graphs": TABLES_GRAPHS_LEVELS,
  },
  language: {
    // Grade 4 (existing legacy)
    "nouns-verbs": LANGUAGE_LEVELS,
    // Grade 1
    "letters-and-sounds": LETTERS_LEVELS,
    "word-separation": WORD_SEPARATION_LEVELS,
    "simple-words-reading": SIMPLE_WORDS_READING_LEVELS,
    "writing-words": WRITING_WORDS_LEVELS,
    "capitalization": CAPITALIZATION_LEVELS,
    "simple-sentences": SIMPLE_SENTENCES_LEVELS,
    "text-comprehension": TEXT_COMPREHENSION_LEVELS,
    "text-production": TEXT_PRODUCTION_LEVELS,
    // Grade 4
    "narrative-comprehension": NARRATIVE_COMPREHENSION_LEVELS,
    "event-sequence": EVENT_SEQUENCE_LEVELS,
    "capitalization-punctuation": CAPITALIZATION_PUNCTUATION_LEVELS,
    "word-classification": WORD_CLASSIFICATION_LEVELS,
    "sentence-production": SENTENCE_PRODUCTION_LEVELS,
    "informative-comprehension": INFORMATIVE_COMPREHENSION_LEVELS,
    "short-text-production": SHORT_TEXT_PRODUCTION_LEVELS,
  },
  "social-sciences": {
    // Grade 1
    "family-and-roles": FAMILY_AND_ROLES_LEVELS,
    school: SCHOOL_LEVELS,
    "coexistence-rules": COEXISTENCE_RULES_LEVELS,
    "nearby-spaces": NEARBY_SPACES_LEVELS,
    "spatial-orientation": SPATIAL_ORIENTATION_LEVELS,
    transportation: TRANSPORTATION_LEVELS,
    "jobs-and-professions": JOBS_AND_PROFESSIONS_LEVELS,
    // Grade 4
    "cardinal-orientation": CARDINAL_ORIENTATION_LEVELS,
    "community-institutions": COMMUNITY_INSTITUTIONS_LEVELS,
    "social-norms": SOCIAL_NORMS_LEVELS,
    "transportation-types": TRANSPORTATION_TYPES_LEVELS,
    "time-changes": TIME_CHANGES_LEVELS,
    "argentina-basics": ARGENTINA_BASICS_LEVELS,
    "economic-activities": ECONOMIC_ACTIVITIES_LEVELS,
  },
  "natural-sciences": {
    // Grade 1
    "human-body": HUMAN_BODY_LEVELS,
    senses: SENSES_LEVELS,
    "healthy-eating": HEALTHY_EATING_LEVELS,
    "materials-and-objects": MATERIALS_AND_OBJECTS_LEVELS,
    plants: PLANTS_LEVELS,
    animals: ANIMALS_LEVELS,
    water: WATER_LEVELS,
    climate: CLIMATE_LEVELS,
    // Grade 4
    "living-nonliving": LIVING_NONLIVING_LEVELS,
    "body-organs": BODY_ORGANS_LEVELS,
    nutrition: NUTRITION_LEVELS,
    "matter-states": MATTER_STATES_LEVELS,
    "material-changes": MATERIAL_CHANGES_LEVELS,
    "water-importance": WATER_IMPORTANCE_LEVELS,
    "environment-care": ENVIRONMENT_CARE_LEVELS,
  },
};

/** True if a (track, theme) has any levels available. */
export function hasLevels(track: Track, theme: ThemeSlug): boolean {
  return (REGISTRY[track]?.[theme] ?? []).length > 0;
}

export function levelsFor(track: Track, theme: ThemeSlug): Level[] {
  return REGISTRY[track]?.[theme] ?? [];
}

export function totalLevels(track: Track, theme: ThemeSlug): number {
  return levelsFor(track, theme).length;
}

export function getLevel(
  track: Track,
  theme: ThemeSlug,
  id: number,
): Level | undefined {
  return levelsFor(track, theme).find((l) => l.id === id);
}

export function levelsByDay(
  track: Track,
  theme: ThemeSlug,
  day: 1 | 2 | 3,
): Level[] {
  return levelsFor(track, theme).filter((l) => l.day === day);
}

/** First "learn" level for a given math table (part 1). Math/tables only. */
export function findLearnLevelFor(table: number): MathLevel | undefined {
  return MATH_LEVELS.find(
    (l) =>
      l.kind === "learn" && l.tables[0] === table && (l.factors?.[0] ?? 1) === 1,
  );
}

type TFn = (key: string, vars?: Record<string, string | number>) => string;

export function formatLevelTitle(level: Level, t: TFn): string {
  return t(level.titleKey, level.titleVars);
}

export function formatLevelSubtitle(level: Level, t: TFn): string {
  return t(level.subtitleKey, level.subtitleVars);
}
