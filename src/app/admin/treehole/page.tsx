"use client"

import { useState } from "react"
import { MessageSquare, Search, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useAdminTreeholePostById, useAdminTreeholePosts, useDeleteTreeholePost, useDeleteTreeholeReply } from "@/lib/api"
import { formatOrganizationLabel } from "@/lib/intranet"
import { getCohortLabel } from "@/lib/cohort"
import { CollapsibleText } from "@/components/intranet/collapsible-text"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useConfirmDialog } from "@/components/ui/confirm-dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleString("zh-CN")
}

export default function AdminTreeholePage() {
  const { currentUser } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const posts = useAdminTreeholePosts({
    actorId: currentUser?._id ? String(currentUser._id) : null,
    search: searchQuery.trim() || undefined,
  }) || []
  const detail = useAdminTreeholePostById(selectedPostId, currentUser?._id ? String(currentUser._id) : null)
  const deletePost = useDeleteTreeholePost()
  const deleteReply = useDeleteTreeholeReply()
  const { confirm, ConfirmDialog } = useConfirmDialog()

  const handleDeletePost = async (postId: string, title: string) => {
    if (!currentUser) return
    await confirm({
      title: "删除树洞主贴",
      description: `确定删除“${title}”吗？该帖子下所有回帖都会一起删除。`,
      confirmLabel: "确定删除",
      variant: "danger",
      onConfirm: async () => {
        await deletePost({ id: postId as any, actorId: currentUser._id as any } as any)
        if (selectedPostId === postId) {
          setSelectedPostId(null)
        }
      },
    })
  }

  const handleDeleteReply = async (replyId: string) => {
    if (!currentUser) return
    await confirm({
      title: "删除树洞回帖",
      description: "确定删除这条回帖吗？",
      confirmLabel: "确定删除",
      variant: "danger",
      onConfirm: async () => {
        await deleteReply({ id: replyId as any, actorId: currentUser._id as any } as any)
      },
    })
  }

  const selectedDetail = detail as any

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">树洞管理</h1>
        <p className="mt-1 text-gray-500">查看树洞主贴与回帖，匿名内容在后台保留真实身份，便于治理。</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索标题、内容、前台显示名或真实姓名"
              className="pr-10"
            />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>主贴列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>标题</TableHead>
                <TableHead>真实发布者</TableHead>
                <TableHead>前台显示</TableHead>
                <TableHead>回帖数</TableHead>
                <TableHead>发布时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    暂无树洞内容
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post: any) => (
                  <TableRow key={post._id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.realAuthorName}</TableCell>
                    <TableCell>{post.publicAuthorName}</TableCell>
                    <TableCell>{post.replyCount}</TableCell>
                    <TableCell>{formatTime(post.createdAt)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedPostId(post._id)}>
                        查看
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeletePost(post._id, post.title)}>
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

      {selectedPostId && selectedDetail ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              帖子详情
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3 rounded-lg border bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold">{selectedDetail.post.title}</h2>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                    <span>真实发布者：{selectedDetail.post.realAuthorName}</span>
                    <span>前台显示：{selectedDetail.post.publicAuthorName}</span>
                    <span>组织：{formatOrganizationLabel(selectedDetail.post.authorOrganization || "")}</span>
                    <span>年级：{selectedDetail.post.authorCohort ? getCohortLabel(selectedDetail.post.authorCohort) : ""}</span>
                    <span>{formatTime(selectedDetail.post.createdAt)}</span>
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDeletePost(selectedDetail.post._id, selectedDetail.post.title)}>
                  删除主贴
                </Button>
              </div>
              <CollapsibleText text={selectedDetail.post.content} collapsedLength={420} />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-extrabold">全部回帖</h3>
              {selectedDetail.replies.length === 0 ? (
                <p className="text-sm text-slate-500">暂无回帖。</p>
              ) : (
                selectedDetail.replies.map((reply: any) => (
                  <div key={reply._id} className="rounded-lg border bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                          <span>真实发布者：{reply.realAuthorName}</span>
                          <span>前台显示：{reply.publicAuthorName}</span>
                          <span>组织：{formatOrganizationLabel(reply.authorOrganization || "")}</span>
                          <span>年级：{reply.authorCohort ? getCohortLabel(reply.authorCohort) : ""}</span>
                          <span>{formatTime(reply.createdAt)}</span>
                        </div>
                        <CollapsibleText text={reply.content} collapsedLength={260} />
                      </div>
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-600" onClick={() => handleDeleteReply(reply._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}
      <ConfirmDialog />
    </div>
  )
}
