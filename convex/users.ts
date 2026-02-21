import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Get all users with pagination
export const list = query({
  args: {
    skip: v.optional(v.number()),
    limit: v.optional(v.number()),
    organization: v.optional(v.union(v.literal("pku"), v.literal("thu"))),
    cohort: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("users")

    if (args.organization) {
      query = query.filter((q) =>
        q.and(
          q.eq(q.field("organization"), args.organization),
          args.cohort ? q.eq(q.field("cohort"), args.cohort) : true
        )
      )
    }

    const users = await query
      .order("desc")
      .skip(args.skip || 0)
      .take(args.limit || 50)
      .collect()

    return users
  },
})

// Get a single user by ID
export const getById = query({
 id: v.id("users") },
  args: {  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id)
    return user
  },
})

// Get a single user by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect()
    return users[0]
  },
})

// Get a single user by student ID
export const getByStudentId = query({
  args: { studentId: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .collect()
    return users[0]
  },
})

// Create a new user
export const create = mutation({
  args: {
    email: v.string(),
    username: v.string(),
    englishName: v.string(),
    organization: v.union(v.literal("pku"), v.literal("thu")),
    cohort: v.number(),
    studentId: v.string(),
    personalEmail: v.optional(v.string()),
    bio: v.optional(v.string()),
    researchInterests: v.optional(v.array(v.string())),
    titles: v.optional(v.array(v.object({ title: v.string(), link: v.string() }))),
    scholarUrl: v.optional(v.string()),
    orcidUrl: v.optional(v.string()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { email, username, englishName, organization, cohort, studentId } = args

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .collect()

    if (existingUser.length > 0) {
      throw new Error("User already exists")
    }

    const userId = await ctx.db.insert("users", {
      email,
      username,
      englishName,
      role: "member",
      organization,
      cohort,
      studentId,
      personalEmail: args.personalEmail,
      bio: args.bio,
      researchInterests: args.researchInterests,
      titles: args.titles,
      scholarUrl: args.scholarUrl,
      orcidUrl: args.orcidUrl,
      avatar: args.avatar,
      isEmailVerified: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return userId
  },
})

// Update user profile
export const update = mutation({
  args: {
    id: v.id("users"),
    username: v.optional(v.string()),
    englishName: v.optional(v.string()),
    personalEmail: v.optional(v.string()),
    bio: v.optional(v.string()),
    researchInterests: v.optional(v.array(v.string())),
    titles: v.optional(v.array(v.object({ title: v.string(), link: v.string() }))),
    scholarUrl: v.optional(v.string()),
    orcidUrl: v.optional(v.string()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    const user = await ctx.db.get(id)

    if (!user) {
      throw new Error("User not found")
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    })

    return id
  },
})

// Update user role (admin only)
export const updateRole = mutation({
  args: {
    id: v.id("users"),
    role: v.union(v.literal("member"), v.literal("admin"), v.literal("super_admin")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id)

    if (!user) {
      throw new Error("User not found")
    }

    await ctx.db.patch(args.id, {
      role: args.role,
      updatedAt: Date.now(),
    })

    return args.id
  },
})

// Delete a user (admin only)
export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id)

    if (!user) {
      throw new Error("User not found")
    }

    await ctx.db.delete(args.id)
    return args.id
  },
})

// Get users count
export const count = query({
  args: {
    organization: v.optional(v.union(v.literal("pku"), v.literal("thu"))),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("users")

    if (args.organization) {
      query = query.filter((q) => q.eq(q.field("organization"), args.organization))
    }

    const users = await query.collect()
    return users.length
  },
})

// Search users by name
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .filter((q) =>
        q.or(
          q.contains(q.field("englishName"), args.query),
          q.contains(q.field("username"), args.query)
        )
      )
      .take(20)
      .collect()

    return users
  },
})
