"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type PersonalEmailsInputProps = {
  emails: string[]
  onChange: (emails: string[]) => void
}

export function PersonalEmailsInput({ emails, onChange }: PersonalEmailsInputProps) {
  const handleUpdate = (index: number, value: string) => {
    onChange(emails.map((email, current) => (current === index ? value : email)))
  }

  const handleAdd = () => {
    onChange([...emails, ""])
  }

  const handleRemove = (index: number) => {
    onChange(emails.filter((_, current) => current !== index))
  }

  return (
    <div className="space-y-2">
      {emails.length === 0 ? (
        <div className="rounded-md border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
          No personal email added yet.
        </div>
      ) : (
        <div className="space-y-2">
          {emails.map((email, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(event) => handleUpdate(index, event.target.value)}
                placeholder="your.personal@email.com"
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={() => handleRemove(index)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button type="button" variant="outline" onClick={handleAdd}>
        Add Email
      </Button>
    </div>
  )
}
