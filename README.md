# ZenithScope 天顶之眼

ZenithScope 是一个纯前端数据可视化大屏项目，第一阶段聚焦“城市运行监控 / 智慧运维 / 全域态势感知”。当前数据通过 MSW mock API 提供，页面层只依赖 service/query hook，后续可以把接口切到真实 API。

本项目保留 MIT License。

## 技术栈

- Vite + React + TypeScript
- Apache ECharts
- TanStack Query
- MSW
- Zustand
- Vitest + React Testing Library
- Playwright
- ESLint + Prettier + TypeScript strict

## 本地运行

```bash
npm install
npm run dev
```

默认访问 `http://localhost:5173`。开发环境默认启用 MSW mock。

如需临时关闭 mock：

```bash
VITE_ENABLE_MSW=false npm run dev
```

真实 API 地址可以通过 `VITE_API_BASE_URL` 注入，例如：

```bash
VITE_API_BASE_URL=https://api.example.com npm run dev
```

## 常用脚本

- `npm run dev`：启动开发服务
- `npm run build`：TypeScript 编译并构建生产包
- `npm run preview`：预览生产构建
- `npm run test`：运行 Vitest
- `npm run test:e2e`：运行 Playwright 端到端测试
- `npm run lint`：运行 ESLint
- `npm run format`：运行 Prettier 格式化
- `npm run typecheck`：运行 TypeScript strict 检查
- `npm run quality`：依次执行 typecheck、lint、test、build

## 目录结构

```text
src/
  app/                 应用入口、Provider、全局样式
  pages/               页面级模块
  widgets/             大屏业务组件
  features/dashboard/  Dashboard API、query hook、类型和适配逻辑
  shared/api/          httpClient 和 endpoint
  shared/chart/        ECharts 基础封装和图表主题
  shared/config/       环境变量读取
  shared/logger/       统一日志封装
  shared/mock/         MSW browser、handlers 和 mock 数据
  shared/store/        少量全局 UI 状态
  shared/ui/           通用 UI 组件
  shared/utils/        工具函数
  tests/               Vitest/RTL 测试配置与单元测试
e2e/                   Playwright 测试
```

## Mock/API 切换说明

当前 mock 接口路径接近真实后端：

- `GET /api/dashboard/overview`
- `GET /api/dashboard/trends`
- `GET /api/dashboard/regions`
- `GET /api/dashboard/alerts`
- `GET /api/dashboard/resources`
- `GET /api/dashboard/timeline`

页面组件不直接读取 mock 数据。数据流为：

`组件 -> useDashboardQueries -> dashboardApi -> httpClient -> endpoint`

切换真实 API 时，优先设置 `VITE_ENABLE_MSW=false` 和 `VITE_API_BASE_URL`，接口字段保持一致即可。

## 测试和代码质量

项目开启 TypeScript strict。关键工具函数、Dashboard 数据适配逻辑、核心指标卡组件均有 Vitest/RTL 覆盖；Playwright 包含首页基础可见性检查。

提交前建议运行：

```bash
npm run quality
```
