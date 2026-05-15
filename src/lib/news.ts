export const NEWS_CATEGORY_OPTIONS = [
  "关于通班",
  "通知公告",
  "活动回顾",
  "学术成果",
  "访谈采访",
  "活动预告",
  "其他动态",
] as const

export type NewsCategory = (typeof NEWS_CATEGORY_OPTIONS)[number]

export function formatNewsDateInputValue(timestamp?: number) {
  if (!timestamp) return ""
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function parseNewsDateInputValue(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return new Date(`${trimmed}T12:00:00`).getTime()
}
