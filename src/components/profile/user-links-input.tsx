"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getDefaultUserLinkLabel, USER_LINK_TYPE_OPTIONS } from "@/lib/user-profile"
import type { UserLink, UserLinkType } from "@/types"

type UserLinksInputProps = {
  links: UserLink[]
  onChange: (links: UserLink[]) => void
}

const createEmptyLink = (): UserLink => ({
  type: "homepage",
  label: getDefaultUserLinkLabel("homepage"),
  url: "",
})

export function UserLinksInput({ links, onChange }: UserLinksInputProps) {
  const handleUpdate = <K extends keyof UserLink>(index: number, key: K, value: UserLink[K]) => {
    onChange(links.map((link, current) => (current === index ? { ...link, [key]: value } : link)))
  }

  const handleTypeChange = (index: number, type: UserLinkType) => {
    const current = links[index]
    const previousDefaultLabel = getDefaultUserLinkLabel(current.type)
    const nextDefaultLabel = getDefaultUserLinkLabel(type)
    const nextLabel = !current.label.trim() || current.label === previousDefaultLabel ? nextDefaultLabel : current.label

    onChange(
      links.map((link, currentIndex) =>
        currentIndex === index
          ? {
              ...link,
              type,
              label: nextLabel,
            }
          : link
      )
    )
  }

  const handleAdd = () => {
    onChange([...links, createEmptyLink()])
  }

  const handleRemove = (index: number) => {
    onChange(links.filter((_, current) => current !== index))
  }

  return (
    <div className="space-y-2">
      {links.length === 0 ? (
        <div className="rounded-md border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
          No profile links added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link, index) => (
            <div key={index} className="rounded-md border border-border p-3">
              <div className="grid gap-3 md:grid-cols-[180px_1fr]">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Type</label>
                  <select
                    value={link.type}
                    onChange={(event) => handleTypeChange(index, event.target.value as UserLinkType)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {USER_LINK_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Label</label>
                  <Input
                    value={link.label}
                    onChange={(event) => handleUpdate(index, "label", event.target.value)}
                    placeholder={getDefaultUserLinkLabel(link.type)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-foreground">URL</label>
                  <div className="flex gap-2">
                    <Input
                      value={link.url}
                      onChange={(event) => handleUpdate(index, "url", event.target.value)}
                      placeholder="https://..."
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={() => handleRemove(index)}>
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button type="button" variant="outline" onClick={handleAdd}>
        Add Link
      </Button>
    </div>
  )
}
