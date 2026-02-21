import { createConvexReactClient } from "@convex-dev/react"
import { httpBatchLink } from "@tanstack/react-query"

// This is the client-side configuration for connecting to Convex
// The actual Convex backend is configured in convex/ folder
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || ""

if (!convexUrl) {
  console.warn("NEXT_PUBLIC_CONVEX_URL is not set. Authentication may not work.")
}

export const convex = createConvexReactClient(
  convex,
  {
    bridgeUrl: convexUrl,
    globalApis: {
      auth: ["currentUser", "currentUserRole", "isAdmin", "isSuperAdmin", "signOut"],
    },
  }
)

// For backwards compatibility
export { createConvexReactClient }
