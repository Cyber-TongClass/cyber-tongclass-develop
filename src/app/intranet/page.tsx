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
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Member-only Intranet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Please sign in with your student ID to access internal resources.</p>
            <Button asChild className="w-full">
              <Link href={`/login?next=${encodeURIComponent("/intranet")}`}>Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary/5 border-b border-border">
        <div className="container-custom py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Intranet</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Private member-only resources that should stay separate from public course reviews.
          </p>
        </div>
      </section>

      <section className="container-custom py-8">
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
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
