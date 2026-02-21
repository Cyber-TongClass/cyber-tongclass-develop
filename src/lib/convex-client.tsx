import { createConvexClient } from "@convex-dev/auth/client"
import { ConvexAuthProvider } from "@convex-dev/auth/react"
import { ReactNode } from "react"
import { convex } from "./convex"

const convexClient = createConvexClient(convex)

export { ConvexAuthProvider, convex, convexClient }

export function ConvexAuthClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthProvider client={convexClient}>
      {children}
    </ConvexAuthProvider>
  )
}
