import { levelsFor } from "./curriculum";
import type { Track } from "./tracks";
import type { Progress } from "./progress-helpers";
import { TRACKS } from "./tracks";
import { THEMES_BY_TRACK, type ThemeSlug } from "./themes";

/**
 * Coins awarded for passing a level for the FIRST time. Amount depends
 * on the level's relative position within its theme:
 *   - first third → 10
 *   - middle third → 20
 *   - last third → 50
 * Re-playing a level does not re-credit. Wallet only grows from earnings;
 * it shrinks via admin redemptions (logged in `coin_redemptions`).
 */
export function coinsForLevel(track: Track, theme: ThemeSlug, levelId: number): number {
  const all = levelsFor(track, theme);
  const total = all.length;
  if (total === 0) return 0;
  const idx = all.findIndex((l) => l.id === levelId);
  if (idx === -1) return 0;
  const third = total / 3;
  if (idx < third) return 10;
  if (idx < 2 * third) return 20;
  return 50;
}

/** Sum of coins earned across every passed (track, theme, level) in
 * the user's progress. */
export function coinsEarned(progress: Progress): number {
  let total = 0;
  for (const track of TRACKS) {
    for (const theme of THEMES_BY_TRACK[track]) {
      const bucket = progress.results[track]?.[theme.slug] ?? {};
      for (const [idStr, r] of Object.entries(bucket)) {
        if (!r.passed) continue;
        total += coinsForLevel(track, theme.slug, Number(idStr));
      }
    }
  }
  return total;
}

/** Wallet = coins earned - coins redeemed (always >= 0). */
export function walletBalance(earned: number, redeemed: number): number {
  return Math.max(0, earned - redeemed);
}
