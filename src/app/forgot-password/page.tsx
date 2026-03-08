"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TurnstileWidget } from "@/components/auth/turnstile-widget"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [requiresTurnstile, setRequiresTurnstile] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState("")

  const handleSubmit = async () => {
    if (!email.trim()) return

    setSubmitting(true)
    setMessage("")

    try {
      const response = await fetch("/api/request-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          purpose: "password_reset",
          turnstileToken: turnstileToken || undefined,
        }),
      })

      const data = await response.json()
      if (data?.requiresTurnstile) {
        setRequiresTurnstile(true)
        setMessage("Please complete Turnstile verification, then send again.")
        return
      }

      if (!response.ok || !data?.ok) {
        setMessage(data?.message || "Failed to send reset email.")
        return
      }

      setSubmitted(true)
    } catch {
      setMessage("Failed to send reset email.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>重置密码</CardTitle>
          <CardDescription>输入你的注册邮箱，我们会发送重置说明。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {submitted ? (
            <p className="text-sm text-green-700 bg-green-50 rounded-md p-3">
              如果该邮箱已注册，重置邮件将会发送到 {email}。
            </p>
          ) : (
            <>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="学号邮箱"
              />
              {requiresTurnstile && (
                <div className="rounded-md border p-3 bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-2">请先完成人机验证</p>
                  <TurnstileWidget onVerify={setTurnstileToken} />
                </div>
              )}
              {message && (
                <p className="text-sm text-red-600 bg-red-50 rounded-md p-3">{message}</p>
              )}
              <Button className="w-full" onClick={handleSubmit} disabled={!email || submitting || (requiresTurnstile && !turnstileToken)}>
                {submitting ? "发送中..." : "发送重置邮件"}
              </Button>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Link href="/login" className="text-sm text-primary hover:underline">
            返回登录
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
