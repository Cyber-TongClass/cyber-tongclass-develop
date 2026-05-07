import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>公开注册已停用</CardTitle>
          <CardDescription>
            通班网站现已改为由管理员统一创建账户，不再开放邮箱自助注册。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            如需开通账号，请联系管理员。已有账号的同学可直接使用学号和密码登录，并在登录后前往个人设置修改密码。
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/login">前往登录</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">返回首页</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
