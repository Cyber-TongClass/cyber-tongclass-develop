"use client"

import * as React from "react"
import Link from "next/link"
import { BookOpen, Search, Star, MessageSquare, Plus, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/hooks/use-auth"
import { useCourses, useCreateCourse } from "@/lib/api"
import type { Course } from "@/types"

export default function CourseDirectoryPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortBy, setSortBy] = React.useState("rating")

  // Fetch courses from Convex
  const coursesData = useCourses()
  const courses: Course[] = coursesData || []

  const [createOpen, setCreateOpen] = React.useState(false)
  const [createError, setCreateError] = React.useState("")
  const [courseName, setCourseName] = React.useState("")

  const createCourse = useCreateCourse()

  const resetForm = () => {
    setCourseName("")
    setCreateError("")
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError("")

    if (!isAuthenticated) {
      setCreateError("Please sign in before creating a course.")
      return
    }

    try {
      await createCourse({
        name: courseName,
      })
      setCreateOpen(false)
      resetForm()
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "创建课程失败")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  const filteredCourses = courses
    .filter((course) => course.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "rating") {
        if (b.averageRating !== a.averageRating) return b.averageRating - a.averageRating
        return a.createdAt - b.createdAt
      }
      if (sortBy === "reviews") {
        if (b.reviewCount !== a.reviewCount) return b.reviewCount - a.reviewCount
        return a.createdAt - b.createdAt
      }
      return a.name.localeCompare(b.name, "zh-CN")
    })

  const tongClassCourses = filteredCourses.filter((course) => course.isTongClassCourse)
  const otherCourses = filteredCourses.filter((course) => !course.isTongClassCourse)

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary/5 border-b border-border">
        <div className="container-custom py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">课程测评</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">通班内部的课程测评系统，汇集了历年来同学们的课程评价与反馈。欢迎同学们积极分享自己的课程体验，提交测评或按要求创建课程，但请不要将此网页内的内部资源分享到公开渠道哦～</p>
        </div>
      </section>

      <section className="border-b border-border bg-white sticky top-16 z-40">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索课程名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">按评分</SelectItem>
                <SelectItem value="reviews">按评测数量</SelectItem>
                <SelectItem value="name">按名称</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              {isAuthenticated ? (
                <DialogTrigger asChild>
                  <Button className="md:ml-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    添加课程
                  </Button>
                </DialogTrigger>
              ) : (
                <Button asChild className="md:ml-auto">
                  <Link href={`/login?next=${encodeURIComponent("/courses")}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    添加课程
                  </Link>
                </Button>
              )}
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加课程</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleCreateCourse}>
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    同学们可以且仅可补充通班培养方案以外的课程。请务必认真、如实填写，仅添加北京大学真实开设的课程；如存在不准确、不恰当或不符合要求的内容，管理员保留修改或删除的权利。
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course-name">课程名称</Label>
                    <Input id="course-name" value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
                  </div>
                  <p className="text-sm text-muted-foreground">课程创建后，任意成员可在课程详情页补充不同教师、不同学期的具体评测。</p>
                  {createError && <p className="text-sm text-red-600">{createError}</p>}
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => { setCreateOpen(false); resetForm() }}>
                      取消
                    </Button>
                    <Button type="submit">创建</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <section className="container-custom py-8">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">未找到相关课程</h3>
            <p className="text-muted-foreground">可点击“添加课程”创建后再发布评测</p>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">通班培养方案课程</h2>
                  <p className="text-sm text-muted-foreground mt-1">通班核心课程仅由管理员维护，包含专业基础课、专业核心课、专业选修课、公共必修课等。</p>
                </div>
                <span className="text-sm text-muted-foreground">{tongClassCourses.length} 门</span>
              </div>

              {tongClassCourses.length === 0 ? (
                <Card className="border-dashed border-border/70 bg-muted/20">
                  <CardContent className="py-8 text-sm text-muted-foreground">
                    当前没有匹配的通班培养方案课程。
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {tongClassCourses.map((course) => (
                    <CourseListCard key={course._id} course={course} />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">其他课程</h2>
                  <p className="text-sm text-muted-foreground mt-1">用户可自行补充和讨论的其他课程。</p>
                </div>
                <span className="text-sm text-muted-foreground">{otherCourses.length} 门</span>
              </div>

              {otherCourses.length === 0 ? (
                <Card className="border-dashed border-border/70 bg-muted/20">
                  <CardContent className="py-8 text-sm text-muted-foreground">
                    当前没有匹配的其他课程。
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {otherCourses.map((course) => (
                    <CourseListCard key={course._id} course={course} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function CourseListCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${encodeURIComponent(course.name)}`} className="block h-full">
      <Card className="group h-full border-border/50 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg cursor-pointer">
        <CardContent className="flex min-h-[188px] flex-col p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-lg font-semibold leading-7 text-foreground transition-colors group-hover:text-primary">
              {course.name}
            </h3>
            <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>

          <div className="mt-auto space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="font-medium text-foreground">{course.averageRating.toFixed(1)}</span>
              <span>综合评分</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span className="font-medium text-foreground">{course.reviewCount}</span>
              <span>条评测</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
