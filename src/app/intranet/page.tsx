"use client"

import Link from "next/link"
import { Lock, MessageSquare, Shield, Link as LinkIcon } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const intranetSections = [
  {
    title: "Anonymous Board",
    description: "Member-only anonymous discussions. Moderation and abuse controls should be finished before launch.",
    icon: MessageSquare,
  },
  {
    title: "Internal Notes",
    description: "Private notes and references that are useful to members but should not be indexed publicly.",
    icon: Shield,
  },
  {
    title: "Private Links",
    description: "Access-controlled links for shared tools, documents, and workflows.",
    icon: LinkIcon,
  },
]

export default function IntranetPage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Member-only Intranet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">Please sign in with your student ID to access internal resources.</p>
            <Button asChild className="w-full">
              <Link href={`/login?next=${encodeURIComponent("/intranet")}`}>Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-primary relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative">
          <div className="absolute left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 text-[5rem] md:text-[8rem] lg:text-[10rem] font-extrabold uppercase tracking-[0.15em] text-white/5 select-none pointer-events-none whitespace-nowrap leading-none" aria-hidden="true">INTRANET</div>
          <div className="mb-4">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">内部网站</h1>
          </div>
          <p className="text-lg text-white/70 max-w-2xl relative">
            这是一个近面向通班成员的内部网站，包含讨论区、内部资源和私密链接等。请不要将此网页内的内部资源分享到公开渠道哦～
          </p>
        </div>
      </section>

      <section className="bg-[hsl(211,30%,97%)] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {intranetSections.map((section) => {
            const Icon = section.icon
            return (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="h-5 w-5 text-primary" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">{section.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
        </div>
      </section>
    </div>
  )
}
