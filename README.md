# PromptManger

Prompt 管理器

## Tech Stack

| 層級 | 技術 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router + Turbopack) | 15.x |
| 執行階段 | Node.js / pnpm | - |
| UI | React + Tailwind CSS + shadcn/ui | 19.x |
| API | tRPC (新 TanStack 整合) | 11.x |
| 資料層 | TanStack Query | 5.x |
| 資料庫 | Supabase (PostgreSQL + Auth + RLS) | - |
| 檢查/格式化 | Biome | 1.9.x |
| 語言 | TypeScript (Strict Mode) | 5.6.x |

## 專案結構

```
src/
├── app/                    # Next.js App Router 頁面
│   ├── api/trpc/          # tRPC HTTP 處理器
│   └── ...
├── components/            # React 元件
│   ├── ui/               # shadcn/ui 元件
│   └── providers/        # Context 提供者
├── lib/                   # 工具函數
│   ├── supabase/         # Supabase 用戶端
│   └── utils.ts
├── server/               # 伺服器端程式碼
│   └── trpc/
│       ├── routers/      # tRPC 路由
│       ├── client.ts     # 用戶端 tRPC
│       └── server.ts     # 伺服器端 tRPC
└── middleware.ts         # Next.js 中間件
```

## 可用腳本

```bash
pnpm dev        # 啟動開發伺服器 (Turbopack)
pnpm build      # 建構生產版本
pnpm start      # 啟動生產伺服器
pnpm lint       # 執行 Biome 檢查
pnpm lint:fix   # 修復可自動修復的問題
pnpm format     # 格式化程式碼
pnpm typecheck  # TypeScript 型別檢查
```
