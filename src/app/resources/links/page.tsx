import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const resourceLinks = [
  {
    category: "通班推荐",
    links: [
      { name: "《通班生存指南》自学推荐", url: "https://mp.weixin.qq.com/s?__biz=Mzk1Nzg0MzM0OQ==&mid=2247485296&idx=1&sn=f7c3823303c1460b97a0927ca8aa672e&chksm=c3d9558af4aedc9cc0c7e8422606cbc62ac38c581970418dff6074054612a42e5ab67e3dc003&scene=178&cur_album_id=4091076469172944898&search_click_id=#rd" },
      { name: "机器学习 / 人工智能入门指引 — yzhu.io", url: "https://yzhu.io/s/research/getting_started/" },
    ],
  },
  {
    category: "3Blue1Brown",
    links: [
      { name: "3Blue1Brown 官方 B 站频道", url: "https://space.bilibili.com/88461692?spm_id_from=333.337.0.0" },
      { name: "Essence of Linear Algebra（线性代数的本质）", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" },
      { name: "Neural Networks（神经网络）", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi" },
    ],
  },
]

export default function ResourceLinksPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-primary relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 relative">
          <div className="absolute left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 text-[5rem] md:text-[8rem] lg:text-[10rem] font-extrabold uppercase tracking-[0.15em] text-white/5 select-none pointer-events-none whitespace-nowrap leading-none" aria-hidden="true">RESOURCES</div>
          <div className="mb-4">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">自学资源</h1>
          </div>
          <p className="text-lg text-white/70 max-w-2xl">
            人工智能学习资源汇总，包括课程、书籍、论文与工具链接，由通班学术部维护更新。
          </p>
        </div>
      </section>

      <section className="bg-[hsl(211,30%,97%)] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {resourceLinks.map((group) => (
              <div key={group.category}>
                <h2 className="text-xl font-extrabold text-slate-900 mb-4">{group.category}</h2>
                <div className="space-y-3">
                  {group.links.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-base font-medium text-slate-900 group-hover:text-primary transition-colors">
                          {link.name}
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
