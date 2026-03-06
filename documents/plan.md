# User Profile Markdown Palette + Host Rendering Plan

## 1. Objective
Add a profile markdown editing experience where users can edit profile content in either:
- an embedded editor section on the profile page, or
- a floating modal/dialog editor,

and the platform renders the markdown output on the host side with:
- basic syntax highlighting for code blocks,
- optional LaTeX rendering,
- a top toolbar for common markdown insertions.

This plan is implementation-focused and staged to reduce risk.

## 2. Scope
### In Scope
- Add markdown source storage on user profile data.
- Add editor UI with toolbar actions:
  - Bold (`**cursor**`)
  - Underline (HTML `<u>cursor</u>` as markdown has no native underline)
  - Italic (`*cursor*`)
  - Delete/Strikethrough (`~~cursor~~`)
  - H1..H6 (`# ` to `###### `)
  - Hyperlink (`[text](url)`)
  - Photo (`![alt](url)`)
  - Quote (`> `)
- Cursor-aware insertion and selection wrapping behavior.
- Host-side markdown rendering in profile view.
- Code highlight support.
- Optional LaTeX support.
- Basic validation/sanitization and persistence.

### Out of Scope (Phase 1)
- Collaborative real-time editing.
- File upload backend for image hosting (URL insertion only initially).
- Full WYSIWYG rich text editor replacement.
- Version history/diff UI.

## 3. Current Codebase Fit (Observed)
- Existing markdown infra appears in:
  - `src/components/markdown/markdown-renderer.tsx`
  - `src/components/markdown/markdown-split-editor.tsx`
- Existing profile routes exist under:
  - `src/app/settings/page.tsx`
  - `src/app/users/[id]/...`
  - possibly `src/app/members/[id]/...`
- Existing auth/profile hooks under:
  - `src/lib/hooks/use-auth.ts`
  - `src/lib/hooks/use-users.ts`
- Convex backend already handles user records in `convex/users.ts` and schema in `convex/schema.ts`.

Do not use the existing markdown editor components because it is not yet good. Instead, since it is in components, you should directly fix the `markdown-split-editor` and `markdown-renderer` components to support the new toolbar and rendering features. The split-editor UI is a brilliant design, keep it. Currently the renderer doesn't seem to have code highlighting, add this feature. Also make sure you implement code highlighting in the markdown editor for markdown syntaxes too.  

## 4. UX Plan
### Editing Surface Options
Offer two modes (configurable with a feature toggle or prop):
1. Embedded editor block in profile settings page.
2. Floating dialog editor (for focus mode).

Recommendation: start with embedded editor + optional "Open in Dialog" button. The recommendation is accepted. 

### Toolbar Layout
Top bar controls (left to right):
- Bold
- Italic
- Strikethrough
- Divider
- H1/H2/H3/H4/H5/H6 dropdown or segmented selector
- Link
- Image
- Divider
- Preview toggle (Edit / Split / Preview)

### Interaction Rules
- If text is selected:
  - wrap selected text with chosen token (`**`, `*`, `~~` etc).
- If no selection:
  - insert token template with placeholder and move cursor to placeholder.
- Heading action:
  - if selection spans line start, prefix each selected line with heading marker;
  - otherwise insert heading marker at current line start.
- Link/image:
  - insert template and place cursor in `text`/`alt` first.

## 5. Data Model and Persistence Plan
### Schema
Add profile markdown field in user data model (Convex):
- `profileMarkdown?: string`
- Optional derived/cache fields for optimization (later):
  - `profileMarkdownUpdatedAt`
  - `profileMarkdownPreview` (plain text excerpt)

### Mutations/Queries
- Add mutation: `users.updateProfileMarkdown` with auth checks.
- Update existing `users.update` flow if preferred, but isolate markdown path for clearer permissions and size limits.

### Validation
- Max length (e.g. 20k chars initially).
- Trim and normalize newlines on save.
- Reject unsupported binary content.

## 6. Rendering Architecture (Host Provides Rendering)
### Rendering Location
Render markdown server-side where feasible (page/server component path), then hydrate client UI.

Rationale:
- Consistent output,
- centralized sanitization,
- easier SEO/profile sharing.

### Renderer Pipeline
Use/extend existing renderer stack with these plugins:
- `remark-gfm`
- `remark-math` (for LaTeX)
- `rehype-katex` (preferred lightweight math rendering)
- `rehype-highlight` (code highlighting)


## 7. LaTeX Support Plan
### Supported Syntax
- Inline math: `$...$`
- Block math: `$$...$$`

### Dependencies
- Keep using existing `remark-math` + `rehype-katex` (already present in dependencies).
- Ensure KaTeX CSS is included globally or within renderer boundary.

### Graceful Degradation
- If math parse fails, render original text with warning style (non-blocking).

## 8. Code Highlighting Plan
### Scope
- Fenced code blocks with language labels:
  - ```ts
  - ```python
  - etc.

### Implementation
- Reuse current `rehype-highlight` setup in markdown renderer.
- Add default theme CSS (if not already applied) with design-system-compatible overrides.

## 9. Component Design Plan
### New/Updated Components
1. `src/components/markdown/profile-markdown-editor.tsx`
   - wraps textarea/editor state + toolbar + insertion logic.
2. `src/components/markdown/markdown-toolbar.tsx`
   - pure action bar with callbacks.
3. Extend `src/components/markdown/markdown-renderer.tsx`
   - confirm plugin chain for GFM + math + highlight + sanitization.
4. Integrate into profile settings page:
   - `src/app/settings/page.tsx` (primary), optionally `src/app/users/[id]/page.tsx` for public profile view.
   - Also fix up and use the newly designed editor for the admin's add news page at `src/app/admin/news/page.tsx`.

### State Flow
- Local editor state for immediate typing.
- Debounced autosave optional (Phase 2).
- Explicit Save button in Phase 1.

## 10. API/Auth Plan
### Authorization
- Only profile owner (or super_admin role) can update markdown content.
- Public readers can view rendered output depending on profile visibility rules.

### Error Handling
- Surface save errors with toast + retry.
- Preserve unsaved local draft in memory (and optionally localStorage).

## 11. Accessibility and Mobile Plan
- Toolbar buttons must have `aria-label` and keyboard focus states.
- Keyboard shortcuts (Phase 2):
  - Ctrl/Cmd+B, I, K.
- On mobile:
  - sticky toolbar,
  - larger touch targets,
  - collapse heading buttons into dropdown.

## 12. Testing Plan
### Unit Tests
- Insertion helper logic:
  - wrap selection,
  - insert templates,
  - cursor placement,
  - heading insertion line behavior.

### Integration Tests
- Save markdown -> fetch profile -> render output path.
- Render code blocks and math without runtime errors.
- Sanitization blocks unsafe link payloads.

### Manual QA Checklist
- Bold/italic/underline/delete actions work both with and without selection.
- H1..H6 action modifies expected lines.
- Link/image templates inserted at cursor.
- Code fence highlight appears.
- LaTeX inline/block renders.
- Mobile toolbar usable.

## 13. Rollout Plan
### Phase 1 (MVP)
- Embedded editor + toolbar + save.
- Host-rendered markdown with syntax highlight.
- Optional LaTeX enabled.

### Phase 2
- Dialog/floating full-screen editor.
- Autosave + draft restore.
- Keyboard shortcuts.

### Phase 3
- Image upload integration and markdown insertion automation.
- Revision history/versioning.

## 14. Risks and Mitigations
- Risk: XSS via markdown/HTML.
  - Mitigation: strict sanitization, protocol validation.
- Risk: Large markdown causes slow render.
  - Mitigation: size limits + memoized render.
- Risk: Editor UX confusion around underline in markdown.
  - Mitigation: explicit tooltip "Underline uses safe HTML tag".
- Risk: Styling mismatch for code/math themes.
  - Mitigation: design-system scoped CSS tokens.

## 15. Acceptance Criteria
- User can edit profile markdown and save successfully.
- Toolbar buttons perform required insert/wrap behavior with correct cursor movement.
- Profile markdown renders on host with syntax-highlighted code blocks.
- LaTeX renders for inline/block math (when enabled).
- Unauthorized users cannot edit another profile's markdown.
- No critical security issues from markdown rendering path.

## 16. Implementation Checklist (Actionable)
1. Confirm profile data model field and migration strategy.
2. Implement markdown insertion utility functions.
3. Build toolbar component and wire actions.
4. Build/extend editor container component.
5. Add profile save mutation + auth checks in Convex.
6. Integrate editor into profile settings route.
7. Integrate renderer into public/private profile view.
8. Add sanitization and protocol-safe link/image handling.
9. Add unit/integration tests and manual QA pass.
10. Deploy behind feature flag if desired.

## 17. Open Questions for Review
- Should markdown be public by default or private/profile-owner only? - public rendering, but only editable by owner. Can be hidden. If not set, use "You've reached the inhabited" as default text.
- Should underline be supported via HTML `<u>` or omitted for strict markdown purity? - Answered above, omit it. 
- Do we need image upload now, or URL-only is sufficient for MVP? - URL only, we do not have a CDN
- Embedded editor only, or embedded + floating dialog in MVP? - Embedded only for MVP, dialog can come in Phase 2.
- Should math rendering be enabled by default for all profiles? - Yes