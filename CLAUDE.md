# CLAUDE.md — 项目文档

> 供 Claude Code 在新对话中快速上手使用。

---

## 项目概览

这是 **spectual.ai** 的个人主页，一个终端风格的 AI 个人简历/助手网站。访客可以与 AI 助手对话了解作者信息，也可以浏览项目、简历页面。

**线上地址**：https://www.spectual.ai

**核心特色**：
- 终端 / 黑客风格 UI，Matrix 雨动画背景
- 内嵌 AI 聊天助手（基于 RAG，了解作者个人信息）
- GitHub 动态展示、项目技术栈筛选
- Boot 启动动画 → 主界面过渡

---

## 技术栈

### 前端
| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.2 | UI 框架 |
| TypeScript | 5.3 | 类型安全（已开启 strictNullChecks） |
| Vite | 5.0 | 构建工具 |
| Tailwind CSS | 3.4 | 样式 |
| React Router DOM | 6.20 | 路由（BrowserRouter） |
| TanStack Query | 5.17 | 服务端状态管理 |
| Radix UI | 多个 | 无障碍 UI 组件 |
| react-markdown + remark-gfm | 最新 | Markdown 渲染 |

### 后端
| 技术 | 用途 |
|------|------|
| Flask + flask-cors | HTTP 服务 |
| OpenAI API | LLM 对话 |
| ChromaDB | 向量数据库（RAG） |
| python-dotenv | 环境变量 |

后端入口：`backend/app.py`，RAG 系统：`backend/rag_system.py`，个人数据：`backend/personal_data.json`

---

## 目录结构

```
/
├── src/
│   ├── App.tsx                # 路由配置、ErrorBoundary、懒加载
│   ├── main.tsx
│   ├── components/
│   │   ├── BootSequence.tsx   # 启动动画，完成后触发 onComplete
│   │   ├── ChatSection.tsx    # AI 聊天区，含历史命令 ↑↓
│   │   ├── MatrixRain.tsx     # Canvas Matrix 雨动画（isMobile 响应式）
│   │   ├── MessageBubble.tsx  # 聊天气泡，含 scrollIntoView
│   │   ├── TerminalHeader.tsx # 终端顶部栏（独立组件）
│   │   ├── TerminalFooter.tsx # 底部
│   │   ├── ProfileSection.tsx # 个人信息
│   │   ├── GetInTouchSection.tsx # 联系方式（集中管理联系信息）
│   │   └── ui/               # shadcn/ui 组件
│   ├── pages/
│   │   ├── Index.tsx          # 主页（Boot → 主界面）
│   │   ├── Projects.tsx       # 项目页（含技术栈筛选器）
│   │   ├── Resume.tsx         # 简历页（懒加载）
│   │   └── NotFound.tsx       # 404 页
│   ├── hooks/
│   │   ├── useTypewriter.ts   # 打字机效果（setTimeout 递归实现）
│   │   ├── use-mobile.tsx     # 移动端检测
│   │   └── use-toast.ts       # Toast 通知
│   ├── types/
│   │   └── chat.ts            # Message 接口统一定义
│   ├── data/                  # 静态数据
│   ├── lib/                   # 工具函数
│   └── utils/
├── public/
│   ├── CNAME                  # www.spectual.ai（GitHub Pages 自定义域名）
│   └── 404.html               # BrowserRouter SPA 重定向脚本
├── backend/
│   ├── app.py                 # Flask 主服务
│   ├── rag_system.py          # ChromaDB RAG 系统
│   ├── personal_data.json     # 个人信息数据源
│   └── requirements.txt
├── vite.config.ts             # base: '/'
└── tsconfig.app.json          # strictNullChecks: true
```

---

## 部署配置

### 前端：GitHub Pages + Cloudflare

- **构建**：`npm run build` → `dist/`
- **部署分支**：`gh-pages`（通过 `npm run deploy` 或手动推送）
- **自定义域名**：`public/CNAME` 内容为 `www.spectual.ai`

**Cloudflare DNS 配置**：
| 类型 | 名称 | 内容 | 代理状态 |
|------|------|------|---------|
| A | spectual.ai | 185.199.108.153 | Proxied（橙云） |
| A | spectual.ai | 185.199.109.153 | Proxied |
| A | spectual.ai | 185.199.110.153 | Proxied |
| A | spectual.ai | 185.199.111.153 | Proxied |
| CNAME | www | spectual.github.io | DNS only（灰云）|

**Cloudflare 重定向规则**（Rules → Redirect Rules）：
- 匹配：`spectual.ai/*`（或 hostname = spectual.ai）
- 动作：301 永久重定向 → `https://www.spectual.ai/`
- 目的：裸域自动跳转到 www 子域

**关键说明**：CNAME 文件必须是 `www.spectual.ai` 而非 `spectual.ai`，否则 Cloudflare Proxied 模式下裸域重定向会失败。

### 后端：Railway

- 服务名：`ai-assistant`
- 启动命令：`python app.py`
- 目录：`backend/`
- 环境变量：`OPENAI_API_KEY`、`PORT`（Railway 自动注入）
- 前端通过环境变量 `VITE_API_URL` 指向 Railway 服务地址

### BrowserRouter SPA 路由支持

GitHub Pages 不支持客户端路由，通过两个机制解决：
1. `public/404.html`：将所有 404 请求重定向回 `index.html`，保留路径信息
2. `index.html` 中有对应的解析脚本恢复路径

---

## 已完成的优化记录

### 第一轮：高优先级重构

1. **提取 TerminalHeader 组件** — 从 Index.tsx 抽出独立组件 `src/components/TerminalHeader.tsx`
2. **统一 Message 接口** — 创建 `src/types/chat.ts`，所有消息类型从这里导入
3. **联系信息集中管理** — `GetInTouchSection.tsx` 中集中定义，避免多处散落
4. **JS hover 改 CSS** — 移除 onMouseEnter/Leave，改用 Tailwind hover: 类
5. **无障碍修复** — `<label htmlFor>` 关联输入框，聊天区加 `aria-live="polite"`
6. **MessageBubble scrollIntoView** — 新消息自动滚动到可见区域
7. **MatrixRain isMobile resize 修复** — 窗口 resize 时正确更新移动端状态
8. **OG 图片改绝对路径** — `og:image` 使用完整 URL 而非相对路径

### 第二轮：中低优先级优化

1. **useTypewriter 改 setTimeout 递归** — 避免 setInterval 闭包陷阱，更精确控制打字速度
2. **路由懒加载** — `Resume`、`Projects` 页面用 `React.lazy + Suspense` 包裹，减少首屏 bundle
3. **SkillBar IntersectionObserver 合并** — 多个技能条共享单个 Observer 实例
4. **消息 ID 改 `crypto.randomUUID()`** — 替代 `Date.now()` 避免碰撞
5. **列表 key 改 `project.name`** — 使用稳定唯一标识符
6. **字体预加载** — `index.html` 中加 `<link rel="preload">` 提升 LCP
7. **BootSequence 过渡优化** — 动画结束时平滑淡出
8. **聊天历史命令** — 输入框支持 ↑/↓ 键切换历史记录

### 第三轮：功能增强

1. **strictNullChecks 开启** — `tsconfig.app.json` 中启用，修复了所有相关类型错误
2. **HashRouter 改 BrowserRouter** — 更干净的 URL（去掉 `#`），配合 `public/404.html` 重定向
3. **GitHub 动态展示组件** — 调用 GitHub API 展示最近 commits/contributions
4. **Projects 技术栈筛选器** — 标签筛选功能，支持多选

### Bug 修复

- **CLI 动画换行布局偏移**：BootSequence 中打字机动画文字换行导致页面抖动，修复方案：设置容器 `height: 3.6em; overflow: hidden`，固定高度防止回流
- **CNAME 域名修复**：CNAME 从 `spectual.ai` 改为 `www.spectual.ai`，配合 Cloudflare 重定向规则

---

## 待办 / 可改进项

- [ ] **中英双语支持** — i18n 国际化，切换语言
- [ ] **浏览器内 ML demo** — 使用 Transformers.js 在前端跑轻量模型
- [ ] **后端改 SSE 流式响应** — AI 回复逐字流式输出，提升体验
- [ ] **聊天记录导出** — 支持导出对话为 Markdown / JSON
- [ ] **深色/浅色主题切换**（当前只有深色）

---

## 常用命令

```bash
# 前端开发
npm run dev          # 本地开发服务器
npm run build        # 构建生产版本
npm run lint         # ESLint 检查

# 后端开发
cd backend
pip install -r requirements.txt
python app.py        # 本地启动 Flask（默认 5000 端口）

# 部署
git push origin main  # 触发 CI 或手动构建
# gh-pages 分支通过构建产物推送
```

---

## 注意事项

- `public/CNAME` 内容必须是 `www.spectual.ai`（带 www），不能是裸域
- 前端 `vite.config.ts` 中 `base: '/'` 与自定义域名配合（不是子路径部署）
- 后端 CORS 已全局启用（`CORS(app)`），生产环境可按需收紧为特定 origin
- `backend/personal_data.json` 包含个人信息，不提交到公开仓库（已在 .gitignore）
