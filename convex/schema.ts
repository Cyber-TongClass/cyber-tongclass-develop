import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // Users table
  users: defineTable({
    email: v.string(),
    username: v.string(),
    englishName: v.string(),
    chineseName: v.optional(v.string()),
    role: v.union(v.literal("member"), v.literal("admin"), v.literal("super_admin")),
    organization: v.union(v.literal("pku"), v.literal("thu")),
    cohort: v.union(v.number(), v.literal("mascot")),
    studentId: v.string(),
    personalEmails: v.optional(v.array(v.string())),
    personalEmail: v.optional(v.string()),
    bio: v.optional(v.string()),
    profileMarkdown: v.optional(v.string()),
    researchDirections: v.optional(v.array(v.string())),
    researchInterests: v.optional(v.array(v.string())),
    links: v.optional(v.array(v.object({
      type: v.union(
        v.literal("homepage"),
        v.literal("scholar"),
        v.literal("orcid"),
        v.literal("github"),
        v.literal("x"),
        v.literal("xiaohongshu"),
        v.literal("linkedin"),
        v.literal("custom")
      ),
      label: v.string(),
      url: v.string(),
    }))),
    titles: v.optional(v.array(v.object({ title: v.string(), link: v.string() }))),
    scholarUrl: v.optional(v.string()),
    orcidUrl: v.optional(v.string()),
    avatar: v.optional(v.string()),
    realPhoto: v.optional(v.string()),
    isEmailVerified: v.boolean(),
    lastVerificationRequestedAt: v.optional(v.number()),
    // Track approvals for moderation reputation
    approvedContributions: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_studentId", ["studentId"])
    .index("by_role", ["role"])
    .index("by_organization", ["organization", "cohort"]),

  // Publications table
  publications: defineTable({
    title: v.string(),
    authors: v.array(v.string()),
    venue: v.string(),
    year: v.number(),
    abstract: v.string(),
    url: v.optional(v.string()),
    category: v.string(),
    subCategory: v.optional(v.string()),
    userId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_year", ["year"])
    .index("by_category", ["category"])
    .searchIndex("search_title", { searchField: "title" }),

  // Course reviews table
  courseReviews: defineTable({
    courseName: v.string(),
    instructor: v.optional(v.string()),
    semesterYear: v.optional(v.number()),
    semesterTerm: v.optional(v.union(v.literal("spring"), v.literal("fall"))),
    overallRating: v.optional(v.number()),
    rating: v.optional(v.number()),
    semester: v.optional(v.string()),
    department: v.optional(v.string()),
    attendanceRequired: v.optional(v.boolean()),
    workload: v.optional(v.number()),
    pace: v.optional(v.number()),
    gradingFairness: v.optional(v.number()),
    courseAverageScore: v.optional(v.number()),
    personalScore: v.optional(v.number()),
    recommendedStudyMethod: v.optional(v.union(v.literal("attend"), v.literal("recording"), v.literal("self_study"))),
    content: v.string(),
    isAnonymous: v.boolean(),
    authorId: v.optional(v.id("users")),
    // New fields: tags and active flag (optional for migration)
    tags: v.optional(v.array(v.string())),
    active: v.optional(v.boolean()),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_course", ["courseName"])
    .index("by_status", ["status"])
    .index("by_instructor", ["instructor"])
    .index("by_semester", ["semesterYear", "semesterTerm"]),

  // Review tag metadata (color, etc.)
  reviewTags: defineTable({
    name: v.string(),
    color: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_name", ["name"]),

  // News table
  news: defineTable({
    title: v.string(),
    content: v.string(),
    sourceUrl: v.optional(v.string()),
    authorId: v.id("users"),
    authorName: v.optional(v.string()),
    category: v.string(),
    publishedAt: v.number(),
    isPublished: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_publishedAt", ["publishedAt"])
    .index("by_category", ["category"])
    .index("by_author", ["authorId"])
    .searchIndex("search_title", { searchField: "title" }),

  // Events table
  events: defineTable({
    title: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    endDate: v.optional(v.string()),
    endTime: v.optional(v.string()),
    location: v.optional(v.string()),
    description: v.optional(v.string()),
    url: v.optional(v.string()),
    color: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_date", ["date"]),

  // Courses table
  courses: defineTable({
    name: v.string(),
    department: v.optional(v.string()),
    instructor: v.optional(v.string()),
    isTongClassCourse: v.optional(v.boolean()),
    // Soft-delete support
    isActive: v.optional(v.boolean()),
    removedAt: v.optional(v.number()),
    reviewCount: v.number(),
    averageRating: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_name", ["name"]),

  // Auth config table (for pre-registered student IDs)
  authConfig: defineTable({
    allowedStudentIds: v.array(v.string()),
    updatedAt: v.number(),
  }),

  // Auth credentials table (for password auth)
  authCredentials: defineTable({
    userId: v.id("users"),
    passwordHash: v.string(),
    salt: v.optional(v.string()),
  })
    .index("by_userId", ["userId"]),

  emailVerifications: defineTable({
    tokenHash: v.string(),
    codeHash: v.optional(v.string()),
    purpose: v.union(v.literal("email_verification"), v.literal("password_reset")),
    userId: v.optional(v.id("users")),
    sentTo: v.string(),
    ip: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
    expiresAt: v.number(),
    usedAt: v.optional(v.number()),
  })
    .index("by_tokenHash", ["tokenHash"])
    .index("by_sentTo", ["sentTo"])
    .index("by_ip", ["ip"])
    .index("by_createdAt", ["createdAt"]),
})
