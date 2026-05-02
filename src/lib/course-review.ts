import type { CourseReview } from "@/types"

export const SEMESTER_TERM_OPTIONS = [
  { value: "spring", label: "春季学期" },
  { value: "fall", label: "秋季学期" },
] as const

export const STUDY_METHOD_OPTIONS = [
  { value: "attend", label: "去上课" },
  { value: "recording", label: "听录课" },
  { value: "self_study", label: "自学" },
] as const

export const FIVE_POINT_HINTS = {
  workload: "1 = 很小，5 = 很大",
  pace: "1 = 很慢，5 = 很快",
  gradingFairness: "1 = 很不符合预期，5 = 很符合预期",
} as const

export function getSemesterLabel(year: number, term: CourseReview["semesterTerm"]) {
  const match = SEMESTER_TERM_OPTIONS.find((option) => option.value === term)
  return `${year} ${match?.label ?? term}`
}

export function getSemesterShortLabel(year: number, term: CourseReview["semesterTerm"]) {
  return `${String(year).slice(-2)}${term === "spring" ? "春" : "秋"}`
}

export function getCourseReviewYearOptions(startYear = 2020, currentYear = new Date().getFullYear()) {
  return Array.from({ length: currentYear - startYear + 1 }, (_, index) => currentYear - index)
}

export function getRatingBadgeClass(rating: number) {
  if (rating >= 8) return "bg-green-100 text-green-800"
  if (rating >= 6) return "bg-yellow-100 text-yellow-800"
  return "bg-red-100 text-red-800"
}
