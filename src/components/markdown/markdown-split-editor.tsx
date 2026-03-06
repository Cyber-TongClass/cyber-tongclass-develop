"use client"

import { useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer"

interface MarkdownSplitEditorProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  sourceLabel?: string
  previewLabel?: string
  minHeightClassName?: string
  className?: string
  textareaClassName?: string
  previewClassName?: string
  disabled?: boolean
  showToolbar?: boolean
}

type ViewMode = "split" | "edit" | "preview"

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

const applyInlineHighlights = (value: string) => {
  return value
    .replace(/(!\[[^\]]*\]\([^\)]*\))/g, '<span class="md-token-image">$1</span>')
    .replace(/(\[[^\]]*\]\([^\)]*\))/g, '<span class="md-token-link">$1</span>')
    .replace(/(`[^`]+`)/g, '<span class="md-token-inline-code">$1</span>')
    .replace(/(\*\*[^*]+\*\*)/g, '<span class="md-token-strong">$1</span>')
    .replace(/(\*[^*]+\*)/g, '<span class="md-token-em">$1</span>')
    .replace(/(~~[^~]+~~)/g, '<span class="md-token-strike">$1</span>')
}

const highlightMarkdownSource = (rawValue: string) => {
  const lines = rawValue.split("\n")
  let inFence = false

  const highlighted = lines.map((line) => {
    const escapedLine = escapeHtml(line)
    const trimmed = line.trimStart()

    if (trimmed.startsWith("```")) {
      inFence = !inFence
      return `<span class="md-token-fence">${escapedLine || " "}</span>`
    }

    if (inFence) {
      return `<span class="md-token-codeblock">${escapedLine || " "}</span>`
    }

    let next = applyInlineHighlights(escapedLine || " ")

    next = next.replace(/^(#{1,6}\s)/, '<span class="md-token-heading">$1</span>')
    next = next.replace(/^(>\s?)/, '<span class="md-token-quote">$1</span>')
    next = next.replace(/^(-\s|\*\s|\+\s)/, '<span class="md-token-list">$1</span>')
    next = next.replace(/^(\d+\.\s)/, '<span class="md-token-list">$1</span>')

    return next
  })

  return highlighted.join("\n")
}

export function MarkdownSplitEditor({
  id,
  value,
  onChange,
  placeholder = "支持 Markdown 与 LaTeX 输入（如 $E=mc^2$）",
  sourceLabel = "源代码",
  previewLabel = "渲染预览",
  minHeightClassName = "min-h-[220px]",
  className,
  textareaClassName,
  previewClassName,
  disabled = false,
  showToolbar = true,
}: MarkdownSplitEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const sourcePreviewRef = useRef<HTMLPreElement | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("split")

  const highlightedSource = useMemo(() => highlightMarkdownSource(value), [value])

  const syncSourceScroll = () => {
    if (!textareaRef.current || !sourcePreviewRef.current) return
    sourcePreviewRef.current.scrollTop = textareaRef.current.scrollTop
    sourcePreviewRef.current.scrollLeft = textareaRef.current.scrollLeft
  }

  const withTextarea = (action: (textarea: HTMLTextAreaElement) => void) => {
    if (!textareaRef.current || disabled) return
    const textarea = textareaRef.current
    textarea.focus()
    action(textarea)
  }

  const replaceSelection = (
    prefix: string,
    suffix = "",
    placeholder = "text",
    selectPlaceholder = true
  ) => {
    withTextarea((textarea) => {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selected = value.slice(start, end)
      const insertValue = selected || placeholder
      const nextValue = `${value.slice(0, start)}${prefix}${insertValue}${suffix}${value.slice(end)}`
      onChange(nextValue)

      requestAnimationFrame(() => {
        const anchor = start + prefix.length
        if (selected || !selectPlaceholder) {
          const focus = anchor + insertValue.length
          textarea.setSelectionRange(focus, focus)
          return
        }
        textarea.setSelectionRange(anchor, anchor + placeholder.length)
      })
    })
  }

  const insertTemplate = (template: string, selectionStart: number, selectionEnd: number) => {
    withTextarea((textarea) => {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const nextValue = `${value.slice(0, start)}${template}${value.slice(end)}`
      onChange(nextValue)
      requestAnimationFrame(() => {
        textarea.setSelectionRange(start + selectionStart, start + selectionEnd)
      })
    })
  }

  const prefixSelectedLines = (prefix: string) => {
    withTextarea((textarea) => {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const lineStart = value.lastIndexOf("\n", start - 1) + 1
      const lineEndIndex = value.indexOf("\n", end)
      const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex
      const target = value.slice(lineStart, lineEnd)
      const nextBlock = target
        .split("\n")
        .map((line) => `${prefix}${line}`)
        .join("\n")
      const nextValue = `${value.slice(0, lineStart)}${nextBlock}${value.slice(lineEnd)}`

      onChange(nextValue)
      requestAnimationFrame(() => {
        textarea.setSelectionRange(lineStart, lineStart + nextBlock.length)
      })
    })
  }

  const applyHeading = (level: number) => {
    const marker = `${"#".repeat(level)} `
    prefixSelectedLines(marker)
  }

  const showSource = viewMode === "split" || viewMode === "edit"
  const showPreview = viewMode === "split" || viewMode === "preview"

  return (
    <div className={cn("space-y-3", className)}>
      {showToolbar && (
        <div className="flex flex-wrap items-center gap-2 rounded-md border bg-background/60 p-2">
          <Button type="button" size="sm" variant="outline" onClick={() => replaceSelection("**", "**", "bold")}>B</Button>
          <Button type="button" size="sm" variant="outline" onClick={() => replaceSelection("*", "*", "italic")}>I</Button>
          <Button type="button" size="sm" variant="outline" onClick={() => replaceSelection("~~", "~~", "delete")}>S</Button>
          <div className="mx-1 h-5 w-px bg-border" />
          <select
            aria-label="Insert heading"
            className="h-8 rounded-md border border-input bg-background px-2 text-sm"
            defaultValue=""
            onChange={(event) => {
              const level = Number(event.target.value)
              if (!level) return
              applyHeading(level)
              event.target.value = ""
            }}
            disabled={disabled}
          >
            <option value="">H1-H6</option>
            <option value="1">H1</option>
            <option value="2">H2</option>
            <option value="3">H3</option>
            <option value="4">H4</option>
            <option value="5">H5</option>
            <option value="6">H6</option>
          </select>
          <Button type="button" size="sm" variant="outline" onClick={() => insertTemplate("[text](https://)", 1, 5)}>Link</Button>
          <Button type="button" size="sm" variant="outline" onClick={() => insertTemplate("![alt](https://)", 2, 5)}>Image</Button>
          <Button type="button" size="sm" variant="outline" onClick={() => prefixSelectedLines("> ")}>Quote</Button>
          <div className="mx-1 h-5 w-px bg-border" />
          <div className="inline-flex items-center rounded-md border border-input">
            <Button type="button" size="sm" variant={viewMode === "edit" ? "secondary" : "ghost"} onClick={() => setViewMode("edit")}>Edit</Button>
            <Button type="button" size="sm" variant={viewMode === "split" ? "secondary" : "ghost"} onClick={() => setViewMode("split")}>Split</Button>
            <Button type="button" size="sm" variant={viewMode === "preview" ? "secondary" : "ghost"} onClick={() => setViewMode("preview")}>Preview</Button>
          </div>
        </div>
      )}

      <div className={cn("grid grid-cols-1 gap-4", viewMode === "split" && "lg:grid-cols-2")}>
        {showSource && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">{sourceLabel}</p>
            <div className={cn("relative overflow-hidden rounded-md border bg-slate-950/95", minHeightClassName)}>
              <pre
                ref={sourcePreviewRef}
                aria-hidden
                className={cn(
                  "pointer-events-none overflow-auto p-3 font-mono text-sm leading-6 text-slate-100",
                  "[&_.md-token-heading]:text-sky-300 [&_.md-token-link]:text-cyan-300 [&_.md-token-image]:text-teal-300",
                  "[&_.md-token-inline-code]:rounded [&_.md-token-inline-code]:bg-slate-800 [&_.md-token-inline-code]:px-1",
                  "[&_.md-token-strong]:font-semibold [&_.md-token-strong]:text-amber-300",
                  "[&_.md-token-em]:text-fuchsia-300 [&_.md-token-strike]:text-rose-300 [&_.md-token-strike]:line-through",
                  "[&_.md-token-fence]:text-indigo-300 [&_.md-token-codeblock]:text-slate-300",
                  "[&_.md-token-quote]:text-emerald-300 [&_.md-token-list]:text-orange-300"
                )}
                dangerouslySetInnerHTML={{ __html: highlightedSource || " " }}
              />
              <Textarea
                ref={textareaRef}
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onScroll={syncSourceScroll}
                placeholder={placeholder}
                className={cn(
                  "absolute inset-0 z-10 resize-y border-0 bg-transparent font-mono text-sm leading-6 text-transparent caret-slate-100",
                  "selection:bg-primary/30 selection:text-slate-100",
                  minHeightClassName,
                  textareaClassName
                )}
                disabled={disabled}
              />
            </div>
          </div>
        )}

        {showPreview && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">{previewLabel}</p>
            <div className={cn("overflow-auto rounded-md border bg-muted/20 p-4", minHeightClassName, previewClassName)}>
              <MarkdownRenderer content={value} emptyFallback="在左侧输入 Markdown 后，这里会实时预览。" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
