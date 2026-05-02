import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Get all courses with review statistics
export const list = query({
  args: {
    skip: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const allCourses = await ctx.db.query("courses").order("desc").collect()
    const skip = args.skip || 0
    const limit = args.limit || 50
    return allCourses.slice(skip, skip + limit)
  },
})

// Get a single course by ID
export const getById = query({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.id)
    return course
  },
})

// Get a single course by name
export const getByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const courses = await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("name"), args.name))
      .collect()
    return courses[0]
  },
})

// Create a new course
export const create = mutation({
  args: {
    name: v.string(),
    isTongClassCourse: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const normalizedName = args.name.trim()
    if (!normalizedName) {
      throw new Error("Course name is required")
    }

    // Check if course already exists
    const existing = await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("name"), normalizedName))
      .first()

    if (existing) {
      throw new Error("Course already exists")
    }

    const courseId = await ctx.db.insert("courses", {
      name: normalizedName,
      isTongClassCourse: args.isTongClassCourse ?? false,
      reviewCount: 0,
      averageRating: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    return courseId
  },
})

// Update a course
export const update = mutation({
  args: {
    id: v.id("courses"),
    name: v.optional(v.string()),
    isTongClassCourse: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    const course = await ctx.db.get(id)

    if (!course) {
      throw new Error("Course not found")
    }

    // Check if new name already exists (if name is being changed)
    const normalizedName = updates.name?.trim()
    if (normalizedName && normalizedName !== course.name) {
      const existing = await ctx.db
        .query("courses")
        .filter((q) => q.eq(q.field("name"), normalizedName))
        .first()

      if (existing) {
        throw new Error("Course name already exists")
      }
    }

    await ctx.db.patch(id, {
      ...updates,
      ...(normalizedName ? { name: normalizedName } : {}),
      updatedAt: Date.now(),
    })
    return id
  },
})

// Update course review statistics
export const updateReviewStats = mutation({
  args: {
    id: v.id("courses"),
    reviewCount: v.number(),
    averageRating: v.number(),
  },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.id)

    if (!course) {
      throw new Error("Course not found")
    }

    await ctx.db.patch(args.id, {
      reviewCount: args.reviewCount,
      averageRating: args.averageRating,
      updatedAt: Date.now(),
    })
    return args.id
  },
})

// Delete a course
export const remove = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.id)

    if (!course) {
      throw new Error("Course not found")
    }

    // Soft-delete the course so we keep a record
    await ctx.db.patch(args.id, { isActive: false, removedAt: Date.now(), updatedAt: Date.now() })

    // Mark related reviews inactive and add a removed-course tag
    const tag = `[removed course] ${course.name}`
    const reviews = await ctx.db
      .query("courseReviews")
      .filter((q) => q.eq(q.field("courseName"), course.name))
      .collect()

    for (const review of reviews) {
      const existingTags = Array.isArray(review.tags) ? review.tags : []
      const nextTags = existingTags.includes(tag) ? existingTags : [...existingTags, tag]
      await ctx.db.patch(review._id, { tags: nextTags, active: false, updatedAt: Date.now() })
    }

    return args.id
  },
})

// Get courses count
export const count = query({
  handler: async (ctx) => {
    const courses = await ctx.db.query("courses").collect()
    return courses.length
  },
})

// Search courses by name
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("courses").collect()
    const q = args.query.trim().toLowerCase()
    if (!q) return []
    const filtered = all.filter((c) => c.name && c.name.toLowerCase().includes(q)).slice(0, 20)
    return filtered
  },
})
