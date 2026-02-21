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
import { MoreHorizontal, Plus, Search, Filter, Trash2, Edit, Eye, MapPin, Clock } from "lucide-react"

// Mock data
const mockEvents = [
  {
    id: "1",
    title: "2024级新生见面会",
    date: "2024-09-20",
    time: "14:00 - 16:00",
    location: "北京大学逸夫楼",
    type: "学术",
    status: "published",
    attendees: 45,
  },
  {
    id: "2",
    title: "秋季学术沙龙",
    date: "2024-10-05",
    time: "19:00 - 21:00",
    location: "清华大学FIT楼",
    type: "学术",
    status: "published",
    attendees: 30,
  },
  {
    id: "3",
    title: "通班运动会",
    date: "2024-10-15",
    time: "09:00 - 17:00",
    location: "北京大学体育场",
    type: "活动",
    status: "draft",
    attendees: 0,
  },
  {
    id: "4",
    title: "企业参访 - 百度",
    date: "2024-11-01",
    time: "13:00 - 18:00",
    location: "百度科技园",
    type: "实践",
    status: "published",
    attendees: 25,
  },
  {
    id: "5",
    title: "年终总结大会",
    date: "2024-12-20",
    time: "14:00 - 17:00",
    location: "待定",
    type: "会议",
    status: "draft",
    attendees: 0,
  },
]

const typeLabels: Record<string, string> = {
  "学术": "学术",
  "活动": "活动",
  "实践": "实践",
  "会议": "会议",
}

const typeColors: Record<string, string> = {
  "学术": "bg-blue-100 text-blue-800",
  "活动": "bg-purple-100 text-purple-800",
  "实践": "bg-green-100 text-green-800",
  "会议": "bg-gray-100 text-gray-800",
}

const statusLabels: Record<string, string> = {
  published: "已发布",
  draft: "草稿",
}

const statusColors: Record<string, string> = {
  published: "bg-green-100 text-green-800",
  draft: "bg-yellow-100 text-yellow-800",
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string | null>(null)

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = !typeFilter || event.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">活动管理</h1>
          <p className="text-gray-500 mt-1">管理网站活动内容</p>
        </div>
        <Button className="bg-blue-900 hover:bg-blue-800">
          <Plus className="h-4 w-4 mr-2" />
          创建活动
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索活动标题..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  {typeFilter ? typeLabels[typeFilter] : "全部类型"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTypeFilter(null)}>
                  全部类型
                </DropdownMenuItem>
                {Object.entries(typeLabels).map(([key, label]) => (
                  <DropdownMenuItem key={key} onClick={() => setTypeFilter(key)}>
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>活动名称</TableHead>
                <TableHead>日期</TableHead>
                <TableHead>时间</TableHead>
                <TableHead>地点</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>报名人数</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell className="text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    <div className="flex items-center gap-1 max-w-[150px] truncate">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      {event.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={typeColors[event.type]}>
                      {typeLabels[event.type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[event.status]}>
                      {statusLabels[event.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">{event.attendees}</TableCell>
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
          共 {filteredEvents.length} 条记录
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
