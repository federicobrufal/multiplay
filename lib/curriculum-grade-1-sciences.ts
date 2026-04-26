import { questionsForGrade, minPassForGrade } from "./grades";
import type { ConceptLevel } from "./level-types";
import type { Track } from "./tracks";

const Q = questionsForGrade(1);
const MP = minPassForGrade(1);

interface Spec {
  emoji: string;
  titleKey: string;
  subtitleKey: string;
  day: 1 | 2 | 3;
}

function buildLevels(
  track: Track,
  theme: string,
  _themeKeyPart: string,
  count: number,
): ConceptLevel[] {
  const days: Array<1 | 2 | 3> = [1, 1, 2, 2, 3, 3, 3, 3];
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    const isFinal = i === count - 1;
    return {
      id: n,
      track: track as ConceptLevel["track"],
      theme,
      grade: 1 as const,
      day: days[i] ?? 3,
      emoji: isFinal ? "👑" : "🧠",
      titleKey: isFinal ? "level.numbered_final" : "level.numbered",
      titleVars: { n },
      subtitleKey: "level.numbered_sub",
      questions: Q,
      minScore: MP,
      showIntro: i === 0,
    };
  });
}

// ===== Ciencias Sociales (7 temas, 6 niveles cada uno) =====

export const FAMILY_AND_ROLES_LEVELS = buildLevels("social-sciences", "family-and-roles", "fam", 6);
export const SCHOOL_LEVELS = buildLevels("social-sciences", "school", "sch", 6);
export const COEXISTENCE_RULES_LEVELS = buildLevels("social-sciences", "coexistence-rules", "coex", 6);
export const NEARBY_SPACES_LEVELS = buildLevels("social-sciences", "nearby-spaces", "near", 6);
export const SPATIAL_ORIENTATION_LEVELS = buildLevels("social-sciences", "spatial-orientation", "spat", 6);
export const TRANSPORTATION_LEVELS = buildLevels("social-sciences", "transportation", "trans", 6);
export const JOBS_AND_PROFESSIONS_LEVELS = buildLevels("social-sciences", "jobs-and-professions", "jobs", 6);

// ===== Ciencias Naturales (8 temas, 6 niveles cada uno) =====

export const HUMAN_BODY_LEVELS = buildLevels("natural-sciences", "human-body", "body", 6);
export const SENSES_LEVELS = buildLevels("natural-sciences", "senses", "sen", 6);
export const HEALTHY_EATING_LEVELS = buildLevels("natural-sciences", "healthy-eating", "eat", 6);
export const MATERIALS_AND_OBJECTS_LEVELS = buildLevels("natural-sciences", "materials-and-objects", "mat", 6);
export const PLANTS_LEVELS = buildLevels("natural-sciences", "plants", "plt", 6);
export const ANIMALS_LEVELS = buildLevels("natural-sciences", "animals", "ani", 6);
export const WATER_LEVELS = buildLevels("natural-sciences", "water", "wat", 6);
export const CLIMATE_LEVELS = buildLevels("natural-sciences", "climate", "cli", 6);
