"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateUser } from "@/lib/api"

const roleOptions = [
  { value: "member", label: "成员" },
  { value: "admin", label: "管理员" },
  { value: "super_admin", label: "超级管理员" },
] as const

const organizationOptions = [
  { value: "pku", label: "北大通班" },
  { value: "thu", label: "清华通班" },
] as const

export default function AdminUserCreatePage() {
  const router = useRouter()
  const createUser = useCreateUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [password, setPassword] = useState("")
  const [englishName, setEnglishName] = useState("")
  const [chineseName, setChineseName] = useState("")
  const [username, setUsername] = useState("")
  const [organization, setOrganization] = useState<"pku" | "thu">("pku")
  const [cohort, setCohort] = useState(new Date().getFullYear())
  const [studentId, setStudentId] = useState("")
  const [role, setRole] = useState<"member" | "admin" | "super_admin">("member")
  const [emailDomain, setEmailDomain] = useState("stu.pku.edu.cn")

  const derivedEmail = studentId ? `${studentId}@${emailDomain}` : ""

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (!derivedEmail || !password || !englishName || !chineseName || !username || !studentId) {
      setError("请填写完整的基础信息（含中文名）。")
      return
    }

    setIsSubmitting(true)
    try {
      await createUser({
        email: derivedEmail,
        password,
        englishName,
        chineseName,
        username,
        organization,
        cohort,
        studentId,
        role,
      } as any)

      setSuccess("用户已创建")
      setTimeout(() => router.push("/admin/users"), 600)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">新建用户</h1>
        <p className="text-gray-500 mt-1">填写基础信息和初始密码，选填资料无需在此填写。</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基础信息</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>学号</Label>
                <Input value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>邮箱用户名</Label>
                <div className="flex items-center gap-2">
                  <Input value={studentId} readOnly placeholder="自动使用学号" />
                  <span className="text-sm text-muted-foreground">@</span>
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3"
                    value={emailDomain}
                    onChange={(e) => setEmailDomain(e.target.value)}
                  >
                    <option value="stu.pku.edu.cn">stu.pku.edu.cn</option>
                    <option value="pku.edu.cn">pku.edu.cn</option>
                    <option value="alumni.pku.edu.cn">alumni.pku.edu.cn</option>
                  </select>
                </div>
                <p className="text-xs text-muted-foreground">邮箱会自动生成（不需输入 @ 域名）。</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>英文名</Label>
                <Input value={englishName} onChange={(e) => setEnglishName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>中文名</Label>
                <Input value={chineseName} onChange={(e) => setChineseName(e.target.value)} required />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>用户名</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>初始密码</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="至少 8 位" required />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>组织</Label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value as "pku" | "thu")}
                >
                  {organizationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>年级</Label>
                <Input type="number" value={String(cohort)} onChange={(e) => setCohort(Number(e.target.value))} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>角色</Label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3"
                value={role}
                onChange={(e) => setRole(e.target.value as "member" | "admin" | "super_admin")}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/users")}>返回</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "保存中..." : "创建用户"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
