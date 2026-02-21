import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Get all published news with pagination
export const list = query({
  args: {
    skip: v.optional(v.number()),
    limit: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("news").filter((q) => q.eq(q.field("isPublished"), true))
    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category))
    }
    const news = await query
      .order("desc")
      .skip(args.skip || 0)
      .take(args.limit || 50)
      .collect()
    return news
  },
})

// Get all news including unpublished (admin only)
export const listAll = query({
  args: {
    skip: v.optional(v.number()),
    limit: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("news")
    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category))
    }
    const news = await query
      .order("desc")
      .skip(args.skip || 0)
      .take(args.limit || 50)
      .collect()
    return news
  },
})

// Get a single news by ID
export const getById = query({
  args: { id: v.id("news") },
  handler: async (ctx, args) => {
    const news = await ctx.db.get(args.id)
    return news
  },
})

// Create a new news
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    authorId: v.id("users"),
    authorName: v.optional(v.string()),
    category: v.string(),
    publishedAt: v.optional(v.number()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { title, content, authorId, category } = args
    const newsId = await ctx.db.insert("news", {
      title,
      content,
      authorId,
      authorName: args.authorName,
      category,
      publishedAt: args.publishedAt || Date.now(),
      isPublished: args.isPublished || false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    return newsId
  },
})

// Update a news
export const update = mutation({
  args: {
    id: v.id("news"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    category: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    const news = await ctx.db.get(id)
    if (!news) {
      throw new Error("News not found")
    }
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    })
    return id
  },
})

// Delete a news
export const remove = mutation({
  args: { id: v.id("news") },
  handler: async (ctx, args) => {
    const news = await ctx.db.get(args.id)
    if (!news) {
      throw new Error("News not found")
    }
    await ctx.db.delete(args.id)
    return args.id
  },
})

// Get news count
export const count = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let query = ctx.db.query("news").filter((q) => q.eq(q.field("isPublished"), true))
    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category))
    }
    const news = await query.collect()
    return news.length
  },
})
