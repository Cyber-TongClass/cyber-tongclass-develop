import Link from "next/link"
import { BookOpen, ExternalLink, FileText, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const publicResources = [
  {
    id: "survival-guide",
    title: "Survival Guide",
    description: "Public onboarding notes, study references, and administrative pointers for Tong Class students.",
    icon: FileText,
    href: "/resources#survival-guide",
  },
  {
    id: "public-links",
    title: "Public Links",
    description: "Open websites, documentation, and community links that can be shared outside the member-only area.",
    icon: LinkIcon,
    href: "/resources#public-links",
  },
  {
    id: "course-reviews",
    title: "Course Reviews",
    description: "Course review browsing and writing live in the member course area.",
    icon: BookOpen,
    href: "/courses",
  },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary/5 border-b border-border">
        <div className="container-custom py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <ExternalLink className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Resources</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Public guides and links for Tong Class members, alumni, and collaborators.
          </p>
        </div>
      </section>

      <section className="container-custom py-8">
        <div className="grid gap-4 md:grid-cols-3">
          {publicResources.map((resource) => {
            const Icon = resource.icon
            return (
              <Card key={resource.id} id={resource.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="h-5 w-5 text-primary" />
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                  <Button asChild variant="outline" size="sm">
                    <Link href={resource.href}>Open</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
