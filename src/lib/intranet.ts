import { getCohortLabel, type CohortValue } from "@/lib/cohort"

export const INTRANET_WPS_URL = "https://wpsplus.com/join/g5qiyvc?invtoken=TWFjaW50b3NoICA="

export function getPublicUserDisplayName(user?: {
  chineseName?: string
  englishName?: string
  username?: string
}) {
  return user?.chineseName?.trim() || user?.englishName?.trim() || user?.username || "用户"
}

export function formatAnonymousAlias(index: number) {
  let current = index
  let result = ""

  do {
    result = String.fromCharCode(65 + (current % 26)) + result
    current = Math.floor(current / 26) - 1
  } while (current >= 0)

  return `匿名洞友${result}`
}

export function formatYearMonthLabel(value: string) {
  const [year, month] = value.split("-")
  if (!year || !month) return value
  return `${year}年${month}月`
}

export function formatIntranetExportCohort(cohort: CohortValue | "") {
  if (!cohort) return ""
  return getCohortLabel(cohort)
}

export function formatOrganizationLabel(organization: "pku" | "thu" | "") {
  if (organization === "pku") return "北京大学"
  if (organization === "thu") return "清华大学"
  return ""
}
