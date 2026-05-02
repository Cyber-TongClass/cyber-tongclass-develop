import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

type ReviewStatus = "pending" | "approved" | "rejected"

function assertRatingRange(value: number, min: number, max: number, label: string) {
  if (value < min || value > max) {
    throw new Error(`${label} must be between ${min} and ${max}`)
  }
}

async function syncCourseStatsByName(ctx: any, courseName: string) {
  const normalizedCourseName = courseName.trim()
  if (!normalizedCourseName) return

  const course = await ctx.db
    .query("courses")
    .filter((q: any) => q.eq(q.field("name"), normalizedCourseName))
    .first()

  if (!course) return

  const approvedReviews = await ctx.db
    .query("courseReviews")
    .filter((q: any) => q.eq(q.field("courseName"), normalizedCourseName))
    .filter((q: any) => q.eq(q.field("status"), "approved"))
    .collect()

  const reviewCount = approvedReviews.length
  const averageRating = reviewCount > 0
    ? Math.round((approvedReviews.reduce((sum: number, review: any) => sum + review.overallRating, 0) / reviewCount) * 10) / 10
    : 0

  await ctx.db.patch(course._id, {
    reviewCount,
    averageRating,
    updatedAt: Date.now(),
  })
}

export const listByCourse = query({
  args: {
    courseName: v.string(),
    instructor: v.optional(v.string()),
    semesterYear: v.optional(v.number()),
    semesterTerm: v.optional(v.union(v.literal("spring"), v.literal("fall"))),
  },
  handler: async (ctx, args) => {
    let reviews = await ctx.db
      .query("courseReviews")
      .filter((q) => q.eq(q.field("status"), "approved"))
      .filter((q) => q.eq(q.field("courseName"), args.courseName))
      .order("desc")
      .collect()

    if (args.instructor) {
      reviews = reviews.filter((review) => review.instructor === args.instructor)
    }

    if (args.semesterYear !== undefined) {
      reviews = reviews.filter((review) => review.semesterYear === args.semesterYear)
    }

    if (args.semesterTerm) {
      reviews = reviews.filter((review) => review.semesterTerm === args.semesterTerm)
    }

    return reviews
  },
})

export const listByCourseAll = query({
  args: {
    courseName: v.optional(v.string()),
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
  },
  handler: async (ctx, args) => {
    let reviews = await ctx.db.query("courseReviews").order("desc").collect()

    if (args.courseName) {
      reviews = reviews.filter((review) => review.courseName === args.courseName)
    }

    if (args.status) {
      reviews = reviews.filter((review) => review.status === args.status)
    }

    return reviews
  },
})

export const listPending = query({
  args: {
    skip: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("courseReviews")
      .filter((q) => q.eq(q.field("status"), "pending"))
      .order("desc")
      .collect()

    const skip = args.skip || 0
    const limit = args.limit || 50
    return reviews.slice(skip, skip + limit)
  },
})

export const listCourses = query({
  handler: async (ctx) => {
    const reviews = await ctx.db
      .query("courseReviews")
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect()

    const courseMap = new Map<string, { count: number; totalRating: number }>()

    for (const review of reviews) {
      const existing = courseMap.get(review.courseName)
      if (existing) {
        existing.count++
        existing.totalRating += review.overallRating
      } else {
        courseMap.set(review.courseName, { count: 1, totalRating: review.overallRating })
      }
    }

    return Array.from(courseMap.entries())
      .map(([name, data]) => ({
        name,
        reviewCount: data.count,
        averageRating: Math.round((data.totalRating / data.count) * 10) / 10,
      }))
      .sort((a, b) => b.reviewCount - a.reviewCount)
  },
})

export const create = mutation({
  args: {
    courseName: v.string(),
    instructor: v.string(),
    semesterYear: v.number(),
    semesterTerm: v.union(v.literal("spring"), v.literal("fall")),
    overallRating: v.number(),
    department: v.optional(v.string()),
    attendanceRequired: v.optional(v.boolean()),
    workload: v.optional(v.number()),
    pace: v.optional(v.number()),
    gradingFairness: v.optional(v.number()),
    courseAverageScore: v.optional(v.number()),
    personalScore: v.optional(v.number()),
    recommendedStudyMethod: v.optional(v.union(v.literal("attend"), v.literal("recording"), v.literal("self_study"))),
    content: v.string(),
    isAnonymous: v.optional(v.boolean()),
    authorId: v.optional(v.id("users")),
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
  },
  handler: async (ctx, args) => {
    const courseName = args.courseName.trim()
    const instructor = args.instructor.trim()
    const content = args.content.trim()
    const department = args.department?.trim()

    if (!courseName || !instructor || !content) {
      throw new Error("Course name, instructor, and content are required")
    }

    assertRatingRange(args.overallRating, 1, 10, "Overall rating")
    if (args.workload !== undefined) assertRatingRange(args.workload, 1, 5, "Workload")
    if (args.pace !== undefined) assertRatingRange(args.pace, 1, 5, "Pace")
    if (args.gradingFairness !== undefined) assertRatingRange(args.gradingFairness, 1, 5, "Grading fairness")

    const status: ReviewStatus = args.status ?? "pending"
    const reviewId = await ctx.db.insert("courseReviews", {
      courseName,
      instructor,
      semesterYear: args.semesterYear,
      semesterTerm: args.semesterTerm,
      overallRating: args.overallRating,
      department: department || undefined,
      attendanceRequired: args.attendanceRequired,
      workload: args.workload,
      pace: args.pace,
      gradingFairness: args.gradingFairness,
      courseAverageScore: args.courseAverageScore,
      personalScore: args.personalScore,
      recommendedStudyMethod: args.recommendedStudyMethod,
      content,
      isAnonymous: args.isAnonymous ?? true,
      authorId: args.authorId,
      status,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    if (status === "approved") {
      await syncCourseStatsByName(ctx, courseName)
    }

    return reviewId
  },
})

export const update = mutation({
  args: {
    id: v.id("courseReviews"),
    courseName: v.optional(v.string()),
    instructor: v.optional(v.string()),
    semesterYear: v.optional(v.number()),
    semesterTerm: v.optional(v.union(v.literal("spring"), v.literal("fall"))),
    overallRating: v.optional(v.number()),
    department: v.optional(v.string()),
    attendanceRequired: v.optional(v.boolean()),
    workload: v.optional(v.number()),
    pace: v.optional(v.number()),
    gradingFairness: v.optional(v.number()),
    courseAverageScore: v.optional(v.number()),
    personalScore: v.optional(v.number()),
    recommendedStudyMethod: v.optional(v.union(v.literal("attend"), v.literal("recording"), v.literal("self_study"))),
    content: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    const review = await ctx.db.get(id)
    if (!review) {
      throw new Error("Review not found")
    }

    const normalizedUpdates = {
      ...updates,
      ...(updates.courseName !== undefined ? { courseName: updates.courseName.trim() } : {}),
      ...(updates.instructor !== undefined ? { instructor: updates.instructor.trim() } : {}),
      ...(updates.department !== undefined ? { department: updates.department.trim() || undefined } : {}),
      ...(updates.content !== undefined ? { content: updates.content.trim() } : {}),
    }

    if (normalizedUpdates.courseName !== undefined && !normalizedUpdates.courseName) {
      throw new Error("Course name is required")
    }
    if (normalizedUpdates.instructor !== undefined && !normalizedUpdates.instructor) {
      throw new Error("Instructor is required")
    }
    if (normalizedUpdates.content !== undefined && !normalizedUpdates.content) {
      throw new Error("Content is required")
    }
    if (normalizedUpdates.overallRating !== undefined) {
      assertRatingRange(normalizedUpdates.overallRating, 1, 10, "Overall rating")
    }
    if (normalizedUpdates.workload !== undefined) {
      assertRatingRange(normalizedUpdates.workload, 1, 5, "Workload")
    }
    if (normalizedUpdates.pace !== undefined) {
      assertRatingRange(normalizedUpdates.pace, 1, 5, "Pace")
    }
    if (normalizedUpdates.gradingFairness !== undefined) {
      assertRatingRange(normalizedUpdates.gradingFairness, 1, 5, "Grading fairness")
    }

    const oldCourseName = review.courseName
    await ctx.db.patch(id, { ...normalizedUpdates, updatedAt: Date.now() })

    const nextCourseName = normalizedUpdates.courseName ?? oldCourseName
    const affectedCourseNames = new Set<string>([oldCourseName, nextCourseName])
    for (const courseName of affectedCourseNames) {
      await syncCourseStatsByName(ctx, courseName)
    }

    return id
  },
})

export const approve = mutation({
  args: { id: v.id("courseReviews") },
  handler: async (ctx, args) => {
    const review = await ctx.db.get(args.id)
    if (!review) {
      throw new Error("Review not found")
    }
    await ctx.db.patch(args.id, { status: "approved", updatedAt: Date.now() })
    await syncCourseStatsByName(ctx, review.courseName)
    return args.id
  },
})

export const reject = mutation({
  args: { id: v.id("courseReviews") },
  handler: async (ctx, args) => {
    const review = await ctx.db.get(args.id)
    if (!review) {
      throw new Error("Review not found")
    }
    await ctx.db.patch(args.id, { status: "rejected", updatedAt: Date.now() })
    await syncCourseStatsByName(ctx, review.courseName)
    return args.id
  },
})

export const remove = mutation({
  args: { id: v.id("courseReviews") },
  handler: async (ctx, args) => {
    const review = await ctx.db.get(args.id)
    if (!review) {
      throw new Error("Review not found")
    }
    await ctx.db.delete(args.id)
    await syncCourseStatsByName(ctx, review.courseName)
    return args.id
  },
})

export const updateCourseName = mutation({
  args: {
    oldName: v.string(),
    newName: v.string(),
  },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("courseReviews")
      .filter((q) => q.eq(q.field("courseName"), args.oldName))
      .collect()

    for (const review of reviews) {
      await ctx.db.patch(review._id, { courseName: args.newName, updatedAt: Date.now() })
    }

    await syncCourseStatsByName(ctx, args.oldName)
    await syncCourseStatsByName(ctx, args.newName)

    return reviews.length
  },
})
