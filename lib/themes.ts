import { TRACKS, type Track } from "./tracks";
import type { Grade } from "./grades";

/**
 * Theme slugs are URL-safe and stored in the DB. Display names live in
 * i18n (`theme.<slug>` with dashes replaced by underscores).
 */
export type ThemeSlug = string;

/** Metadata for a theme (subject sub-section within a grade). */
export interface ThemeInfo {
  slug: ThemeSlug;
  track: Track;
  grade: Grade;
  /** i18n key for the display name. */
  nameKey: string;
}

/** Flat list of all themes across all (grade, track). The (track, slug)
 * pair is unique. New themes are added here AND in the curriculum
 * registry (see `lib/curriculum.ts`). */
export const THEMES: ThemeInfo[] = [
  // ===== Grade 4 (existing legacy content) =====
  { slug: "tables", track: "math", grade: 4, nameKey: "theme.tables" },
  { slug: "nouns-verbs", track: "language", grade: 4, nameKey: "theme.nouns_verbs" },

  // ===== Grade 1 — Lengua (8 temas) =====
  { slug: "letters-and-sounds", track: "language", grade: 1, nameKey: "theme.letters_and_sounds" },
  { slug: "word-separation", track: "language", grade: 1, nameKey: "theme.word_separation" },
  { slug: "simple-words-reading", track: "language", grade: 1, nameKey: "theme.simple_words_reading" },
  { slug: "writing-words", track: "language", grade: 1, nameKey: "theme.writing_words" },
  { slug: "capitalization", track: "language", grade: 1, nameKey: "theme.capitalization" },
  { slug: "simple-sentences", track: "language", grade: 1, nameKey: "theme.simple_sentences" },
  { slug: "text-comprehension", track: "language", grade: 1, nameKey: "theme.text_comprehension" },
  { slug: "text-production", track: "language", grade: 1, nameKey: "theme.text_production" },

  // ===== Grade 1 — Matemática (8 temas) =====
  { slug: "counting-100", track: "math", grade: 1, nameKey: "theme.counting_100" },
  { slug: "number-recognition", track: "math", grade: 1, nameKey: "theme.number_recognition" },
  { slug: "comparing-quantities", track: "math", grade: 1, nameKey: "theme.comparing_quantities" },
  { slug: "number-series", track: "math", grade: 1, nameKey: "theme.number_series" },
  { slug: "basic-shapes", track: "math", grade: 1, nameKey: "theme.basic_shapes" },
  { slug: "simple-addition", track: "math", grade: 1, nameKey: "theme.simple_addition" },
  { slug: "simple-subtraction", track: "math", grade: 1, nameKey: "theme.simple_subtraction" },
  { slug: "daily-problems", track: "math", grade: 1, nameKey: "theme.daily_problems" },

  // ===== Grade 1 — Ciencias Sociales (7 temas) =====
  { slug: "family-and-roles", track: "social-sciences", grade: 1, nameKey: "theme.family_and_roles" },
  { slug: "school", track: "social-sciences", grade: 1, nameKey: "theme.school" },
  { slug: "coexistence-rules", track: "social-sciences", grade: 1, nameKey: "theme.coexistence_rules" },
  { slug: "nearby-spaces", track: "social-sciences", grade: 1, nameKey: "theme.nearby_spaces" },
  { slug: "spatial-orientation", track: "social-sciences", grade: 1, nameKey: "theme.spatial_orientation" },
  { slug: "transportation", track: "social-sciences", grade: 1, nameKey: "theme.transportation" },
  { slug: "jobs-and-professions", track: "social-sciences", grade: 1, nameKey: "theme.jobs_and_professions" },

  // ===== Grade 1 — Ciencias Naturales (8 temas) =====
  { slug: "human-body", track: "natural-sciences", grade: 1, nameKey: "theme.human_body" },
  { slug: "senses", track: "natural-sciences", grade: 1, nameKey: "theme.senses" },
  { slug: "healthy-eating", track: "natural-sciences", grade: 1, nameKey: "theme.healthy_eating" },
  { slug: "materials-and-objects", track: "natural-sciences", grade: 1, nameKey: "theme.materials_and_objects" },
  { slug: "plants", track: "natural-sciences", grade: 1, nameKey: "theme.plants" },
  { slug: "animals", track: "natural-sciences", grade: 1, nameKey: "theme.animals" },
  { slug: "water", track: "natural-sciences", grade: 1, nameKey: "theme.water" },
  { slug: "climate", track: "natural-sciences", grade: 1, nameKey: "theme.climate" },
];

/** All themes for a track across every grade. Useful for progress
 * iteration where grade context is not relevant. */
export const THEMES_BY_TRACK: Record<Track, ThemeInfo[]> = (() => {
  const out = TRACKS.reduce(
    (acc, t) => ({ ...acc, [t]: [] as ThemeInfo[] }),
    {} as Record<Track, ThemeInfo[]>,
  );
  for (const th of THEMES) out[th.track].push(th);
  return out;
})();

/** Themes available for a (grade, track) pair. */
export function themesFor(grade: Grade, track: Track): ThemeInfo[] {
  return THEMES.filter((t) => t.grade === grade && t.track === track);
}

/** Tracks that have any theme for a given grade. Used by the home's
 * subject selector to hide tracks with no content yet. */
export function tracksForGrade(grade: Grade): Track[] {
  const seen = new Set<Track>();
  for (const t of THEMES) {
    if (t.grade === grade) seen.add(t.track);
  }
  return TRACKS.filter((tr) => seen.has(tr));
}

export function getThemeInfo(
  track: Track,
  slug: ThemeSlug,
): ThemeInfo | undefined {
  return THEMES.find((t) => t.track === track && t.slug === slug);
}

export function isValidTheme(track: Track, slug: string): boolean {
  return THEMES.some((t) => t.track === track && t.slug === slug);
}
