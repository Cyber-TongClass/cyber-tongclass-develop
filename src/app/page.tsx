import Link from "next/link"
import { ArrowRight, BookOpen, Users, Calendar, FileText, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              人工智能创新人才培养
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              北京大学 & 清华大学 联合培养项目
            </p>
            <p className="text-muted-foreground">
              致力于培养具有国际视野的下一代人工智能领军人才
            </p>
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

      {/* Stats Section */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "成员", value: "100+", icon: Users },
              { label: "学术成果", value: "200+", icon: FileText },
              { label: "课程资源", value: "50+", icon: BookOpen },
              { label: "学术奖项", value: "30+", icon: Award },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              项目特色
            </h2>
            <p className="text-muted-foreground mt-2">
              跨学科培养，国际视野，创新实践
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>双校联合培养</CardTitle>
                <CardDescription>
                  汇聚北大清华优质教育资源，打造全方位人才培养体系
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>学术成果丰硕</CardTitle>
                <CardDescription>
                  在顶级会议发表论文，参与前沿科研项目
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <CardTitle>丰富学术活动</CardTitle>
                <CardDescription>
                  定期举办学术讲座、研讨会和学术交流活动
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              最新动态
            </h2>
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/news">
                查看全部 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "通班学生获ICML最佳论文奖",
                category: "学术成果",
                date: "2024-01-15",
                description: "恭喜通班学生XXX在ICML 2024获得最佳论文奖...",
              },
              {
                title: "2024年春季学期课程安排发布",
                category: "课程安排",
                date: "2024-01-10",
                description: "2024年春季学期课程安排已发布，请同学们查看...",
              },
              {
                title: "通班学术沙龙圆满结束",
                category: "活动回顾",
                date: "2024-01-05",
                description: "上周举办的通班学术沙龙活动圆满结束...",
              },
            ].map((news) => (
              <Card key={news.title} className="border-0 shadow-sm hover:shadow-md transition-shadow card-hover">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span className="text-primary font-medium">{news.category}</span>
                    <span>{news.date}</span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{news.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {news.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              加入我们
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              如果您对人工智能充满热情，欢迎了解更多关于通班项目的信息
            </p>
            <Button asChild size="lg">
              <Link href="/about">了解更多</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
