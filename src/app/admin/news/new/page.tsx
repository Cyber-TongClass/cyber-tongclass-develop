"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useCreateNews } from "@/lib/api"
import { MarkdownSplitEditor } from "@/components/markdown/markdown-split-editor"
import { formatNewsDateInputValue, NEWS_CATEGORY_OPTIONS, parseNewsDateInputValue, type NewsCategory } from "@/lib/news"

const statusOptions = [
  { value: "draft", label: "草稿" },
  { value: "published", label: "已发布" },
]

type NewsFormState = {
  title: string
  category: NewsCategory
  status: "draft" | "published"
  publishedDate: string
  sourceUrl: string
  coverImageUrl: string
  showOnHomepage: boolean
  homepageSubtitle: string
  content: string
}

export default function NewNewsPage() {
  const router = useRouter()
  const { currentUser } = useAuth()
  const createNews = useCreateNews()

  const [formData, setFormData] = useState<NewsFormState>({
    title: "",
    category: NEWS_CATEGORY_OPTIONS[0],
    status: "draft",
    publishedDate: formatNewsDateInputValue(Date.now()),
    sourceUrl: "",
    coverImageUrl: "",
    showOnHomepage: false,
    homepageSubtitle: "",
    content: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (formData.showOnHomepage && !formData.coverImageUrl.trim()) {
        window.alert("勾选首页轮播时，请同时填写封面图链接。")
        return
      }

      await createNews({
        title: formData.title,
        category: formData.category,
        content: formData.content,
        sourceUrl: formData.sourceUrl || undefined,
        coverImageUrl: formData.coverImageUrl || undefined,
        showOnHomepage: formData.showOnHomepage,
        homepageSubtitle: formData.homepageSubtitle || undefined,
        authorId: currentUser?._id as any,
        isPublished: formData.status === "published",
        publishedAt: parseNewsDateInputValue(formData.publishedDate),
      })

      router.push("/admin/news")
    } catch (error) {
      console.error("Failed to create news:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">创建新闻</h1>
          <p className="text-gray-500 mt-1">填写并创建新闻内容</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>新闻信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">新闻标题</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">分类</Label>
                <select
                  id="category"
                  className="w-full h-10 px-3 rounded-md border border-input bg-white focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as NewsCategory })}
                >
                  {NEWS_CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">状态</Label>
                <select
                  id="status"
                  className="w-full h-10 px-3 rounded-md border border-input bg-white focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" })}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="publishedDate">展示日期</Label>
                <Input
                  id="publishedDate"
                  type="date"
                  value={formData.publishedDate}
                  onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="sourceUrl">Original Source URL</Label>
                <Input
                  id="sourceUrl"
                  type="url"
                  placeholder="https://mp.weixin.qq.com/s/..."
                  value={formData.sourceUrl}
                  onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="coverImageUrl">封面图链接</Label>
                <Input
                  id="coverImageUrl"
                  type="url"
                  placeholder="https://example.com/news-cover.jpg"
                  value={formData.coverImageUrl}
                  onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">请填写可公开访问的图片直链。新闻列表页会按固定比例裁切显示。</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="homepageSubtitle">首页轮播副标题（选填）</Label>
                <Input
                  id="homepageSubtitle"
                  value={formData.homepageSubtitle}
                  onChange={(e) => setFormData({ ...formData, homepageSubtitle: e.target.value })}
                  placeholder="用于首页轮播主标题下方的小字说明"
                />
              </div>
              <div className="md:col-span-2 flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                <input
                  id="showOnHomepage"
                  type="checkbox"
                  checked={formData.showOnHomepage}
                  onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <div className="space-y-1">
                  <Label htmlFor="showOnHomepage" className="cursor-pointer">
                    在首页轮播展示
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    勾选后，这条已发布新闻会出现在首页顶部轮播中，标签使用分类，背景图使用封面图链接。
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">新闻内容（Markdown）</Label>
              <MarkdownSplitEditor
                id="content"
                value={formData.content}
                onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
                placeholder="输入新闻内容，支持 Markdown 语法。"
                minHeightClassName="min-h-[280px]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            取消
          </Button>
          <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
            <Save className="h-4 w-4 mr-2" />
            创建
          </Button>
        </div>
      </form>
    </div>
  )
}
