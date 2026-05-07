"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Mail, ExternalLink, BookOpen, FileText, School, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePublicationsByUser, useUserByProfileSlug } from "@/lib/api"
import { normalizeUrl } from "@/lib/utils"
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer"
import { getUserLinks, getUserPersonalEmails } from "@/lib/user-profile"
import { getResearchDirectionLabel } from "@/lib/research-directions"
import type { Publication } from "@/types"

export default function MemberDetailPage() {
  const params = useParams<{ id: string }>()
  const memberSlug = params.id

  const userData = useUserByProfileSlug(memberSlug)
  const member = userData ? { ...userData, id: userData._id } : null
  const publicationsData = usePublicationsByUser(member?._id || "")
  const publications: Publication[] = publicationsData || []
  const personalEmails = member ? getUserPersonalEmails(member) : []
  const profileLinks = member ? getUserLinks(member) : []
  const researchDirections = member?.researchDirections || []
  const profilePhoto = member?.realPhoto || member?.avatar

  const loading = userData === undefined || (!!member && publicationsData === undefined)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Member not found</div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8 md:py-12">
      <Button variant="ghost" asChild className="mb-6 -ml-3 gap-2">
        <Link href="/members">
          <ArrowLeft className="h-4 w-4" />
          Back to Members
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm sticky top-24">
            <CardHeader className="text-center pb-4">
              <div className="h-24 w-24 mx-auto rounded-full overflow-hidden bg-primary/10 mb-4">
                {profilePhoto ? (
                  <img src={profilePhoto} alt={member.englishName} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-primary font-bold text-3xl">
                    {member.englishName.charAt(0)}
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl">{member.englishName}</CardTitle>
              {member.chineseName ? (
                <p className="text-sm text-muted-foreground mt-1">{member.chineseName}</p>
              ) : null}
              <p className="text-muted-foreground flex items-center justify-center gap-2">
                {member.organization === "pku" ? <School className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
                {member.organization === "pku" ? "PKU Tong Class" : "THU Tong Class"} · Class of {member.cohort}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {personalEmails.length > 0 && (
                <div className="space-y-3">
                  {personalEmails.map((email) => (
                    <a
                      key={email}
                      href={`mailto:${email}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {email}
                    </a>
                  ))}
                </div>
              )}

              {researchDirections.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Research Areas
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {researchDirections.map((direction: string) => (
                      <span
                        key={direction}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/5 text-primary"
                      >
                        {getResearchDirectionLabel(direction)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {member.researchInterests && member.researchInterests.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Research Interests</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {member.researchInterests.map((interest: string) => (
                      <span
                        key={interest}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profileLinks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Links
                  </h4>
                  <div className="space-y-2">
                    {profileLinks.map((item) => (
                      <a
                        key={`${item.type}-${item.label}-${item.url}`}
                        href={normalizeUrl(item.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors text-sm"
                      >
                        <span>{item.label}</span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Bio</h4>
                {member.bio ? (
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{member.bio}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No bio yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {member.profileMarkdown?.trim() && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Profile Notes</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-6">
                <MarkdownRenderer content={member.profileMarkdown} />
              </CardContent>
            </Card>
          )}

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Publications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {publications.length > 0 ? (
                <div className="space-y-4">
                  {publications.map((pub) => (
                    <Link
                      key={pub._id}
                      href={`/publications/${pub._id}`}
                      className="block p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                      <h4 className="font-semibold text-foreground mb-1 line-clamp-2">{pub.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {pub.authors.map((author, index) => {
                          const isCurrentUser = author === member.englishName
                          return (
                            <React.Fragment key={index}>
                              {index > 0 && ", "}
                              <span className={isCurrentUser ? "font-bold text-muted-foreground" : ""}>{author}</span>
                            </React.Fragment>
                          )
                        })}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-medium text-primary">{pub.venue}</span>
                        <span>·</span>
                        <span>{pub.year}</span>
                        <span>·</span>
                        <span>{pub.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No publications yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
