import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, Calendar, Star, BarChart3, Settings } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">管理后台</h1>
        <p className="text-gray-500 mt-1">欢迎使用通班网站管理系统</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">用户总数</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-gray-500 mt-1">较上周 +12</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">新闻总数</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-gray-500 mt-1">较上周 +3</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">活动总数</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-gray-500 mt-1">较上周 +2</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">待审核评测</CardTitle>
            <Star className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-gray-500 mt-1">需要处理</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">快捷操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/users">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">用户管理</span>
              </Button>
            </Link>
            <Link href="/admin/news">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <FileText className="h-5 w-5" />
                <span className="text-sm">新闻管理</span>
              </Button>
            </Link>
            <Link href="/admin/events">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">活动管理</span>
              </Button>
            </Link>
            <Link href="/admin/reviews">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Star className="h-5 w-5" />
                <span className="text-sm">评测审核</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">最近活动</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "用户注册", user: "张三", time: "2分钟前" },
              { action: "发布新闻", user: "李四", time: "1小时前" },
              { action: "提交课程评测", user: "匿名用户", time: "3小时前" },
              { action: "创建活动", user: "王五", time: "昨天" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{item.action}</span>
                  <span className="text-sm text-gray-500">by {item.user}</span>
                </div>
                <span className="text-xs text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
