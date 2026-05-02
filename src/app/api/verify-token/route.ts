import { NextRequest, NextResponse } from "next/server"
import { api } from "@/../convex/_generated/api"
import { getConvexHttpClient } from "@/lib/server/convex-http"
import { normalizeEmail, sha256Hex, signEmailVerificationProof, signPasswordResetProof } from "@/lib/server/verification"

type Purpose = "email_verification" | "password_reset"
const PURPOSE_SET = new Set<Purpose>(["email_verification", "password_reset"])

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const purpose = String(body?.purpose || "") as Purpose
        const token = body?.token ? String(body.token) : ""
        const code = body?.code ? String(body.code).trim() : ""
        const email = body?.email ? normalizeEmail(String(body.email)) : ""

        if (!PURPOSE_SET.has(purpose) || (!token && !code)) {
            return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 })
        }

        const client = getConvexHttpClient()

        const consume = await client.mutation(api.emailVerifications.consume, {
            purpose,
            tokenHash: token ? sha256Hex(token) : undefined,
            codeHash: code ? sha256Hex(code) : undefined,
            sentTo: email || undefined,
        } as any)

        if (!consume.ok) {
            const reason = (consume as any).reason || "invalid"
            return NextResponse.json({ ok: false, reason, message: `Token consume failed: ${reason}` }, { status: 400 })
        }

        if (purpose === "email_verification") {
            if (consume.userId) {
                await client.mutation(api.users.markEmailVerified, { userId: consume.userId } as any)
            }

            return NextResponse.json({
                ok: true,
                message: "Email verified successfully.",
                email: consume.sentTo,
                proof: consume.sentTo ? signEmailVerificationProof(consume.sentTo) : undefined,
            })
        }

        let targetUserId = consume.userId as string | undefined
        if (!targetUserId && consume.sentTo) {
            const user = await client.query(api.users.getByEmail, { email: consume.sentTo } as any)
            targetUserId = user?._id
        }

        if (!targetUserId || !consume.sentTo) {
            return NextResponse.json({ ok: false, message: "Unable to resolve target account." }, { status: 400 })
        }

        const proof = signPasswordResetProof(targetUserId, consume.sentTo)
        return NextResponse.json({ ok: true, proof })
    } catch (error) {
        console.error("verify-token error", error)
        return NextResponse.json({ ok: false, message: "Verification failed." }, { status: 500 })
    }
}
