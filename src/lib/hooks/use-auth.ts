"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, roleCanManage, signOut, subscribeAuth } from "@/lib/mock-auth"
import type { UserRole } from "@/types"

export function useAuth() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser())
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(() => {
    setCurrentUser(getCurrentUser())
    setIsLoading(false)
  }, [])

  useEffect(() => {
    refreshUser()
    return subscribeAuth(refreshUser)
  }, [refreshUser])

  const logout = useCallback(async () => {
    signOut()
    refreshUser()
    router.push("/")
    router.refresh()
  }, [refreshUser, router])

  const currentRole = currentUser?.role ?? null
  const isAdmin = currentRole === "admin" || currentRole === "super_admin"
  const isSuperAdmin = currentRole === "super_admin"

  return {
    currentUser,
    currentRole,
    isAdmin,
    isSuperAdmin,
    isLoading,
    isAuthenticated: !!currentUser,
    logout,
    // Local demo mode keeps this open; backend validation should happen server-side.
    isStudentIdAllowed: async () => true,
  }
}

export function useRole(requiredRole: UserRole) {
  const { currentRole } = useAuth()

  if (requiredRole === "super_admin") {
    return currentRole === "super_admin"
  }
  if (requiredRole === "admin") {
    return currentRole === "admin" || currentRole === "super_admin"
  }
  return !!currentRole
}

export function useCanManage(targetRole: UserRole) {
  const { currentRole } = useAuth()

  return useMemo(() => roleCanManage(currentRole, targetRole), [currentRole, targetRole])
}
