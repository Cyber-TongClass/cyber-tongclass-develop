"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function CollapsibleText({
  text,
  collapsedLength = 180,
  className = "",
}: {
  text: string
  collapsedLength?: number
  className?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const shouldCollapse = text.length > collapsedLength
  const displayedText = !shouldCollapse || expanded ? text : `${text.slice(0, collapsedLength).trimEnd()}...`

  return (
    <div className={className}>
      <p className="whitespace-pre-line text-sm leading-7 text-slate-700">{displayedText}</p>
      {shouldCollapse ? (
        <Button
          type="button"
          variant="link"
          className="mt-1 h-auto px-0 text-sm"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "收起" : "展开全文"}
        </Button>
      ) : null}
    </div>
  )
}
