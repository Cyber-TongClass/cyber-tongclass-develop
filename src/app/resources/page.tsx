import Link from "next/link"
import { BookOpen, ExternalLink, FileText, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const publicResources = [
  {
    id: "survival-guide",
    title: "通班生存指南",
    description: "写给北大通班学生的人工智能专业学习指南，涵盖入学指南、课程选择、编程入门、资源推荐、科研入门建议等内容，由历届通班学生参与编写维护。",
    icon: FileText,
    href: "/resources#survival-guide",
  },
  {
    id: "public-links",
    title: "自学资源链接",
    description: "人工智能学习资源汇总，包括课程、书籍、文章、工具等链接，由通班学术部维护更新。",
    icon: LinkIcon,
    href: "/resources#public-links",
  },
  {
    id: "course-reviews",
    title: "课程测评",
    description: "通班课程测评系统，仅对通班内部成员开放，汇集了历年来同学们的课程评价与反馈。",
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">学习资源</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            面向全体公众的资源汇总，包括一代代通班学子参与编写的学习指南、自学资源链接等。
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
