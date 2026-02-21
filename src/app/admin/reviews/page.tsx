"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MoreHorizontal, Plus, Search, Filter, Trash2, Edit, Eye, Check, X, Upload } from "lucide-react"

// Mock data
const mockReviews = [
  {
    id: "1",
    courseName: "人工智能导论",
    semester: "2024 Spring",
    rating: 9,
    content: "课程内容非常丰富，老师讲解深入浅出，推荐！",
    author: "匿名用户",
    status: "pending",
    createdAt: "2024-09-15",
  },
  {
    id: "2",
    courseName: "机器学习",
    semester: "2024 Spring",
    rating: 7,
    content: "作业量适中，考核方式合理。",
    author: "匿名用户",
    status: "pending",
    createdAt: "2024-09-14",
  },
  {
    id: "3",
    courseName: "计算机视觉",
    semester: "2023 Fall",
    rating: 8,
    content: "老师很负责任，实验很有挑战性。",
    author: "匿名用户",
    status: "approved",
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    courseName: "深度学习",
    semester: "2024 Spring",
    rating: 10,
    content: "非常推荐的课程！",
    author: "匿名用户",
    status: "approved",
    createdAt: "2024-09-10",
  },
  {
    id: "5",
    courseName: "自然语言处理",
    semester: "2023 Fall",
    rating: 6,
    content: "课程难度较大，建议有一定基础再选。",
    author: "匿名用户",
    status: "rejected",
    createdAt: "2024-01-05",
  },
]

const statusLabels: Record<string, string> = {
  pending: "待审核",
  approved: "已通过",
  rejected: "已拒绝",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
}

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>("pending")
  const [selectedReview, setSelectedReview] = useState<typeof mockReviews[0] | null>(null)

  const filteredReviews = mockReviews.filter((review) => {
    const matchesSearch = 
      review.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || review.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">评测审核</h1>
          <p className="text-gray-500 mt-1">管理课程评测内容</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                导入数据
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>导入课程评测数据</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">点击或拖拽文件到此处上传</p>
                  <p className="text-xs text-gray-400 mt-1">支持 CSV, Excel 格式</p>
                </div>
                <Button className="w-full">选择文件</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button className="bg-blue-900 hover:bg-blue-800">
            <Plus className="h-4 w-4 mr-2" />
            手动添加
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">待审核</p>
                <p className="text-2xl font-bold text-yellow-600">2</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">需处理</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">已通过</p>
                <p className="text-2xl font-bold text-green-600">156</p>
              </div>
              <Badge className="bg-green-100 text-green-800">总计</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">课程总数</p>
                <p className="text-2xl font-bold text-blue-600">28</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">课程</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索课程名称或内容..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
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
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                  待审核
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("approved")}>
                  已通过
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
                  已拒绝
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>课程名称</TableHead>
                <TableHead>学期</TableHead>
                <TableHead>评分</TableHead>
                <TableHead>评价内容</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>提交时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.courseName}</TableCell>
                  <TableCell className="text-gray-500">{review.semester}</TableCell>
                  <TableCell>
                    <Badge className={review.rating >= 8 ? "bg-green-100 text-green-800" : review.rating >= 6 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                      {review.rating}/10
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-gray-500">
                    {review.content}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[review.status]}>
                      {statusLabels[review.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">{review.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedReview(review)}>
                          <Eye className="h-4 w-4 mr-2" />
                          查看详情
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          编辑
                        </DropdownMenuItem>
                        {review.status === "pending" && (
                          <>
                            <DropdownMenuItem className="text-green-600">
                              <Check className="h-4 w-4 mr-2" />
                              通过
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <X className="h-4 w-4 mr-2" />
                              拒绝
                            </DropdownMenuItem>
                          </>
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

      {/* Review Detail Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>评测详情</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">课程名称</p>
                  <p className="font-medium">{selectedReview.courseName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">学期</p>
                  <p className="font-medium">{selectedReview.semester}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">评分</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${selectedReview.rating * 10}%` }}
                    />
                  </div>
                  <span className="font-medium">{selectedReview.rating}/10</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">评价内容</p>
                <p className="mt-1">{selectedReview.content}</p>
              </div>
              <div className="flex gap-2 pt-4">
                {selectedReview.status === "pending" && (
                  <>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      <Check className="h-4 w-4 mr-2" />
                      通过
                    </Button>
                    <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                      <X className="h-4 w-4 mr-2" />
                      拒绝
                    </Button>
                  </>
                )}
                {selectedReview.status !== "pending" && (
                  <Button variant="outline" className="w-full">
                    关闭
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          共 {filteredReviews.length} 条记录
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
