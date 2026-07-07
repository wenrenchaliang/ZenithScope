# ZenithScope｜天顶之眼

ZenithScope｜天顶之眼是一个教学型数据可视化大屏项目，用纯前端工程展示如何从页面布局、图表封装、mock 数据到自动化测试，搭建一个完整的数据大屏示例。

## 项目预览

![ZenithScope 天顶之眼](docs/screenshots/dashboard-1920x1080.png?v=20260707-blue)

当前界面采用“蓝色现代数据指挥台”视觉风格，包含深蓝玻璃背景、克制的数据面板、实时指标、ECharts 图表和模拟数据刷新效果。截图文件位于 `docs/screenshots/dashboard-1920x1080.png`。

## 项目简介

本项目面向前端初学者、数据可视化学习者、课程实践和 AI 辅助编程课堂案例。它不是商业化后台系统，也没有默认接入真实后端；当前重点是把一个大屏项目拆成可学习、可运行、可测试的前端工程结构。

项目页面通过 MSW 提供 mock API，业务组件不直接读取 mock 数据，而是经过 `dashboardApi`、`httpClient` 和 TanStack Query 获取数据。这样既方便本地教学演示，也为后续切换真实 API 留出清晰边界。

## 核心特性

- 纯前端数据大屏：基于 Vite、React 和 TypeScript 构建。
- 16:9 大屏布局：面向 1920x1080 展示场景设计主页面。
- ECharts 图表封装：统一封装基础图表组件和图表主题。
- mock API 数据层：使用 MSW 拦截 `/api/dashboard/*` 接口。
- 模拟实时变化：指标、趋势、节点、告警、动态和资源状态会按轮询刷新。
- 状态管理示例：使用 Zustand 控制“自动刷新 / 暂停刷新”状态。
- 查询层示例：使用 TanStack Query 管理多个 Dashboard 数据请求。
- 自动化测试：包含 Vitest 单元测试、React Testing Library 组件测试和 Playwright E2E 测试。
- 自动化截图：提供脚本生成 `docs/screenshots/dashboard-1920x1080.png`。
- 工程规范：配置 TypeScript strict、ESLint 和 Prettier。

## 技术栈

| 方向 | 当前使用 |
| --- | --- |
| 前端框架 | React 19、React DOM |
| 构建工具 | Vite 8 |
| 开发语言 | TypeScript 6 |
| 图表 | Apache ECharts |
| 数据请求与缓存 | TanStack Query |
| mock 数据 | MSW |
| 状态管理 | Zustand |
| 单元与组件测试 | Vitest、React Testing Library、jest-dom、user-event |
| E2E 测试与截图 | Playwright |
| 代码质量 | ESLint、Prettier、TypeScript strict |

## 页面内容

当前 Dashboard 页面入口为 `src/pages/DashboardPage/DashboardPage.tsx`，主应用入口为 `src/app/App.tsx`。页面由以下模块组成：

- 顶部标题、运行状态、日期时间与自动刷新开关
- 核心指标卡片：今日访问量、实时任务数、活跃用户数、系统健康度
- 实时访问与任务趋势图
- 学习节点热度排行
- 天顶数据中枢节点图与摘要
- 实时告警列表
- 实时动态时间线
- 资源状态面板

## 实时数据模拟

项目已经实现前端 mock 实时数据模拟，核心逻辑位于 `src/shared/mock/realtimeDashboardSimulator.ts`。TanStack Query 在自动刷新开启时每 2 秒重新请求数据，MSW handler 会返回模拟器中的当前数据帧。

当前会模拟变化的内容包括：

- 顶部核心指标数值和涨跌幅
- 实时访问与任务趋势窗口
- 天顶数据中枢节点活跃指数、访问量和互动任务
- 实时动态列表
- 实时告警列表
- CPU、内存、网络、存储资源状态

这些数据仍然是浏览器端 mock 数据，不代表真实后端或真实业务监控数据。

## 项目结构

```text
.
├─ docs/
│  └─ screenshots/                 # 项目截图
├─ e2e/                             # Playwright E2E 测试
├─ public/                          # 静态资源与 MSW worker
├─ scripts/
│  └─ capture-dashboard.mjs         # 自动化截图脚本
├─ src/
│  ├─ app/                          # 应用入口、Provider、全局样式
│  ├─ features/dashboard/           # Dashboard 类型、API、query hook、适配逻辑
│  ├─ pages/DashboardPage/          # 大屏页面入口与页面样式
│  ├─ shared/                       # API、mock、chart、store、ui、utils 等共享模块
│  ├─ tests/                        # Vitest 测试与 setup
│  └─ widgets/                      # Header、指标卡、图表、告警、排行等业务组件
├─ package.json
├─ playwright.config.ts
├─ tsconfig.json
└─ vite.config.ts
```

## 快速开始

环境要求：

- Node.js：建议使用当前 Vite 版本可支持的 LTS 或较新版本。
- npm：项目已包含 `package-lock.json`，推荐使用 npm 安装依赖。

安装依赖：

```bash
npm install
```

启动开发服务，统一使用 10001 端口：

```bash
npm run dev -- --host 127.0.0.1 --port 10001
```

浏览器访问：

```text
http://127.0.0.1:10001/
```

## 常用命令

以下命令均来自当前 `package.json`：

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动 Vite 开发服务 |
| `npm run build` | 执行 TypeScript 构建并打包生产文件 |
| `npm run preview` | 本地预览生产构建结果 |
| `npm run screenshot` | 生成 Dashboard 截图 |
| `npm run screenshot:dashboard` | 生成 Dashboard 截图，和 `screenshot` 使用同一脚本 |
| `npm run test` | 运行 Vitest 测试 |
| `npm run test:ui` | 启动 Vitest UI |
| `npm run test:e2e` | 运行 Playwright E2E 测试 |
| `npm run lint` | 运行 ESLint |
| `npm run format` | 使用 Prettier 格式化项目文件 |
| `npm run typecheck` | 执行 TypeScript 类型检查 |
| `npm run quality` | 依次运行 typecheck、lint、test、build |

## 数据源说明

开发环境默认启用 MSW mock：

```ts
enableMocking: import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW !== 'false'
```

当前 mock 接口包括：

- `GET /api/dashboard/overview`
- `GET /api/dashboard/trends`
- `GET /api/dashboard/regions`
- `GET /api/dashboard/alerts`
- `GET /api/dashboard/resources`
- `GET /api/dashboard/timeline`

数据流为：

```text
Dashboard 组件 -> useDashboardQueries -> dashboardApi -> httpClient -> /api/dashboard/*
```

如需关闭 MSW 并尝试连接真实 API，可以设置：

```bash
VITE_ENABLE_MSW=false
VITE_API_BASE_URL=https://api.example.com
```

前提是目标 API 返回的数据结构与 `src/features/dashboard/types.ts` 中定义的类型保持一致。当前仓库没有内置真实后端服务。

## 自动化截图

项目已经提供截图脚本：

```bash
npm run screenshot
```

脚本会访问默认地址：

```text
http://127.0.0.1:10001/
```

默认输出：

```text
docs/screenshots/dashboard-1920x1080.png
```

运行截图命令前需要先启动开发服务：

```bash
npm run dev -- --host 127.0.0.1 --port 10001
```

也可以通过 `DASHBOARD_URL` 指定截图目标地址。

## 测试与质量保障

当前项目已经配置并使用以下质量保障方式：

- TypeScript strict：通过 `npm run typecheck` 检查类型。
- ESLint：通过 `npm run lint` 检查代码问题。
- Prettier：通过 `npm run format` 统一格式。
- Vitest：覆盖工具函数、Dashboard 数据适配、mock API 和实时模拟器。
- React Testing Library：覆盖核心指标卡组件渲染。
- Playwright：检查 Dashboard 页面核心内容和基础运行状态。
- 构建验证：通过 `npm run build` 执行类型构建和生产打包。

提交或展示前建议运行：

```bash
npm run quality
npm run test:e2e
```

## 适合学习什么

通过这个项目，初学者可以重点学习：

- 数据大屏项目的目录组织方式
- 16:9 大屏页面布局与响应式约束
- ECharts 在 React 中的基础封装方式
- mock 数据、API service 和页面组件之间的分层
- TanStack Query 的多接口查询与轮询刷新
- Zustand 在局部 UI 状态中的使用
- 前端模拟实时数据变化的实现方式
- Vitest、React Testing Library 与 Playwright 的基本测试组合
- 自动化截图在开源展示和课程材料中的使用
- 用工程化方式维护教学项目，而不是只写静态页面

## 后续计划

这些方向适合作为后续课程或迭代内容：

- 接入真实 API 示例，并补充字段映射说明。
- 增加更多图表组件，例如占比图、雷达图、地图或关系网络。
- 增加主题切换能力。
- 增加视觉回归测试，降低大屏样式回退风险。
- 增加部署示例和公开预览地址。
- 完善课程讲解文档、步骤拆解和练习任务。

## License

本项目使用 MIT License，详见 [LICENSE](LICENSE)。
