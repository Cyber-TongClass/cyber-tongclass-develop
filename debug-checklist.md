# Tong Class 网站 Debug 任务清单

## 1. 改密码：明文 + 成功提示 + 自动登出

**文件**: `src/app/settings/page.tsx:222-259`

- 目前密码字段为 `type="password"`，输入时被隐藏 —— 建议改为明文 `type="text"` 或增加显示/隐藏切换。
- 密码修改成功后只设置了 `successMessage` 状态（行256），但没有弹出 toast 提示，也没有自动登出。
- 建议：修改成功后调用 `logout()` 清除登录态并跳转到登录页。

**涉及文件**: `src/app/settings/page.tsx`, `src/lib/hooks/use-auth.ts`

---

## 2. 登录简化：仅需学号

**文件**: `src/app/login/page.tsx:14-39`

- 目前登录表单 label 为「邮箱或用户名」，实际调用 `simpleLogin` mutation。
- `simpleLogin`（`convex/users.ts:611-653`）按 `email` 或 `username` 匹配 —— 用户输入的纯学号（如 `2300012929`）不会匹配到 `stu.pku.edu.cn` 后缀的邮箱。
- **后台不可改**，建议前端方案：在 `handleSubmit` 中，若输入不含 `@`，先用 `getByStudentId` 查询用户邮箱，再拿着邮箱去 login。

**涉及文件**: `src/app/login/page.tsx`, `src/lib/hooks/use-auth.ts`

---

## 3. 头像默认用证件照 + 名字不可改

**文件**: `src/app/settings/page.tsx:320-387`

- 目前「头像」(avatar) 和「真实照片」(realPhoto) 是两个独立的上传字段。
- 建议：去掉 avatar 上传，个人头像默认展示 realPhoto；如果 realPhoto 也没上传，显示首字母 fallback。
- 同时，中文名 (chineseName) 和英文名 (englishName) 在注册后不应随意修改 —— 建议将 settings 中这两个字段改为 `disabled`，或加一行说明「如需修改请联系管理员」。

**涉及文件**: `src/app/settings/page.tsx`, `src/app/members/[id]/page.tsx`, `src/app/members/page.tsx`

---

## 4. 个人设置 & 个人主页统一使用英文

**文件**: 
- `src/app/settings/page.tsx` — 标签中英混杂（如「头像」「真实照片」vs "English Name"）
- `src/app/members/[id]/page.tsx` — 包含中文文案（「返回成员列表」「研究兴趣」「链接」「学术成果」）

- settings 页面：所有 label 统一为英文，加一行提示 "We recommend using English on your profile to facilitate international communication."
- 个人主页（members/[id]/page.tsx）：所有界面文字改为英文。

**涉及文件**: `src/app/settings/page.tsx`, `src/app/members/[id]/page.tsx`

---

## 5. 成员自定义 URL slug

**文件**: `src/app/members/[id]/page.tsx`, `src/app/members/page.tsx`, `src/components/layout/navbar.tsx`

- 目前成员链接为 `/members/{convex_id}`（如 `jx71weq2zszfe3pss62gtd2trx85zp7z`）。
- 用户表中已有 `username` 字段（`convex/schema.ts:8`），可用于短链接（如 `/members/chenyinghan`）。
- **后台不可改（无法新增 `getByUsername` 查询）**，前端方案：
  - `members/[id]/page.tsx` 中先尝试 `getById`，若返回 null 则用 `useUsers()` 全量匹配 `username` 字段。
  - 同步更新 navbar、members 列表页中的链接，优先使用 `username`。

**涉及文件**: `src/app/members/[id]/page.tsx`, `src/app/members/page.tsx`, `src/components/layout/navbar.tsx`

---

## 6. 去掉「You've reached the inhabited」占位符

**文件**: `src/app/members/[id]/page.tsx:149-153`

```tsx
<MarkdownRenderer
  content={member.profileMarkdown || ""}
  emptyFallback="You've reached the inhabited"
/>
```

- `emptyFallback` 的值是一个无意义占位符，当用户未写 markdown 时展示。
- 建议改为空字符串 `""`，或给出更有意义的提示。

---

## 7. 个人主页布局调整：bio 移到右侧

**文件**: `src/app/members/[id]/page.tsx:55-201`

当前布局：
- 左侧（`lg:col-span-1`）：头像、名字、联系方式、**Bio**、研究兴趣、链接
- 右侧（`lg:col-span-2`）：**Markdown** → **学术成果**

建议改为：
- 左侧（`lg:col-span-1`）：头像、名字、组织、联系方式、研究兴趣、链接
- 右侧（`lg:col-span-2`）：从上到下依次 **Bio** → **学术成果** → **Markdown**

理由：bio 可能很长，放在左侧栏会挤占联系方式和链接的空间。

---

## 8. 研究方向筛选：增加预定义大方向

**文件**: `src/app/members/page.tsx:38-189`

- 目前「研究方向」筛选下拉选项来自所有用户自定义的 `researchInterests` 标签。
- 问题：标签太多太碎（每个人填法不同），筛选效果差。
- `src/lib/utils.ts:67-222` 中已有 `RESEARCH_AREAS` 常量，包含 15 个预定义方向（ML, DL, CV, NLP 等）。
- 建议：在筛选下拉中增加预定义大方向选项（放在最前面），与现有的动态标签并存。

**涉及文件**: `src/app/members/page.tsx`

---

## 9. 添加课程：增加提示文字

**文件**: `src/app/resources/page.tsx:121-147`

- 目前「添加课程」对话框只有课程名称输入框和一行说明「课程创建后，任意成员可在课程详情页补充不同教师、不同学期的具体评测」。
- 建议在此处追加提示：
  > 同学们只能创建培养方案以外的课程，请保持认真严肃，只能添加北京大学的真实课程。管理员保留删改的权利。

---

## 10. 课程测评提交功能故障

**文件**: `src/app/courses/reviews/page.tsx:152-230`, `convex/courseReviews.ts:158-248`

- **根因分析**: `convex/courseReviews.create` 中调用了 `ctx.auth.getUserIdentity()`（convex/courseReviews.ts:194）来验证登录态。但前端 auth 走的是 `localStorage` + `simpleLogin` + `getByEmail` 的方案，**并没有通过 Convex Auth 建立真实的 identity session**。因此 `getUserIdentity()` 返回 `null`，导致抛出 `"Authentication required to create course reviews"`。
- 这解释了为什么用户写的测评「提交后没了」—— 提交直接抛错，数据未入库。
- **修复需要后台配合**（在 Convex 中注册 identity provider 或放宽 auth 检查）。
- 此外：
  - 右上角「发布评测」按钮（行81）打开 dialog；dialog 内「取消」按钮（行225）用的 `window.history.back()` 在 dialog 场景下行为不对，应改为 `DialogClose`。
  - 「取消」和「提交评测」两个按钮位置不对称（行225-226）。

**涉及文件**: `convex/courseReviews.ts`（需后台配合）, `src/app/courses/reviews/page.tsx`

---

## 11. 评测审核中删除功能无效

**文件**: `src/app/admin/reviews/page.tsx:350-363`, `convex/courseReviews.ts:363-374`

- 前端 `handleDelete` 调用了 `useDeleteCourseReview()` mutation，经过确认对话框后执行 `deleteReview({ id })`。
- `convex/courseReviews.remove` 逻辑本身看起来没问题（按 id 删除 + 同步课程统计）。
- 可能原因：(1) `deleteReview` mutation 返回时抛错但前端没有 catch 展示错误；(2) 权限校验问题；(3) `useDeleteCourseReview()` 在 `api.ts:342` 使用了 `toIdArg` 转换，如果 id 格式不对可能传参失败。
- 建议在 `handleDelete` 加 try-catch 并显示 toast 错误信息，排查具体原因。

**涉及文件**: `src/app/admin/reviews/page.tsx`, `src/lib/api.ts:342-345`

---

## 12. 新闻支持链接到公众号文章

**文件**: 待确认

- 目前新闻是完整的内容 + 标题模式，适合原创文章。
- 建议在新闻编辑器中增加「外部链接」字段（或约定内容第一行为链接），方便直接引用公众号文章（如 `https://mp.weixin.qq.com/s/...`）。
- 如果不方便改 schema，可在新闻列表/详情页中检测内容是否为纯 URL，自动渲染为链接卡片。
- 或引入微信文章转换插件，将公众号链接的内容 fetch 过来展示。

---

## 13. 个人设置无法改用户名

**文件**: `src/app/settings/page.tsx`

- settings 页面中缺少 `username` 编辑字段。
- `convex/users.update` mutation 已支持 `username` 参数（convex/users.ts:283），前端只需加一个输入框即可。

---

## 14. 新增「资源」页面

**文件**: `src/app/resources/page.tsx`, `src/components/layout/navbar.tsx`

- `/resources` 路由已存在，页面内容为课程管理（当前被 `/courses` 直接引用渲染）。
- 建议在 navbar 中添加独立的「Resources」（资源）导航项，与 课程/活动 等平级，用于外部分享链接、生存指南等公开资料。

---

## 15. （低优先级）Intranet / 匿名树洞

- 在 navbar 中新增「Intranet」入口，仅登录可见。
- 包含功能：匿名树洞、导师红黑榜、匿名吐槽等。
- 需要新的数据表和页面，工作量大，优先级靠后。

---

## Bug 汇总表

| # | 问题 | 严重程度 | 后台依赖 |
|---|------|----------|----------|
| 1 | 改密码：明文 + toast + 自动登出 | 中 | 否 |
| 2 | 登录简化：仅需学号 | 高 | 否（前端可解决） |
| 3 | 头像默认证件照 + 名字锁定 | 中 | 否 |
| 4 | 个人设置/主页统一英文 | 低 | 否 |
| 5 | 成员自定义 slug URL | 中 | **是**（需 getByUsername 查询） |
| 6 | 去掉占位符文字 | 低 | 否 |
| 7 | 个人主页布局调整 | 中 | 否 |
| 8 | 研究方向增加预定义筛选 | 中 | 否 |
| 9 | 添加课程提示文字 | 低 | 否 |
| 10 | **课程测评提交失效** | **高** | **是**（Convex Auth identity） |
| 11 | 评测审核删除无效 | 高 | 待排查 |
| 12 | 新闻支持公众号链接 | 低 | 可能需 schema |
| 13 | 个人设置缺用户名字段 | 中 | 否 |
| 14 | 新增 Resources 页面 | 低 | 否 |
| 15 | Intranet 匿名树洞 | 低 | 是（新功能） |
