"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus, Search, Filter, Trash2, Edit, Eye, Send, XCircle } from "lucide-react"

// Mock data
const mockNews = [
  {
    id: "1",
    title: "通班2024级新生见面会圆满举行",
    category: "学术",
    author: "李明",
    status: "published",
    createdAt: "2024-09-15",
    views: 234,
  },
  {
    id: "2",
    title: "恭喜通班同学在ICML发表论文",
    category: "成果",
    author: "王芳",
    status: "published",
    createdAt: "2024-09-10",
    views: 456,
  },
  {
    id: "3",
    title: "关于举办秋季学术沙龙的通知",
    category: "活动",
    author: "张伟",
    status: "draft",
    createdAt: "2024-09-08",
    views: 0,
  },
  {
    id: "4",
    title: "通班与清华通班联合开展暑期实践",
    category: "活动",
    author: "刘强",
    status: "published",
    createdAt: "2024-08-20",
    views: 189,
  },
  {
    id: "5",
    title: "2024年通班招生简章",
    category: "招生",
    author: "陈静",
    status: "published",
    createdAt: "2024-06-01",
    views: 1023,
  },
]

const categoryLabels: Record<string, string> = {
  "学术": "学术",
  "成果": "成果",
  "活动": "活动",
  "招生": "招生",
  "公告": "公告",
}

const categoryColors: Record<string, string> = {
  "学术": "bg-blue-100 text-blue-800",
  "成果": "bg-green-100 text-green-800",
  "活动": "bg-purple-100 text-purple-800",
  "招生": "bg-yellow-100 text-yellow-800",
  "公告": "bg-gray-100 text-gray-800",
}

const statusLabels: Record<string, string> = {
  published: "已发布",
  draft: "草稿",
  archived: "已归档",
}

const statusColors: Record<string, string> = {
  published: "bg-green-100 text-green-800",
  draft: "bg-yellow-100 text-yellow-800",
  archived: "bg-gray-100 text-gray-800",
}

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filteredNews = mockNews.filter((news) => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !categoryFilter || news.category === categoryFilter
    const matchesStatus = !statusFilter || news.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">新闻管理</h1>
          <p className="text-gray-500 mt-1">管理网站新闻内容</p>
        </div>
        <Button className="bg-blue-900 hover:bg-blue-800">
          <Plus className="h-4 w-4 mr-2" />
          创建新闻
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索新闻标题..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  {categoryFilter ? categoryLabels[categoryFilter] : "全部分类"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
                  全部分类
                </DropdownMenuItem>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <DropdownMenuItem key={key} onClick={() => setCategoryFilter(key)}>
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  {statusFilter ? statusLabels[statusFilter] : "全部状态"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                  全部状态
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("published")}>
                  已发布
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                  草稿
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("archived")}>
                  已归档
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* News Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>标题</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>作者</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>浏览量</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNews.map((news) => (
                <TableRow key={news.id}>
                  <TableCell className="font-medium max-w-md truncate">
                    {news.title}
                  </TableCell>
                  <TableCell>
                    <Badge className={categoryColors[news.category]}>
                      {categoryLabels[news.category]}
                    </Badge>
                  </TableCell>
                  <TableCell>{news.author}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[news.status]}>
                      {statusLabels[news.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">{news.views}</TableCell>
                  <TableCell className="text-gray-500">{news.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          查看
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          编辑
                        </DropdownMenuItem>
                        {news.status === "draft" && (
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            发布
                          </DropdownMenuItem>
                        )}
                        {news.status === "published" && (
                          <DropdownMenuItem>
                            <XCircle className="h-4 w-4 mr-2" />
                            撤回
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          共 {filteredNews.length} 条记录
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            上一页
          </Button>
          <Button variant="outline" size="sm" disabled>
            下一页
          </Button>
        </div>
      </div>
    </div>
  )
}
