import type { User, UserLink, UserLinkType } from "@/types"

export const USER_LINK_TYPE_OPTIONS: Array<{ value: UserLinkType; label: string }> = [
  { value: "homepage", label: "Personal Homepage" },
  { value: "scholar", label: "Google Scholar" },
  { value: "orcid", label: "ORCID" },
  { value: "github", label: "GitHub" },
  { value: "x", label: "X" },
  { value: "xiaohongshu", label: "Xiaohongshu" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "custom", label: "Custom" },
]

const USER_LINK_DEFAULT_LABELS: Record<UserLinkType, string> = {
  homepage: "Personal Homepage",
  scholar: "Google Scholar",
  orcid: "ORCID",
  github: "GitHub",
  x: "X",
  xiaohongshu: "Xiaohongshu",
  linkedin: "LinkedIn",
  custom: "Custom Link",
}

type UserProfileLike = Pick<
  User,
  "personalEmails" | "personalEmail" | "links" | "scholarUrl" | "orcidUrl" | "titles"
>

export function getDefaultUserLinkLabel(type: UserLinkType) {
  return USER_LINK_DEFAULT_LABELS[type]
}

export function sanitizePersonalEmails(emails: Array<string | null | undefined>) {
  const seen = new Set<string>()

  return emails
    .map((email) => email?.trim() || "")
    .filter(Boolean)
    .filter((email) => {
      const key = email.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

export function sanitizeUserLinks(links: Array<Partial<UserLink> | null | undefined>) {
  const seen = new Set<string>()

  return links
    .map((link) => {
      const type = (link?.type || "custom") as UserLinkType
      const url = link?.url?.trim() || ""
      const fallbackLabel = getDefaultUserLinkLabel(type)
      const label = link?.label?.trim() || fallbackLabel

      if (!url) {
        return null
      }

      return {
        type,
        label,
        url,
      } satisfies UserLink
    })
    .filter((link): link is UserLink => Boolean(link))
    .filter((link) => {
      const key = `${link.type}::${link.label.toLowerCase()}::${link.url.toLowerCase()}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

export function getUserPersonalEmails(user: UserProfileLike) {
  const modernEmails = sanitizePersonalEmails(user.personalEmails || [])
  if (modernEmails.length > 0) {
    return modernEmails
  }

  return sanitizePersonalEmails(user.personalEmail ? [user.personalEmail] : [])
}

export function getUserLinks(user: UserProfileLike) {
  const modernLinks = sanitizeUserLinks(user.links || [])
  if (modernLinks.length > 0) {
    return modernLinks
  }

  const legacyLinks: UserLink[] = []

  if (user.scholarUrl?.trim()) {
    legacyLinks.push({
      type: "scholar",
      label: getDefaultUserLinkLabel("scholar"),
      url: user.scholarUrl.trim(),
    })
  }

  if (user.orcidUrl?.trim()) {
    legacyLinks.push({
      type: "orcid",
      label: getDefaultUserLinkLabel("orcid"),
      url: user.orcidUrl.trim(),
    })
  }

  for (const item of user.titles || []) {
    if (!item?.link?.trim()) continue
    legacyLinks.push({
      type: "custom",
      label: item.title?.trim() || getDefaultUserLinkLabel("custom"),
      url: item.link.trim(),
    })
  }

  return sanitizeUserLinks(legacyLinks)
}
