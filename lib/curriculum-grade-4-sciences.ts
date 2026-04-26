import { Q_COUNT, MIN_PASS } from "./level-types";
import type { ConceptLevel } from "./level-types";
import type { Track } from "./tracks";

function buildLevels(
  track: Track,
  theme: string,
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
      grade: 4 as const,
      day: days[i] ?? 3,
      emoji: isFinal ? "👑" : "🧠",
      titleKey: isFinal ? "level.numbered_final" : "level.numbered",
      titleVars: { n },
      subtitleKey: "level.numbered_sub",
      questions: Q_COUNT,
      minScore: MIN_PASS,
      showIntro: i === 0,
    };
  });
}

// ===== Grade 4 — Cs Sociales (7 temas) =====
export const CARDINAL_ORIENTATION_LEVELS = buildLevels("social-sciences", "cardinal-orientation", 6);
export const COMMUNITY_INSTITUTIONS_LEVELS = buildLevels("social-sciences", "community-institutions", 6);
export const SOCIAL_NORMS_LEVELS = buildLevels("social-sciences", "social-norms", 6);
export const TRANSPORTATION_TYPES_LEVELS = buildLevels("social-sciences", "transportation-types", 6);
export const TIME_CHANGES_LEVELS = buildLevels("social-sciences", "time-changes", 6);
export const ARGENTINA_BASICS_LEVELS = buildLevels("social-sciences", "argentina-basics", 6);
export const ECONOMIC_ACTIVITIES_LEVELS = buildLevels("social-sciences", "economic-activities", 6);

// ===== Grade 4 — Cs Naturales (7 temas) =====
export const LIVING_NONLIVING_LEVELS = buildLevels("natural-sciences", "living-nonliving", 6);
export const BODY_ORGANS_LEVELS = buildLevels("natural-sciences", "body-organs", 6);
export const NUTRITION_LEVELS = buildLevels("natural-sciences", "nutrition", 6);
export const MATTER_STATES_LEVELS = buildLevels("natural-sciences", "matter-states", 6);
export const MATERIAL_CHANGES_LEVELS = buildLevels("natural-sciences", "material-changes", 6);
export const WATER_IMPORTANCE_LEVELS = buildLevels("natural-sciences", "water-importance", 6);
export const ENVIRONMENT_CARE_LEVELS = buildLevels("natural-sciences", "environment-care", 6);
