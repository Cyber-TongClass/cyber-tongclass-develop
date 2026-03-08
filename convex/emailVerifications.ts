import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

const PURPOSE = v.union(v.literal("email_verification"), v.literal("password_reset"))

export const create = mutation({
    args: {
        tokenHash: v.string(),
        codeHash: v.optional(v.string()),
        purpose: PURPOSE,
        userId: v.optional(v.id("users")),
        sentTo: v.string(),
        ip: v.optional(v.string()),
        userAgent: v.optional(v.string()),
        expiresAt: v.number(),
    },
    handler: async (ctx, args) => {
        return ctx.db.insert("emailVerifications", {
            tokenHash: args.tokenHash,
            codeHash: args.codeHash,
            purpose: args.purpose,
            userId: args.userId,
            sentTo: args.sentTo.trim().toLowerCase(),
            ip: args.ip,
            userAgent: args.userAgent,
            createdAt: Date.now(),
            expiresAt: args.expiresAt,
            usedAt: undefined,
        })
    },
})

export const consume = mutation({
    args: {
        tokenHash: v.optional(v.string()),
        codeHash: v.optional(v.string()),
        sentTo: v.optional(v.string()),
        purpose: PURPOSE,
    },
    handler: async (ctx, args) => {
        if (!args.tokenHash && !args.codeHash) {
            return { ok: false as const, reason: "invalid" as const }
        }

        const normalizedEmail = args.sentTo?.trim().toLowerCase()

        const rowByToken = args.tokenHash
            ? await ctx.db
                .query("emailVerifications")
                .withIndex("by_tokenHash", (q) => q.eq("tokenHash", args.tokenHash as string))
                .first()
            : null

        const row = rowByToken
            ? rowByToken
            : args.codeHash
                ? (await ctx.db
                    .query("emailVerifications")
                    .withIndex("by_sentTo", (q) => q.eq("sentTo", normalizedEmail || ""))
                    .collect())
                    .find((item) => item.codeHash === args.codeHash)
                : null

        if (!row || row.purpose !== args.purpose) {
            return { ok: false as const, reason: "invalid" as const }
        }

        if (row.usedAt) {
            return { ok: false as const, reason: "used" as const }
        }

        if (Date.now() > row.expiresAt) {
            return { ok: false as const, reason: "expired" as const }
        }

        await ctx.db.patch(row._id, { usedAt: Date.now() })

        return {
            ok: true as const,
            userId: row.userId,
            sentTo: row.sentTo,
            purpose: row.purpose,
        }
    },
})

export const getRecentStats = query({
    args: {
        email: v.string(),
        ip: v.optional(v.string()),
        withinMs: v.number(),
    },
    handler: async (ctx, args) => {
        const normalizedEmail = args.email.trim().toLowerCase()
        const now = Date.now()
        const since = now - args.withinMs

        const [byEmail, byIp] = await Promise.all([
            ctx.db
                .query("emailVerifications")
                .withIndex("by_sentTo", (q) => q.eq("sentTo", normalizedEmail))
                .collect(),
            args.ip
                ? ctx.db
                    .query("emailVerifications")
                    .withIndex("by_ip", (q) => q.eq("ip", args.ip))
                    .collect()
                : Promise.resolve([] as any[]),
        ])

        const emailRecent = byEmail.filter((item) => item.createdAt >= since)
        const ipRecent = byIp.filter((item) => item.createdAt >= since)

        const latestByEmail = emailRecent
            .map((item) => item.createdAt)
            .sort((a, b) => b - a)[0]

        return {
            emailRecentCount: emailRecent.length,
            ipRecentCount: ipRecent.length,
            latestByEmail: latestByEmail ?? null,
            now,
        }
    },
})
