 Overview
  - Purpose: Add secure email verification and password-reset flows so users can verify email and change passwords without admin intervention. Protect verification requests with Cloudflare Turnstile and server-side rate limits. Use your 163-mail SMTP for sending.

  Data model (Convex)
  - New table: `email_verifications` with fields: `id`, `tokenHash` (sha256), `purpose` (`email_verification`|`password_reset`), `userId?`, `sentTo`, `ip`, `createdAt`, `expiresAt`, `usedAt?`, `meta`.

  Convex mutations (server-side)
  - `createEmailVerification({ tokenHash, purpose, userId?, sentTo, ip, expiresAt, meta })`
  - `useEmailVerification({ tokenHash })` → validates unused & not expired, marks `usedAt`, returns record
  - `applyEmailVerification({ tokenHash })` (optional helper): atomically apply effect (set `users.emailVerified`, or return `userId` for password reset)

  Server API endpoints (Next.js)
  - `POST /api/request-verification` — body: `{ email, purpose, turnstileToken, userId? }`
    - Verify Turnstile server-side, rate-limit by email/ip, generate raw token (crypto.randomBytes(32) base64url), hash (sha256), call `createEmailVerification`, send email (Nodemailer).
  - `POST /api/verify-token` — body: `{ token, purpose }` or query for link flows
    - Hash token, call `useEmailVerification` / `applyEmailVerification`, return success or short-lived proof for password reset.
  - `POST /api/reset-password` — body: `{ token, newPassword }` or `{ proof, newPassword }`
    - Validate token/proof, hash new password (`bcryptjs`), call Convex mutation to update `users.passwordHash`.

  Frontend changes
  - After register: call `POST /api/request-verification` and show Turnstile widget when requesting codes.
  - Add pages: request-verify, verify-result (called from link), reset-password.

  Turnstile
  - Client: include `TURNSTILE_SITE_KEY` widget on verification request forms.
  - Server: verify via `https://challenges.cloudflare.com/turnstile/v0/siteverify` using `TURNSTILE_SECRET` and `response`.

  SMTP (163-mail) env vars
  - `SMTP_HOST=smtp.163.com`, `SMTP_PORT=465` (or 587), `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
  - Other envs: `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET`, `EMAIL_TOKEN_EXPIRY_MIN` (e.g., 15), `EMAIL_VERIFY_EXPIRY_HOURS` (e.g., 24), `EMAIL_SIGNING_KEY` (optional HMAC for short proofs)

  Security & anti-abuse
  - Store only `tokenHash` (sha256). Tokens are single-use and expire.
  - Rate-limit by email and IP (e.g., 5/hour per email, 20/hour per IP) using Convex queries.
  - Require Turnstile for unauthenticated requests; also require session check or Turnstile for authenticated email change.
  - Hash passwords with `bcryptjs` before storing.

  Implementation phases (minimal, ordered)
  1. Add `email_verifications` table and Convex mutations (create/use/apply).
  2. Implement `POST /api/request-verification` with Turnstile check and Nodemailer send (use your 163 SMTP for testing).
  3. Implement `POST /api/verify-token` and `POST /api/reset-password` and wire Convex updates.
  4. Integrate frontend flows (register, request-verify, verify-result, reset-password).
  5. Add rate-limits, cooldown fields, logging; test and harden.

  Testing & deploy
  - Locally: set SMTP envs and TURNSTILE secrets; run `npx convex codegen && npx convex dev --once` to apply Convex changes; test flows.
  *** Begin Elaboration ***

  This is the full, elaborated plan. Use it as the canonical implementation roadmap. Each section includes actionable steps, example code, and configuration details so you can review or edit before I implement.

  1) Detailed Convex schema (exact patch to add)

  Add to `convex/schema.ts` (TypeScript-like schema snippet):

    users: {
      // existing fields...
      emailVerified: v.optional(v.boolean()),
    }

    email_verifications: {
      tokenHash: v.string(),
      purpose: v.union(v.literal('email_verification'), v.literal('password_reset')),
      userId: v.optional(v.string()),
      sentTo: v.string(),
      ip: v.optional(v.string()),
      createdAt: v.datetime(),
      expiresAt: v.datetime(),
      usedAt: v.optional(v.datetime()),
      meta: v.optional(v.object())
    }

  Indexes: add index on `tokenHash` and `sentTo` to speed lookup/count queries.

  2) Convex mutation and helper functions (server-only)

  File: `convex/email.ts` (high level):

    import { mutation, query } from 'convex-server'

    export const createEmailVerification = mutation(async ({ db }, { tokenHash, purpose, userId, sentTo, ip, expiresAt, meta }) => {
      // Basic validation
      const now = new Date()
      await db.insert('email_verifications', { tokenHash, purpose, userId, sentTo, ip, createdAt: now, expiresAt, usedAt: null, meta })
    })

    export const useVerification = mutation(async ({ db }, { tokenHash }) => {
      // Atomically find an active verification and mark usedAt
      const row = await db.findOne('email_verifications', q.eq(q.field('tokenHash'), tokenHash), q.isNull(q.field('usedAt')), q.gt(q.field('expiresAt'), new Date()))
      if (!row) throw new Error('Invalid or expired token')
      await db.update('email_verifications', row._id, { usedAt: new Date() })
      return row
    })

    export const applyVerification = mutation(async ({ db }, { tokenHash }) => {
      const row = await useVerification({ tokenHash })
      if (row.purpose === 'email_verification') {
        // Set user.emailVerified = true
        await db.update('users', row.userId, { emailVerified: true })
        return { status: 'ok', type: 'email_verified' }
      }
      if (row.purpose === 'password_reset') {
        return { status: 'ok', type: 'password_reset', userId: row.userId }
      }
    })

  Notes: the above is pseudocode; adapt to Convex APIs used in this repo (the repo already has many mutations; mirror style and auth checks).

  3) Server API route: request-verification (detailed)

  Path: `src/app/api/request-verification/route.ts`

  Behavior (Pseudo-implementation):

    import { NextResponse } from 'next/server'
    import crypto from 'crypto'
    import fetch from 'node-fetch'
    import nodemailer from 'nodemailer'

    export async function POST(req) {
      const { email, purpose, turnstileToken, userId } = await req.json()
      const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown'

      // 1) Turnstile verify
      const verifyResp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET, response: turnstileToken, remoteip: ip }) })
      const verifyJson = await verifyResp.json()
      if (!verifyJson.success) return NextResponse.json({ ok: true }) // generic response

      // 2) Rate-limit checks (call Convex query to count recent rows)

      // 3) Create token
      const raw = crypto.randomBytes(32).toString('base64url')
      const tokenHash = crypto.createHash('sha256').update(raw).digest('hex')
      const expiresAt = new Date(Date.now() + (purpose === 'password_reset' ? Number(process.env.EMAIL_TOKEN_EXPIRY_MIN || 15) * 60 * 1000 : Number(process.env.EMAIL_VERIFY_EXPIRY_HOURS || 24) * 3600 * 1000))

      // 4) Convex create
      await createEmailVerification({ tokenHash, purpose, userId, sentTo: email, ip, expiresAt, meta: { ua: req.headers.get('user-agent') } })

      // 5) Send email (Nodemailer)
      const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT), secure: Number(process.env.SMTP_PORT) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } })
      const link = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify?token=${encodeURIComponent(raw)}&purpose=${purpose}`
      await transporter.sendMail({ from: process.env.SMTP_FROM, to: email, subject: purpose === 'password_reset' ? 'Reset your password' : 'Verify your email', html: `<p>Click <a href="${link}">this link</a> to ${purpose === 'password_reset' ? 'reset your password' : 'verify your email'}.</p><p>Link expires in ${purpose === 'password_reset' ? process.env.EMAIL_TOKEN_EXPIRY_MIN : process.env.EMAIL_VERIFY_EXPIRY_HOURS} minutes.</p>` })

      // 6) Generic success
      return NextResponse.json({ ok: true })
    }

  Notes: return generic success to prevent email enumeration. Adjust wording and templates to match project branding.

  4) Server API route: verify-token and reset-password (detailed)

  verify-token: hash incoming token, call `applyVerification`. If password_reset, return signed proof (HMAC) containing userId and expiry (e.g., 10 minutes). Use `EMAIL_SIGNING_KEY`.

  reset-password: accept `{ proof, newPassword }` or `{ token, newPassword }`. Verify proof or token, hash password (bcrypt), call Convex `updateUserPassword(userId, passwordHash)`, and mark token used.

  Security: never log raw tokens.

  5) Rate limiting & counters (Convex pattern)

  Example Convex query to count requests in last hour:

    const since = new Date(Date.now() - 60 * 60 * 1000)
    const count = await db.query('email_verifications').filter(r => r.sentTo === email && r.createdAt > since).count()

  Reject if count exceeds threshold. For IP-based counts, filter by `ip`.

  If you need stronger guarantees at scale, add Redis or a managed rate-limit service.

  6) Email templates and UX copy

  - Keep emails short and actionable. Include link and plain text fallback for clients that block HTML.
  - Example subject lines:
    - Verify your TongClass email
    - Reset your TongClass password

  Include the expiry time and a short contact/help link.

  7) Logging, monitoring, and alerting

  - Emit structured log events for: `verification_requested`, `turnstile_failed`, `email_sent`, `email_send_failed`, `token_used`, `token_expired`.
  - Add alerts for high rate of `turnstile_failed` or `email_send_failed`.

  8) Tests and QA

  - Automated tests:
    - Unit tests for Convex mutations (verify create/use semantics and edge cases).
    - Integration tests with a test SMTP server (MailHog or Ethereal) or using your 163 SMTP in a staging environment.

  - Manual QA checklist:
    - Register a new account and verify email flow end-to-end.
    - Request password reset and complete flow.
    - Attempt reuse of token and ensure rejected.
    - Test Turnstile failure paths.

  9) Deployment checklist

  - Add env vars to Vercel/CI: `SMTP_*`, `TURNSTILE_*`, `EMAIL_*`, `EMAIL_SIGNING_KEY`, `NEXT_PUBLIC_SITE_URL`.
  - Run `npx convex codegen` and `npx convex deploy` (or `npx convex dev --once` for dev) after schema changes.
  - Deploy Next app and run smoke tests.

  10) Rollout and rollback

  - Rollout: merge feature branch → staging deployment → smoke tests → production deploy.
  - Rollback: remove ability to request new tokens (temporary feature flag) and invalidate tokens by marking future tokens unusable if critical issue found.

  11) Phase-by-phase implementation plan (concrete tasks)

  - Phase 1 (Convex schema + mutations):
    - Edit `convex/schema.ts` and add `email_verifications`.
    - Add `convex/email.ts` with `createEmailVerification`, `useVerification`, `applyVerification`.
    - Run `npx convex codegen` and `npx convex dev --once` locally.

  - Phase 2 (request-verification API):
    - Add `src/app/api/request-verification/route.ts`.
    - Implement Turnstile verify, rate checks, token gen, Convex create, Nodemailer send.
    - Test email delivery using your 163 SMTP credentials in staging.

  - Phase 3 (verify-token + reset-password):
    - Add `src/app/api/verify-token/route.ts` and `src/app/api/reset-password/route.ts`.
    - Implement proof generation (HMAC) for password reset if desired.

  - Phase 4 (frontend & hardening):
    - Integrate into `src/app/register/page.tsx` and add `src/app/auth/*` pages.
    - Add UI cooldowns, resend UX, and error handling.
    - Add rate-limit improvements, logging, and tests.

  Questions for you (repeat & final):

  1) Tokens: link tokens (recommended) or numeric codes? (I recommend link tokens + optional displayed code fallback.)
  2) Password hashing: `bcryptjs` or `argon2`? (Recommend `bcryptjs` unless you prefer `argon2`.)
  3) Rate-limit backend: Convex-only or add Redis? (Start Convex; move to Redis if scale requires.)

  If you confirm the answers, I'll start implementing Phase 1 now.

  *** End Elaboration ***