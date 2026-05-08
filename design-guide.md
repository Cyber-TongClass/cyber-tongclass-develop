# 通班官网 UI/UX 设计风格规范

> **参考：Stanford HAI、Berkeley AI Research**
> **核心哲学：学术权威、内容密度、克制的现代感**
> **最终更新：2026-05-08 | 版本 v3.0**

---

## 一、 色彩系统

### 主色调

| 角色 | 值 | Tailwind | 用途 |
|------|-----|----------|------|
| 深蓝 | `hsl(211, 54%, 28%)` | `bg-primary` | Hero 区背景、主按钮 |
| 酒红 | `hsl(350, 55%, 35%)` | 任意值 | 导航选中下划线、卡片装饰条、月份标签 |
| 酒红浅调 | `hsl(350, 55%, 40%)` | 任意值 | 卡片左侧 accent bar |
| 暖陶色 | `hsl(20, 20%, 85%)` | 任意值 | 统计数字区背景（极浅暖色） |
| 琥珀水印 | `hsl(35, 40%, 55%)` | 任意值 | 浅底 Hero 水印（已弃用，换白色） |

### 蓝色层级 (hsl 211°)

| 层级 | 值 | 用途 |
|------|-----|------|
| 深蓝 | `hsl(211, 54%, 28%)` | Hero 背景、主按钮、深蓝底标签 |
| 浅蓝 | `hsl(211, 50%, 93%)` | 图标圆底、Badge 背景 |
| 极浅蓝 | `hsl(211, 40%, 97%)` | 卡片/区块背景（替代纯白） |
| 微蓝 | `hsl(211, 30%, 97%)` | Section 整区背景（卡片底） |
| 中蓝 muted | `hsl(211, 40%, 80%)` | 深底上标签文字 |

### 中性色

| 用途 | Tailwind |
|------|----------|
| 主标题 | `text-slate-900` |
| 正文 | `text-slate-600` |
| 辅助文字 | `text-slate-500` / `text-slate-400` |
| 卡片底布 | `bg-slate-100`（压暗区）或 `bg-[hsl(211,30%,97%)]`（蓝调区） |
| Hero 标题/描述 | `text-white` / `text-white/70` |

### 关键色规则

- **同级并列元素用同一种颜色**，3 卡不各分深浅
- 禁止 `text-muted-foreground` / `text-foreground` — 用明确 `text-slate-*`
- 禁止 Tailwind 预设 `blue-*` — 色相 214°，与我们 211° 不一致
- 禁止纯黑 `#000000`

---

## 二、 形状规则

| 规则 | 说明 |
|------|------|
| 卡片为直角矩形 | 不设 `rounded-xl` / `rounded-2xl` / `rounded-lg`，`rounded-none` |
| 图标容器用圆形 | `rounded-full` + `w-12 h-12` |
| Badge 用小圆角 | `rounded-full`，深蓝底白字 `bg-primary text-white` |
| 无边框卡片 | 卡片不设 `border`，靠阴影 + 背景区分层级 |
| 图片为直角 | `rounded-none` |

---

## 三、 阴影与悬停

### 默认悬停效果

| 场景 | 默认 | 悬停 |
|------|------|------|
| 列表卡片（带 accent bar） | `shadow-sm bg-white border-l-[3px] border-transparent` | `hover:border-primary hover:bg-slate-50` |
| 卡片（无 accent bar） | `shadow-sm bg-white` | `hover:shadow-md` 或 `hover:bg-slate-50` |
| 导航链接 | 灰色文字 `border-b-2 border-transparent` | 选中：酒红文字 + 酒红下划线 |

- **禁止 z 轴悬浮位移** `hover:-translate-y-*`
- **禁止 `shadow-lg` / `shadow-xl`**
- 过渡统一用 `transition-all duration-200` 或 `transition-shadow duration-300`

---

## 四、 排版

| 层级 | Tailwind |
|------|----------|
| Hero 标题 | `text-5xl md:text-7xl font-extrabold text-white tracking-tight` |
| 区块标题 | `text-3xl font-extrabold text-slate-900` |
| Tab 内标题 | `text-2xl font-extrabold text-slate-900` |
| 卡片标题 | `text-xl md:text-2xl font-extrabold` 或 `font-bold` |
| 正文 | `text-base leading-loose text-slate-600` |
| 微排版 | `text-sm font-medium tracking-wide uppercase text-slate-500` |

- 标题一律 `font-extrabold`
- 英文字符用 `tracking-tight` 收紧，全大写用 `tracking-widest`

---

## 五、 间距与布局

| 场景 | Tailwind |
|------|----------|
| Section 上下间距 | `py-16 md:py-24` |
| 内容容器 | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`（或 `max-w-4xl`） |
| 卡片内边距 | `p-6`（标准） |
| 卡片网格间距 | `gap-5` / `gap-6` |

---

## 六、 图片规范

- 必须使用 Next.js `<Image />` 组件
- 卡片配图比例：`aspect-[3/2]` 或 `aspect-video`
- 图片圆角：`rounded-none`
- 加载态占位：`bg-slate-100 animate-pulse`
- 悬停放大：`group-hover:scale-105 transition-transform duration-500`

---

## 七、 页面级组件模式

### 7.1 Hero 区（深蓝底统一模板）

```tsx
<section className="bg-primary relative overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 relative">
    <div className="absolute left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 text-[5rem] md:text-[8rem] lg:text-[10rem] font-extrabold uppercase tracking-[0.15em] text-white/5 select-none pointer-events-none whitespace-nowrap leading-none" aria-hidden="true">
      WATERMARK
    </div>
    <div className="mb-4">
      <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">标题</h1>
    </div>
    <p className="text-lg text-white/70 max-w-2xl">描述</p>
  </div>
</section>
```

- 无小图标，仅巨大标题
- 水印 `text-white/5`
- 描述 `text-white/70`

### 7.2 不对称年份侧栏（成果页、新闻页）

```tsx
<div className="space-y-20">
  {years.map(year => (
    <div className="grid grid-cols-[72px_1fr] md:grid-cols-[96px_1fr] gap-6 md:gap-10">
      <div className="text-5xl md:text-6xl font-extrabold text-slate-300 leading-none select-none">{year}</div>
      <div className="space-y-4">
        {/* 月份标签 + 卡片列表 */}
      </div>
    </div>
  ))}
</div>
```

- 年份数字半压在卡片区，极具层次感
- 月份用全大写英文 `text-xl font-extrabold tracking-widest text-[hsl(350,55%,35%)]`
- 卡片悬停效果：`border-l-[3px] border-transparent hover:border-primary hover:bg-slate-50`

### 7.3 日历撕页（活动页）

```tsx
<div className="flex group bg-white shadow-sm hover:bg-slate-50 border-l-[3px] border-transparent hover:border-primary">
  <div className="flex flex-col items-center justify-center w-16 md:w-20 bg-slate-50 group-hover:bg-primary/5">
    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">MAY</span>
    <span className="text-2xl md:text-3xl font-extrabold text-slate-800">18</span>
  </div>
  <div className="flex-1 p-4">...</div>
</div>
```

### 7.4 左文右图行（资源页）

```tsx
<div className="group bg-white shadow-sm hover:shadow-md transition-shadow flex overflow-hidden">
  <div className="flex-1 p-6 md:p-8">
    <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-primary">标题</h3>
    <p>描述</p>
  </div>
  <div className="md:w-56 lg:w-64 flex-shrink-0 relative">
    <Image fill className="object-cover group-hover:scale-105" />
  </div>
</div>
```

### 7.5 卡片装饰条

```tsx
<div className="relative">
  <div className="absolute top-0 left-0 w-10 h-1 bg-[hsl(350,55%,40%)]"></div>
  ...
</div>
```

- 用于功能卡片、学生组织卡片等
- 酒红色 `hsl(350,55%,40%)`

### 7.6 底部导航下划线（Navbar）

```tsx
<Link className={cn(
  "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
  active ? "text-[hsl(350,55%,35%)] border-[hsl(350,55%,35%)]" : "text-slate-500 border-transparent"
)}>
```

### 7.7 Badge 标签

- 深蓝底白字：`bg-primary text-white px-2.5 py-0.5 text-xs rounded-full`
- 浅蓝底蓝字：`bg-[hsl(211,50%,93%)] text-primary`（次要标签）

---

## 八、 禁止项

| 禁止 | 替代 |
|------|------|
| `rounded-2xl` / `rounded-xl` / `rounded-lg` 卡片 | `rounded-none` |
| `hover:-translate-y-1` / `-2` | 仅阴影 + 背景 + accent bar |
| `border border-slate-200` 卡片 | 无边框，靠阴影 |
| `shadow-lg` / `shadow-xl` | `shadow-sm hover:shadow-md` |
| `text-muted-foreground` / `text-foreground` | `text-slate-600` / `text-slate-900` |
| `font-bold` / `font-semibold` 标题 | `font-extrabold` |
| `py-8` Section | `py-16 md:py-24` |
| `bg-background` | `bg-white` |
| `bg-primary/5` | `bg-[hsl(211,40%,97%)]` |
| Tailwind `blue-*` | 同色相 211° 自定义值 |
| 同级并列不同色 | 同级统一，跨级才变 |
| 纯黑色 `#000` | `text-slate-900` |

---

## 九、 各页面 Hero 水印速查表

| 页面 | 水印 | 标题 |
|------|------|------|
| 首页（不改） | TONG CLASS | 人工智能创新人才培养 |
| 关于 | ABOUT US | 关于通班 |
| 新闻 | NEWS | 新闻动态 |
| 成员 | MEMBERS | 班级成员 |
| 成果 | PUBLICATIONS | 学术成果 |
| 资源 | RESOURCES | 学习资源 |
| 活动 | EVENTS | 活动日程 |
| 内网 | INTRANET | 内部网站 |
| 课程 | COURSES | 课程测评 |
