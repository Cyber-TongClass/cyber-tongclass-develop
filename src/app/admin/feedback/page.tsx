"use client"

import { useMemo, useState } from "react"
import { Download, Search, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useAdminFeedbackEntries, useDeleteFeedbackEntry, useMonthlyFeedbackExport } from "@/lib/api"
import { formatIntranetExportCohort, formatOrganizationLabel, formatYearMonthLabel } from "@/lib/intranet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useConfirmDialog } from "@/components/ui/confirm-dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleString("zh-CN")
}

function escapeCsvValue(value: string) {
  return `"${String(value).replace(/"/g, '""')}"`
}

function currentMonthValue() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export default function AdminFeedbackPage() {
  const { currentUser } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [exportMonth, setExportMonth] = useState(currentMonthValue())
  const entries = useAdminFeedbackEntries({
    actorId: currentUser?._id ? String(currentUser._id) : null,
    search: searchQuery.trim() || undefined,
  }) || []
  const exportRows = useMonthlyFeedbackExport(exportMonth, currentUser?._id ? String(currentUser._id) : null) || []
  const deleteEntry = useDeleteFeedbackEntry()
  const { confirm, ConfirmDialog } = useConfirmDialog()

  const exportFilename = useMemo(() => `feedback-${exportMonth}.csv`, [exportMonth])

  const handleDelete = async (entryId: string, title: string) => {
    if (!currentUser) return
    await confirm({
      title: "删除反馈",
      description: `确定删除“${title}”这条反馈吗？`,
      confirmLabel: "确定删除",
      variant: "danger",
      onConfirm: async () => {
        await deleteEntry({ id: entryId as any, actorId: currentUser._id as any } as any)
      },
    })
  }

  const handleExport = () => {
    if (exportRows.length === 0) return

    const lines = [
      ["提交日期时间", "标题", "内容", "是否匿名", "前台显示名", "组织", "年级"].map(escapeCsvValue).join(","),
      ...exportRows.map((row: any) =>
        [
          formatTime(row.createdAt),
          row.title,
          row.content,
          row.isAnonymous ? "是" : "否",
          row.displayName,
          formatOrganizationLabel(row.organization || ""),
          formatIntranetExportCohort(row.cohort ?? ""),
        ]
          .map(escapeCsvValue)
          .join(",")
      ),
    ]

    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = exportFilename
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">意见反馈管理</h1>
        <p className="mt-1 text-gray-500">查看成员反馈、按月导出 CSV，并处理需要删除的内容。</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>导出反馈</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <label htmlFor="feedback-export-month" className="text-sm font-medium text-slate-700">
              导出月份
            </label>
            <Input
              id="feedback-export-month"
              type="month"
              value={exportMonth}
              onChange={(e) => setExportMonth(e.target.value)}
              className="w-full md:w-56"
            />
            <p className="text-xs text-slate-500">当前导出为 {formatYearMonthLabel(exportMonth)}，匿名反馈将在导出中保持匿名。</p>
          </div>
          <Button onClick={handleExport} className="gap-2" disabled={exportRows.length === 0}>
            <Download className="h-4 w-4" />
            下载 CSV
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索标题、内容或真实发布者"
              className="pr-10"
            />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>反馈列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>标题</TableHead>
                <TableHead>真实发布者</TableHead>
                <TableHead>前台显示</TableHead>
                <TableHead>组织 / 年级</TableHead>
                <TableHead>时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    暂无反馈
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry: any) => (
                  <TableRow key={entry._id}>
                    <TableCell className="max-w-[360px]">
                      <div className="space-y-1">
                        <p className="font-medium">{entry.title}</p>
                        <p className="line-clamp-2 text-sm text-slate-500">{entry.content}</p>
                      </div>
                    </TableCell>
                    <TableCell>{entry.realAuthorName}</TableCell>
                    <TableCell>{entry.publicAuthorName}</TableCell>
                    <TableCell>
                      {formatOrganizationLabel(entry.authorOrganization || "")}
                      {entry.authorCohort ? ` / ${formatIntranetExportCohort(entry.authorCohort)}` : ""}
                    </TableCell>
                    <TableCell>{formatTime(entry.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(entry._id, entry.title)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        删除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ConfirmDialog />
    </div>
  )
}
