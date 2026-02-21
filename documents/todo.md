# TODO List

本文档记录项目的任务清单和进度。

---

## 阶段 1: 项目初始化 (已完成)

### 1.1 Git 仓库设置
- [x] 初始化 Git 仓库
- [x] 创建 develop 分支
- [x] 创建 .gitignore

### 1.2 项目结构
- [x] 创建目录结构
- [x] 创建 package.json
- [x] 创建 tsconfig.json
- [x] 创建 next.config.js
- [x] 创建 tailwind.config.ts
- [x] 创建 postcss.config.js

### 1.3 设计系统
- [x] 创建 globals.css (Yale 风格)
- [x] 定义颜色系统
- [x] 定义字体系统
- [x] 定义间距和阴影

### 1.4 基础 UI 组件
- [x] Button
- [x] Card
- [x] Input
- [x] Sheet
- [x] DropdownMenu

### 1.5 布局组件
- [x] Navbar
- [x] Footer

### 1.6 首页
- [x] Hero 区域
- [x] 统计展示
- [x] 项目特色
- [x] 最新动态

### 1.7 后端配置
- [x] Convex schema
- [x] Users API
- [x] Publications API
- [x] News API
- [x] Events API
- [x] Course Reviews API

### 1.8 文档
- [x] api.md
- [x] tools.md
- [x] user_pipe.md
- [x] module.md
- [x] agent_coll.md
- [x] search.md
- [ ] todo.md (本文档)

---

## 阶段 2: 页面开发 (待开始)

### 2.1 成员模块
- [ ] 成员列表页 (/members)
- [ ] 成员详情页 (/members/[id])

### 2.2 成果模块
- [ ] 成果列表页 (/publications)
- [ ] 成果详情页 (/publications/[id])

### 2.3 新闻模块
- [ ] 新闻列表页 (/news)
- [ ] 新闻详情页 (/news/[id])

### 2.4 活动模块
- [ ] 活动列表页 (/events)
- [ ] 活动详情页 (/events/[id])
- [ ] 日历视图

### 2.5 资源模块
- [ ] 课程列表页 (/resources)
- [ ] 课程详情页 (/resources/courses/[name])
- [ ] 提交评测表单

### 2.6 关于页
- [ ] 关于页面 (/about)

---

## 阶段 3: 认证系统 (待开始)

### 3.1 登录注册
- [ ] 登录页面 (/login)
- [ ] 注册页面 (/register)
- [ ] 忘记密码流程

### 3.2 用户设置
- [ ] 个人资料编辑 (/settings)
- [ ] 密码修改
- [ ] 头像上传

### 3.3 权限控制
- [ ] 登录状态管理
- [ ] 路由守卫
- [ ] API 权限验证

---

## 阶段 4: 管理后台 (待开始)

### 4.1 Dashboard
- [ ] 首页 (/admin)
- [ ] 数据概览

### 4.2 用户管理
- [ ] 用户列表
- [ ] 新建/编辑/删除用户
- [ ] 角色分配

### 4.3 内容管理
- [ ] 新闻管理 (/admin/news)
- [ ] 活动管理 (/admin/events)
- [ ] 评测审核 (/admin/reviews)

### 4.4 数据导入
- [ ] 批量导入课程评测

---

## 阶段 5: 部署运维 (待开始)

### 5.1 Docker
- [ ] Dockerfile
- [ ] docker-compose.yml

### 5.2 环境配置
- [ ] .env.development
- [ ] .env.production

### 5.3 CI/CD
- [ ] GitHub Actions
- [ ] Nginx 配置

---

## 阶段 6: 优化 (待开始)

### 6.1 性能优化
- [ ] 图片优化
- [ ] 代码分割
- [ ] 缓存策略

### 6.2 SEO
- [ ] Meta 标签
- [ ] Sitemap
- [ ] Robots.txt

### 6.3 可访问性
- [ ] ARIA 标签
- [ ] 键盘导航
- [ ] 颜色对比度

---

## 阶段 7: 测试 (待开始)

### 7.1 单元测试
- [ ] 工具函数测试
- [ ] 组件测试

### 7.2 E2E 测试
- [ ] 登录流程
- [ ] 内容发布流程

---

## 阶段 8: 上线 (待开始)

### 8.1 域名配置
- [ ] DNS 设置
- [ ] SSL 证书

### 8.2 监控
- [ ] 错误监控
- [ ] 性能监控

---

## 优先级

### P0 (必须)
1. 项目初始化
2. 基础页面开发
3. 认证系统
4. 管理后台

### P1 (重要)
1. 部署配置
2. SEO 优化
3. 性能优化

### P2 (可选)
1. 测试
2. 高级功能

---

## 更新日志

- 2024-01: 初始创建，阶段 1 完成
