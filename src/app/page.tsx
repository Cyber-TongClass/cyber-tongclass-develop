"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { ArrowRight, BookOpen, Users, FileText, Award, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNews } from "@/lib/api"

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0)
  const newsItems = useNews({ limit: 50 })
  const featuredSlides = useMemo(() => {
    if (!newsItems) return []

    return [...newsItems]
      .filter((item) => item.showOnHomepage && item.coverImageUrl)
      .sort((a, b) => b.publishedAt - a.publishedAt)
      .map((item) => {
        const normalizedContent = item.content.trim()
        const shouldOpenOriginalDirectly =
          !!item.sourceUrl && (!normalizedContent || normalizedContent === "暂无内容")

        return {
          id: item._id,
          title: item.title,
          description: item.homepageSubtitle?.trim() || "",
          category: item.category,
          href: shouldOpenOriginalDirectly ? item.sourceUrl! : `/news/${item._id}`,
          isExternal: shouldOpenOriginalDirectly,
          image: item.coverImageUrl!,
        }
      })
  }, [newsItems])

  useEffect(() => {
    if (featuredSlides.length <= 1) return

    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredSlides.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [featuredSlides])

  useEffect(() => {
    if (activeSlide >= featuredSlides.length) {
      setActiveSlide(0)
    }
  }, [activeSlide, featuredSlides.length])

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[360px] md:h-[480px] overflow-hidden border-b border-slate-200 bg-slate-950">
        {featuredSlides.length === 0 ? (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800" />
            <div className="container-custom relative h-full flex items-center">
              <div className="max-w-2xl text-white">
                <p className="inline-flex mb-4 text-xs tracking-wide uppercase bg-white/20 px-3 py-1 rounded-full">
                  首页轮播
                </p>
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">欢迎来到北大通班</h1>
                <p className="text-white/90 text-base md:text-lg mb-6">
                  当前还没有勾选“在首页轮播展示”的已发布动态。你可以在后台新闻管理中为动态开启首页轮播。
                </p>
                <Button asChild size="lg" className="gap-2">
                  <Link href="/news">
                    查看动态 <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : null}
        {featuredSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              idx === activeSlide ? "opacity-100 pointer-events-auto z-10" : "opacity-0 pointer-events-none z-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
            <div className="container-custom relative h-full flex items-center">
              <div className="max-w-2xl text-white">
                <p className="inline-flex mb-4 text-xs tracking-wide uppercase bg-white/20 px-3 py-1 rounded-full">
                  {slide.category}
                </p>
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">{slide.title}</h1>
                {slide.description ? (
                  <p className="text-white/90 text-base md:text-lg mb-6">{slide.description}</p>
                ) : null}
                <Button asChild size="lg" className="gap-2">
                  {slide.isExternal ? (
                    <a href={slide.href} target="_blank" rel="noopener noreferrer">
                      查看详情 <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <Link href={slide.href}>
                      查看详情 <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute left-4 right-4 bottom-4 z-20 flex items-center justify-between">
          <div className="flex gap-2">
            {featuredSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setActiveSlide(idx)}
                className={`h-2.5 rounded-full transition-all ${idx === activeSlide ? "w-8 bg-white" : "w-2.5 bg-white/50"}`}
                aria-label={`切换到第 ${idx + 1} 张`}
              />
            ))}
          </div>
          <div className="hidden sm:flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/20 text-white hover:bg-white/30 border border-white/30"
              disabled={featuredSlides.length <= 1}
              onClick={() => setActiveSlide((prev) => (prev - 1 + featuredSlides.length) % featuredSlides.length)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/20 text-white hover:bg-white/30 border border-white/30"
              disabled={featuredSlides.length <= 1}
              onClick={() => setActiveSlide((prev) => (prev + 1) % featuredSlides.length)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-gradient-to-b from-[hsl(211,40%,97%)] to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 text-[5rem] md:text-[8rem] lg:text-[10rem] font-extrabold uppercase tracking-[0.15em] text-[hsl(35,40%,55%)]/10 select-none pointer-events-none whitespace-nowrap leading-none" aria-hidden="true">TONG CLASS</div>
          <div className="max-w-3xl mx-auto text-center space-y-6 relative">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-balance tracking-tight text-slate-900">通用人工智能实验班</h2>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">北京大学 & 清华大学</p>
            <p className="text-slate-500">北京大学与清华大学于2021年联合创立，致力于培养具有国际视野的下一代人工智能领军人才</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/about">
                  了解更多 <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/members">查看成员</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: "北清成员", value: "300+", icon: Users },
              { label: "顶会论文", value: "40+", icon: FileText },
              { label: "科研课题", value: "70+", icon: BookOpen },
              { label: "奖项荣誉", value: "80+", icon: Award },
            ].map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <stat.icon className="h-8 w-8 mx-auto mb-3 opacity-80" />
                <div className="text-4xl md:text-5xl font-extrabold tracking-tight">{stat.value}</div>
                <div className="text-sm md:text-base mt-1 text-[hsl(211,40%,80%)] font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900">项目特色</h2>
            <p className="text-slate-500 mt-3 text-lg">跨学科培养，国际视野，创新实践</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "通识·通智·通用",
                description: "交叉人文社科的「通识」、融会六大核心领域的「通智」、融入各行各业的「通用」，培养世界顶尖复合型人才",
                image: "https://cdn.jsdelivr.net/gh/Cyber-TongClass/news-assets@main/news%20images/%E5%8C%97%E4%BA%AC%E5%A4%A7%E5%AD%A6%E9%80%9A%E7%94%A8%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E5%AE%9E%E9%AA%8C%E7%8F%AD_%E9%80%9A%E8%AF%86_%E9%80%9A%E6%99%BA_%E9%80%9A%E7%94%A8/assets/tongtongtong.webp",
                fit: "object-contain",
              },
              {
                title: "六大核心领域",
                description: "课程涵盖计算机视觉、自然语言处理、认知推理、机器学习、机器人学、多智能体，全方向覆盖",
                image: "https://www.bigai.ai/wp-content/uploads/2022/10/%E7%A0%94%E7%A9%B6-e1666601512358.png",
              },
              {
                title: "前沿科研实践",
                description: "深度参与 70+ 前沿课题，发表 40+ 顶会论文，斩获 80+ 奖项荣誉，成果应用于真实产业场景",
                image: "https://cdn.jsdelivr.net/gh/Cyber-TongClass/news-assets@main/news%20images/%E5%8C%97%E4%BA%AC%E5%A4%A7%E5%AD%A6%E9%80%9A%E7%94%A8%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E5%AE%9E%E9%AA%8C%E7%8F%AD_%E9%80%9A%E8%AF%86_%E9%80%9A%E6%99%BA_%E9%80%9A%E7%94%A8/assets/17776187945420.7835409329709796.jpg",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="overflow-hidden bg-white shadow-sm"
              >
                <div className="aspect-[3/2] w-full bg-slate-100 overflow-hidden relative">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className={feature.fit || "object-cover"}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[hsl(211,30%,97%)]">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">最新动态</h2>
              <p className="text-slate-500 mt-1">关注通班最新资讯与学术活动</p>
            </div>
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/news">
                查看全部 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "2025级通班建班仪式圆满举行",
                category: "项目进展",
                date: "2026-03",
                description: "北京大学2025级通用人工智能实验班建班仪式在通研院举行，朱松纯院长等师长寄语新生。",
                badgeBg: "bg-[hsl(211,50%,93%)]",
                image: "https://cdn.jsdelivr.net/gh/Cyber-TongClass/news-assets@main/news%20images/%E5%8C%97%E4%BA%AC%E5%A4%A7%E5%AD%A62025%E7%BA%A7%E9%80%9A%E7%94%A8%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E5%AE%9E%E9%AA%8C%E7%8F%AD%E5%BB%BA%E7%8F%AD%E4%BB%AA%E5%BC%8F%E5%9C%86%E6%BB%A1%E4%B8%BE%E8%A1%8C/assets/17776187172560.5875476653375152.jpg",
              },
              {
                title: "第三届「AI杯」羽毛球赛顺利举办",
                category: "活动回顾",
                date: "2026-03",
                description: "北京大学人工智能研究院第三届师生羽毛球赛在五四羽毛球场举行，70余名师生、6支队伍参赛。",
                badgeBg: "bg-[hsl(211,50%,93%)]",
                image: "https://cdn.jsdelivr.net/gh/Cyber-TongClass/news-assets@main/news%20images/%E5%8C%97%E4%BA%AC%E5%A4%A7%E5%AD%A6%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E7%A0%94%E7%A9%B6%E9%99%A2%E7%AC%AC%E4%B8%89%E5%B1%8A_AI%E6%9D%AF_%E7%BE%BD%E6%AF%9B%E7%90%83%E8%B5%9B%E9%A1%BA%E5%88%A9%E4%B8%BE%E5%8A%9E/assets/17776187174370.8517678879431937.jpg",
              },
              {
                title: "2025 AI Tech Day圆满结束",
                category: "学术活动",
                date: "2025-10",
                description: "年度人工智能学生科技节展出91项科研展板与10项Demo，覆盖认知推理、CV、NLP及AI+交叉前沿。",
                badgeBg: "bg-[hsl(211,50%,93%)]",
                image: "https://cdn.jsdelivr.net/gh/Cyber-TongClass/news-assets@main/news%20images/%E5%8C%97%E4%BA%AC%E5%A4%A7%E5%AD%A6%E9%80%9A%E7%94%A8%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E5%AE%9E%E9%AA%8C%E7%8F%AD_%E9%80%9A%E8%AF%86_%E9%80%9A%E6%99%BA_%E9%80%9A%E7%94%A8/assets/17776187946850.7467038505938248.jpg",
              },
            ].map((news) => (
              <div
                key={news.title}
                className="group overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="aspect-video w-full bg-slate-100 overflow-hidden relative">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm mb-3">
                    <span className={`inline-flex text-xs font-medium tracking-wide uppercase text-primary ${news.badgeBg} px-2.5 py-0.5 rounded-full`}>
                      {news.category}
                    </span>
                    <span className="text-slate-400">{news.date}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">{news.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
