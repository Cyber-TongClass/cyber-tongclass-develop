export type CohortValue = number | "mascot"

const FIRST_COHORT_YEAR = 2020
const MASCOT_VALUE = "mascot"

export function getYearCohortOptions(currentYear = new Date().getFullYear()) {
  return Array.from({ length: currentYear - FIRST_COHORT_YEAR + 1 }, (_, idx) => currentYear - idx)
}

export function getCohortOptions(currentYear = new Date().getFullYear()): CohortValue[] {
  return [MASCOT_VALUE, ...getYearCohortOptions(currentYear)]
}

export function getCohortLabel(cohort: CohortValue) {
  return cohort === MASCOT_VALUE ? "吉祥物" : `${cohort}级`
}

export function getCohortClassLabel(cohort: CohortValue) {
  return cohort === MASCOT_VALUE ? "Mascot" : `Class of ${cohort}`
}

export function cohortToSelectValue(cohort: CohortValue) {
  return String(cohort)
}

export function parseCohortValue(value: string): CohortValue {
  return value === MASCOT_VALUE ? MASCOT_VALUE : Number(value)
}

export function compareCohorts(a: CohortValue, b: CohortValue) {
  if (a === MASCOT_VALUE && b === MASCOT_VALUE) return 0
  if (a === MASCOT_VALUE) return -1
  if (b === MASCOT_VALUE) return 1
  return b - a
}
