/** Primary school grade (1°-7° grado). */
export type Grade = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const GRADES: Grade[] = [1, 2, 3, 4, 5, 6, 7];

export function isGrade(n: number): n is Grade {
  return Number.isInteger(n) && n >= 1 && n <= 7;
}

/** Per-grade defaults for level question count + min to pass.
 * Grade 1 is calibrated for shorter attention spans. */
export function questionsForGrade(grade: Grade): number {
  if (grade === 1) return 10;
  return 14;
}

export function minPassForGrade(grade: Grade): number {
  if (grade === 1) return 8;
  return 12;
}
