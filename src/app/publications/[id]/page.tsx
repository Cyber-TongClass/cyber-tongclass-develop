"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ExternalLink, User, Calendar, BookOpen, FileText, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePublicationById } from "@/lib/api"
import type { Publication } from "@/types"

function AuthorsList({ authors }: { authors: string[] }) {
  return (
    <span>
      {authors.map((author, index) => (
        <span key={index}>
          <Link href="/members" className="text-slate-900 hover:text-primary">
            {author}
          </Link>
          {index < authors.length - 1 && ", "}
        </span>
      ))}
    </span>
  )
}

export default function PublicationDetailPage() {
  const params = useParams<{ id: string }>()
  const publicationId = params.id

  const publication = usePublicationById(publicationId)
  const isLoading = publication === undefined
  const [showCopiedToast, setShowCopiedToast] = React.useState(false)
  const [toastOpacity, setToastOpacity] = React.useState(0)
  const lastCopyTime = React.useRef(0)

  const handleShare = React.useCallback(() => {
    const now = Date.now()
    if (now - lastCopyTime.current < 1000) {
      return
    }
    lastCopyTime.current = now

    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setShowCopiedToast(true)
      setToastOpacity(1)
      setTimeout(() => setToastOpacity(0), 1000)
      setTimeout(() => setShowCopiedToast(false), 2000)
    })
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  if (!publication) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-custom py-16 md:py-24">
          <Button variant="ghost" asChild className="mb-6 -ml-3 gap-2">
            <Link href="/publications">
              <ArrowLeft className="h-4 w-4" />
              返回成果列表
            </Link>
          </Button>
          <div className="max-w-3xl mx-auto text-center py-16">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">成果不存在</h2>
            <p className="text-slate-600">该成果可能已被删除。</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {showCopiedToast && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div 
            className="bg-black/70 text-white px-6 py-3 rounded-lg text-lg transition-opacity duration-500"
            style={{ opacity: toastOpacity }}
          >
            已拷贝链接至剪贴板
          </div>
        </div>
      )}
      <div className="container-custom py-16 md:py-24">
        <Button variant="ghost" asChild className="mb-6 -ml-3 gap-2">
          <Link href="/publications">
            <ArrowLeft className="h-4 w-4" />
            返回成果列表
          </Link>
        </Button>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-[hsl(211,40%,97%)] text-primary border border-primary/10">
                {publication.category}
              </span>
              {publication.subCategory && (
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-slate-100 text-slate-600">
                  {publication.subCategory}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6">{publication.title}</h1>

            <div className="flex items-start gap-2 mb-4">
              <User className="h-5 w-5 text-slate-600 mt-0.5" />
              <div className="text-lg text-slate-900">
                <AuthorsList authors={publication.authors} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-600 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="font-medium text-primary">{publication.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{publication.year}</span>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {publication.url && (
                  <Button asChild>
                    <a href={publication.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      查看原文
                    </a>
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  分享
                </Button>
              </div>
            </div>
          </header>

          <Card className="border-0 shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Abstract
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">{publication.abstract}</p>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/publications">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回成果列表
              </Link>
            </Button>
          </div>
        </article>
      </div>
    </div>
  )
}
