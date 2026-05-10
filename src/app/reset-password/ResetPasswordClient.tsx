"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ResetPasswordClient() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token") || ""
    const purpose = (searchParams.get("purpose") || "password_reset") as "password_reset"

    const [proof, setProof] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [status, setStatus] = useState<"verifying" | "ready" | "done" | "error">("verifying")
    const [message, setMessage] = useState("Verifying reset link...")
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!token) {
            setStatus("error")
            setMessage("Reset token is missing.")
            return
        }

        let cancelled = false

        fetch("/api/verify-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, purpose }),
        })
            .then(async (res) => {
                const data = await res.json()
                if (cancelled) return
                if (res.ok && data.ok && data.proof) {
                    setProof(data.proof)
                    setStatus("ready")
                    setMessage("Token verified. You can now set a new password.")
                    return
                }

                setStatus("error")
                setMessage(data.message || "Reset link is invalid or expired.")
            })
            .catch(() => {
                if (cancelled) return
                setStatus("error")
                setMessage("Failed to verify reset token.")
            })

        return () => {
            cancelled = true
        }
    }, [token, purpose])

    const handleReset = async () => {
        if (newPassword.length < 8) {
            setMessage("Password must be at least 8 characters.")
            return
        }

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.")
            return
        }

        setSubmitting(true)
        setMessage("")

        try {
            const response = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ proof, newPassword }),
            })

            const data = await response.json()
            if (!response.ok || !data.ok) {
                setMessage(data.message || "Failed to reset password.")
                return
            }

            setStatus("done")
            setMessage("Password has been reset successfully. Redirecting to login...")
            setTimeout(() => {
                router.push("/login")
            }, 1200)
        } catch {
            setMessage("Failed to reset password.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>{message}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {status === "ready" && (
                        <>
                            <Input
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <Input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button className="w-full" onClick={handleReset} disabled={submitting}>
                                {submitting ? "Updating..." : "Set new password"}
                            </Button>
                        </>
                    )}
                </CardContent>
                <CardFooter>
                    <Link href="/login" className="text-sm text-primary hover:underline">
                        Back to login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
