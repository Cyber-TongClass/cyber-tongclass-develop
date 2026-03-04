/**
 * 添加种子用户凭据
 */

import { mutation } from "./_generated/server"

const generateSalt = (len = 16) => {
  const cryptoImpl = (globalThis as any).crypto || (global as any).crypto
  const arr = cryptoImpl.getRandomValues(new Uint8Array(len)) as Uint8Array
  return Array.from(arr).map((b: number) => b.toString(16).padStart(2, "0")).join("")
}

const sha256Hex = async (input: string) => {
  const cryptoImpl = (globalThis as any).crypto || (global as any).crypto
  const enc = new TextEncoder().encode(input)
  const hashBuffer = await cryptoImpl.subtle.digest("SHA-256", enc)
  return Array.from(new Uint8Array(hashBuffer)).map((b: number) => b.toString(16).padStart(2, "0")).join("")
}

export default mutation({
  handler: async (ctx) => {
    // 查找现有用户
    const admin = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), "admin@tongclass.ac.cn"))
      .first()

    const member = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), "member@pku.edu.cn"))
      .first()

    // 检查是否已有凭据
    if (admin) {
      const existingCred = await ctx.db
        .query("authCredentials")
        .filter((q) => q.eq(q.field("userId"), admin._id))
        .first()

      if (!existingCred) {
        const salt = generateSalt()
        const hash = await sha256Hex("admin123" + salt)
        await ctx.db.insert("authCredentials", {
          userId: admin._id,
          passwordHash: hash,
          salt,
        })
      }
    }

    if (member) {
      const existingCred = await ctx.db
        .query("authCredentials")
        .filter((q) => q.eq(q.field("userId"), member._id))
        .first()

      if (!existingCred) {
        const salt = generateSalt()
        const hash = await sha256Hex("member123" + salt)
        await ctx.db.insert("authCredentials", {
          userId: member._id,
          passwordHash: hash,
          salt,
        })
      }
    }

    return { success: true, message: "Credentials added" }
  },
})
