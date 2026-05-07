"use client"

import * as React from "react"
import Link from "next/link"
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Mail, 
  MapPin, 
  Phone, 
  ExternalLink,
  ArrowRight,
  Clock,
  Award,
  Group
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary/5 border-b border-border">
        <div className="container-custom py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              关于通班
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            了解北京大学与清华大学联合培养人工智能创新人才项目的更多信息。
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-custom py-8">
        <Tabs defaultValue="introduction" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto p-1">
            <TabsTrigger value="introduction" className="py-3">项目介绍</TabsTrigger>
            <TabsTrigger value="accounts" className="py-3">官方账号</TabsTrigger>
            <TabsTrigger value="campus" className="py-3">校园生活</TabsTrigger>
            <TabsTrigger value="council" className="py-3">学生组织</TabsTrigger>
            <TabsTrigger value="merchandise" className="py-3">周边</TabsTrigger>
            <TabsTrigger value="contact" className="py-3">联系</TabsTrigger>
          </TabsList>

          {/* Introduction */}
          <TabsContent value="introduction" className="mt-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-6">项目介绍</h2>
              
              <div className="space-y-8">
                {/* Overview */}
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold mb-4">关于我们</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      北京大学与清华大学联合培养人工智能创新人才项目（以下简称&quot;通班&quot;）于2020年启动，旨在培养具有国际视野、创新能力的人工智能领域领军人才。
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      项目汇聚两校优质教学资源，由顶尖学者指导，学生可在北大和清华两所顶尖学府完成学业，享受丰富的学术资源和实践机会。
                    </p>
                  </CardContent>
                </Card>

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-foreground">100+</div>
                      <div className="text-sm text-muted-foreground">在读学生</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-foreground">200+</div>
                      <div className="text-sm text-muted-foreground">学术成果</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-foreground">50+</div>
                      <div className="text-sm text-muted-foreground">顶会论文</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Group className="h-8 w-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-foreground">30+</div>
                      <div className="text-sm text-muted-foreground">合作导师</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Features */}
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold mb-6">项目特色</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="font-semibold mb-2">双校联合培养</h4>
                        <p className="text-sm text-muted-foreground">
                          整合北大和清华优质教育资源，享受两校学术氛围
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="font-semibold mb-2">顶尖导师指导</h4>
                        <p className="text-sm text-muted-foreground">
                          由两校顶尖学者组成导师团队，提供一对一指导
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="font-semibold mb-2">丰硕学术成果</h4>
                        <p className="text-sm text-muted-foreground">
                          学生已在顶级会议发表多篇论文，获得多项奖励
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Official Accounts */}
          <TabsContent value="accounts" className="mt-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-6">官方账号</h2>
              <Card>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                      <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">官方微信公众号</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          关注获取最新动态、通知公告和活动信息
                        </p>
                        <p className="text-sm font-medium">ID: TongClass_PKU</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                      <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Bilibili 账号</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          观看学术讲座回放、分享研究心得
                        </p>
                        <p className="text-sm font-medium">UID: 123456789</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                      <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Discord 社区</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          加入社区与同学交流、分享资源
                        </p>
                        <a href="#" className="text-sm text-primary hover:underline flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          加入社区
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Campus Life */}
          <TabsContent value="campus" className="mt-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-6">校园生活</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      北大校区
                    </h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>昌平校区：主要教学地点，配备现代化教学楼和实验室</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>学习时间：周一至周五课程，周末可预约实验室</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      清华校区
                    </h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>FIT楼：人工智能研究院所在地，配备先进设备</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>学习时间：定期访问，可使用清华图书馆资源</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="md:col-span-2">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">学生活动</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-medium mb-2">学术沙龙</h4>
                        <p className="text-sm text-muted-foreground">每周一次，分享最新研究成果</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-medium mb-2">体育活动</h4>
                        <p className="text-sm text-muted-foreground">篮球、足球、羽毛球等</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-medium mb-2">团建活动</h4>
                        <p className="text-sm text-muted-foreground">春秋季出游、节日聚会</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Student Council */}
          <TabsContent value="council" className="mt-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-6">学生组织</h2>
              <Card>
                <CardContent className="p-8">
                  <p className="text-muted-foreground mb-6">
                    北大和清华通班分别形成了学生自发组织的服务团体，致力于完善班级建设、宣传班级形象、促进学术交流、丰富同学们的学习生活。
                  </p>

                  <div className="grid grid-cols-1 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4">北大通班</h3>

                      <div className="space-y-6 text-sm text-muted-foreground leading-7">
                        <section>
                          <h4 className="font-semibold text-foreground mb-2">通班自治委员会</h4>
                          <p className="mb-2">
                            通班自治委员会是班级的核心统筹与执行机构，负责贯彻落实校、院政策与决议，协调和规划重要班级事务，收集并反馈同学意见，领导并监督各职能部门的工作，保障班级运行的高效与有序。
                          </p>
                          <p className="font-medium text-foreground mb-1">核心工作：</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>与校、院级领导和老师沟通协调，承接并推动班级相关决议和工作的落实。</li>
                            <li>统筹规划重要班级事务，组织班级阶段重点工作的推进。</li>
                            <li>领导并监督各职能部门，明确任务分工，跟进工作进展。</li>
                            <li>收集班级内部对教学安排、事务管理等方面的意见建议，及时向有关方反馈。</li>
                            <li>发扬民主精神，定期组织完善班级组织架构和章程。</li>
                            <li>代表通班学生对外发声，在院系、学校及其他场合中传递班级立场，展现通班形象。</li>
                          </ul>
                        </section>

                        <section>
                          <h4 className="font-semibold text-foreground mb-2">通班组织部</h4>
                          <p className="mb-2">
                            通班组织部是负责班级对内组织、筹办活动的部门，是维系通班组织架构和班级凝聚力、向心力的中坚力量。
                          </p>
                          <p className="font-medium text-foreground mb-1">核心工作：</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>统筹组织各种丰富多彩的班级团建活动，并负责申请和管理学生活动经费。</li>
                            <li>定期讨论、更新和完善班级组织架构和章程，充分发挥学生自治体系职能，保障班级组织的活力和效率。</li>
                            <li>参与组织AI院的各项大型活动，如科技节、通班大会、AI院师生团建活动等。</li>
                            <li>联络兄弟友好班级，包括北大智班、清华通班、元培学院其他专业方向等，共同组织活动。</li>
                            <li>统筹组织新年晚会及其他晚会活动的节目设计、排练与演出。</li>
                            <li>组织发放节日小福利、设计选择奖品等。</li>
                            <li>整一些同学们喜闻乐见的绝妙好活。</li>
                            <li>其他有关班级组织建设的工作。</li>
                          </ul>
                        </section>

                        <section>
                          <h4 className="font-semibold text-foreground mb-2">通班宣传部</h4>
                          <p className="mb-2">
                            通班宣传部是班级对外展示的窗口与文化输出的桥梁，主要负责运营班级官方微信公众号、视频号等新媒体平台，设计并制作与招生宣传、班级形象展示等相关的各类宣传内容。
                          </p>
                          <p className="font-medium text-foreground mb-1">核心工作：</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>运营班级官方公众号“PKU通班”和同名视频号，撰文、排版、制作推送。</li>
                            <li>设计班级吉祥物形象“通小喵”，并制作表情包等衍生产品。</li>
                            <li>设计制作班级文创，现已陆续推出：帆布袋、卡套、徽章、书签、文件夹、玩偶、文化衫、帽子、马克杯、鼠标垫、U盘、笔记本、钥匙链、日历、贴纸等。</li>
                            <li>导演、拍摄通班宣传片、MV、微电影等。</li>
                            <li>制作招生宣传册、《通班生存指南》等帮助同学们选择通班、更好地在通班学习生活的班级宣传材料。</li>
                            <li>其他有关班级宣传和形象建设的工作。</li>
                          </ul>
                        </section>

                        <section>
                          <h4 className="font-semibold text-foreground mb-2">通班学术部</h4>
                          <p className="mb-2">
                            通班学术部是班级学术氛围建设、助力同学们更好地学习和科研的加油站，更是通班丰富的学术和科研资源的集中体现。
                          </p>
                          <p className="font-medium text-foreground mb-1">核心工作：</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>组织Tong Zhi Talk系列活动，与智班合作邀请Talker，保障同学们能接触到全球领域研究前沿，寻找感兴趣的科研方向，与全球各地的讲者交流互鉴。</li>
                            <li>组织班级内部学术交流活动，涵盖数理基础（Tong Math Discussion）、计算机编程（Tong Computing Discussion）和前沿论文导读（Tong Paper Discussion）。</li>
                            <li>助力同学们学习讨论高数线代等数理基础课的知识和习题、计概等计算机专业课的大作业等。</li>
                            <li>组织编写、维护《通班生存指南》等帮助同学们更好地在通班学习生活的班级指导材料。</li>
                            <li>采访优秀的学长学姐，整理、编写、发布有参考价值的学习科研经验分享。</li>
                            <li>整理并发布通班学生的最新学术研究成果。</li>
                            <li>维护通班官网及其中的班级官方、个人、学术相关资料。</li>
                            <li>收集、整理通班内部课程测评，维护通班内部课程测评平台。</li>
                            <li>其他有关班级学术和科研的工作。</li>
                          </ul>
                        </section>

                        <section>
                          <h4 className="font-semibold text-foreground mb-2">通班体育部</h4>
                          <p className="mb-2">
                            “完全人格，首在体育。”通班体育部是班级体育相关活动的组织部门，为保障同学们的身心健康、完成学校的体育锻炼要求、增强班级凝聚力等起着关键作用。
                          </p>
                          <p className="font-medium text-foreground mb-1">核心工作：</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>组织班级和AI院的体育赛事，如羽毛球赛、乒乓球赛等。</li>
                            <li>参与组织与体育相关的团建与团体活动，如登山、趣味运动会等。</li>
                            <li>组织协同完成85km跑步等学校要求的体育锻炼。</li>
                            <li>组织参加校运动会及入场式方阵等代表班级的体育活动。</li>
                            <li>在其他与体育相关的班级活动中，领导分组。</li>
                            <li>其他有关班级体育建设的工作。</li>
                          </ul>
                        </section>

                        <section>
                          <h4 className="font-semibold text-foreground mb-2">通班顾问委员会</h4>
                          <p>
                            通班顾问委员会是由高年级同学组成的班级智囊团，成员多为曾长期参与通班班务工作的原班委、学生骨干或积极为班级建设作出贡献的同学。作为“退而不休”的中坚支持力量，顾问委员会致力于为班级建设与发展提供经验传承、事务建议与必要支援，在关键节点协助现任班委开展工作，确保班级运行的稳定性与可持续性。委员会成员不仅承担经验交流、活动策划指导等任务，也在需要时协助解决复杂问题、对接外部资源、推动优良传统的发扬光大与传承。
                          </p>
                        </section>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">清华通班</h3>
                      <ul className="space-y-3 text-sm">
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Merchandise */}
          <TabsContent value="merchandise" className="mt-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-6">周边产品</h2>
              <Card>
                <CardContent className="p-8">
                  <p className="text-muted-foreground mb-6">
                    通班周边产品正在设计中，敬请期待！如有好的建议，欢迎联系我们。
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="text-center p-6 rounded-lg border border-dashed">
                      <div className="h-32 bg-muted/50 rounded-lg mb-4 flex items-center justify-center">
                        <Award className="h-10 w-10 text-primary/70" />
                      </div>
                      <h4 className="font-medium">文化衫</h4>
                      <p className="text-sm text-muted-foreground mt-1">即将上线</p>
                    </div>
                    <div className="text-center p-6 rounded-lg border border-dashed">
                      <div className="h-32 bg-muted/50 rounded-lg mb-4 flex items-center justify-center">
                        <GraduationCap className="h-10 w-10 text-primary/70" />
                      </div>
                      <h4 className="font-medium">学位服</h4>
                      <p className="text-sm text-muted-foreground mt-1">即将上线</p>
                    </div>
                    <div className="text-center p-6 rounded-lg border border-dashed">
                      <div className="h-32 bg-muted/50 rounded-lg mb-4 flex items-center justify-center">
                        <BookOpen className="h-10 w-10 text-primary/70" />
                      </div>
                      <h4 className="font-medium">笔记本</h4>
                      <p className="text-sm text-muted-foreground mt-1">即将上线</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contact */}
          <TabsContent value="contact" className="mt-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-6">联系我们</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">联系信息</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">邮箱</p>
                          <a href="mailto:info@tongclass.ac.cn" className="text-sm text-muted-foreground hover:text-primary">
                            info@tongclass.ac.cn
                          </a>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">地址</p>
                          <p className="text-sm text-muted-foreground">
                            北京市海淀区颐和园路5号<br />
                            北京大学昌平校区
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">电话</p>
                          <p className="text-sm text-muted-foreground">010-62751234</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">快速链接</h3>
                    <ul className="space-y-3">
                      <li>
                        <a 
                          href="https://www.ai.pku.edu.cn/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                          北京大学人工智能研究院
                        </a>
                      </li>
                      <li>
                        <a 
                          href="https://yuanpei.pku.edu.cn/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                          北京大学元培学院
                        </a>
                      </li>
                      <li>
                        <a 
                          href="https://www.pku.edu.cn/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                          北京大学
                        </a>
                      </li>
                      <li>
                        <a 
                          href="https://www.tsinghua.edu.cn/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                          清华大学
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Back to old version */}
      <section className="border-t border-border bg-muted/30">
        <div className="container-custom py-8 text-center">
          <p className="text-muted-foreground mb-4">
            想要查看旧版网站？
          </p>
          <a href="https://nostalgic.tongclass.ac.cn/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              访问旧版网站
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}
