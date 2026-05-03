import { PUBLICATION_CATEGORIES } from "@/lib/publication-taxonomy"

export const RESEARCH_DIRECTIONS = PUBLICATION_CATEGORIES.map((category) => ({
  value: category.value,
  label: category.label,
}))

export function getResearchDirectionLabel(value: string) {
  return RESEARCH_DIRECTIONS.find((direction) => direction.value === value)?.label ?? value
}
