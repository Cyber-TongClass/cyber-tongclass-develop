import { useMutation, useQuery } from "@convex-dev/react"
import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

/**
 * Auth hooks for login, registration, and session management
 */

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  // Get current user
  const currentUser = useQuery(api.auth.currentUser)
  const currentRole = useQuery(api.auth.currentUserRole)
  const isAdmin = useQuery(api.auth.isAdmin)
  const isSuperAdmin = useQuery(api.auth.isSuperAdmin)
  
  // Check if student ID is allowed to register
  const isStudentIdAllowed = useMutation(api.auth.isStudentIdAllowed)
  
  const signOut = useMutation(api.auth.signOut)
  
  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await signOut()
      router.push("/")
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }, [signOut, router])
  
  return {
    currentUser,
    currentRole,
    isAdmin: isAdmin ?? false,
    isSuperAdmin: isSuperAdmin ?? false,
    isLoading,
    isAuthenticated: !!currentUser,
    logout,
    isStudentIdAllowed,
  }
}

/**
 * Hook for checking if user has required role
 */
export function useRole(requiredRole: "member" | "admin" | "super_admin") {
  const currentRole = useQuery(api.auth.currentUserRole)
  
  if (requiredRole === "super_admin") {
    return currentRole === "super_admin"
  }
  if (requiredRole === "admin") {
    return currentRole === "admin" || currentRole === "super_admin"
  }
  return currentRole === "member" || currentRole === "admin" || currentRole === "super_admin"
}

/**
 * Hook for checking if user can perform action based on role hierarchy
 */
export function useCanManage(targetRole: "member" | "admin" | "super_admin") {
  const currentRole = useQuery(api.auth.currentUserRole)
  
  if (!currentRole) return false
  
  const roleHierarchy = {
    member: 0,
    admin: 1,
    super_admin: 2,
  }
  
  return roleHierarchy[currentRole] > roleHierarchy[targetRole]
}
