# 工具鏈與設定 (Tools & Configuration)

優秀的專案離不開強大的工具鏈支援。本專案的技術選型注重**速度**和**開發者體驗 (DX)**。

## 1. Biome (Linting & Formatting)

[Biome](https://biomejs.dev/) 是 Web 開發的下一代工具鏈。

### 為什麼選擇 Biome?
*   **速度**: 基於 Rust 編寫，在大專案中比 Prettier 快 35 倍，比 ESLint 快 100 倍。
*   **零設定**: 預設設定已經非常合理，開箱即用。
*   **統一**: 解決了 "Prettier 和 ESLint 規則衝突" 這個長期存在的痛點。

### 核心功能
*   **Linter**: 靜態分析程式碼，捕捉潛在 Bug（如 `noExplicitAny`，`useExhaustiveDependencies`）。
*   **Formatter**: 固定的程式碼風格（2 空格縮排，雙引號，尾隨逗號等）。
*   **Organizer**: 自動根據規範排序 import 語句，保持程式碼整潔。

### 常用命令
```bash
pnpm lint      # 檢查程式碼
pnpm lint:fix  # 自動修復
pnpm format    # 僅格式化
```

## 2. Vitest (Testing)

[Vitest](https://vitest.dev/) 是專為 Vite 生態設計的單元測試框架。

### 架構優勢
*   **Vite Native**: 它直接使用 `vite.config.ts` (或 `vitest.config.ts`)。這意味著您專案裡的路徑別名 (`@/lib/utils`)、套件處理、環境變數載入，在測試中完全一致。無需像 Jest 那樣設定 `babel` 或 `ts-jest`。
*   **Watch Mode**: 利用 Vite 的 HMR 技術，測試檔案的重新執行幾乎是即時的。
*   **相容性**: 提供了相容 Jest 的 API (`describe`, `it`, `expect`, `vi.fn()`)，遷移成本極低。

### 最佳實踐
*   **單元測試**: 測試純函式 (`src/lib/utils.ts`) 和獨立的 UI 元件。
*   **整合測試**: 測試 tRPC Router (`src/server/trpc/routers/*.test.ts`)。我們可以 mock 資料庫層，直接測試業務邏輯。

## 3. Husky & Lint-staged (Git Hooks)

為了防止不乾淨的程式碼提交到儲存庫，我們在 Git 流程中設置了檢查點。

*   **Husky**: 管理 Git Hooks。
*   **Lint-staged**: 這是一個過濾器。它只提取本次 Commit 修改過的檔案列表，並傳給後續命令。
    *   **設定**:
        ```json
        "*.{ts,tsx,js,jsx}": [
          "biome check --write"
        ]
        ```
    *   **流程**: `git commit` -> `husky` 觸發 -> `lint-staged` 找到修改的 `.ts` 檔案 -> 執行 `biome check --write` -> 如果修復了程式碼，自動 `git add` -> 完成提交。如果無法修復（如邏輯錯誤），則提交失敗。

## 4. 環境變數型別安全

檔案：`src/lib/env.ts`

在 Next.js 中，環境變數 (`process.env`) 預設是 `string | undefined`。這很容易導致執行階段錯誤。
我們使用 `zod` 函式庫來驗證環境變數：
1.  **定義 Schema**: 定義哪些變數是必須的，格式是什麼（如 URL）。
2.  **執行階段驗證**: 應用程式啟動時立即檢查。如果缺少 `NEXT_PUBLIC_SUPABASE_URL`，應用程式直接崩潰並印出清晰的錯誤資訊，而不是等到使用者點擊登入時才報錯。
3.  **型別推導**: 匯出的 `env` 物件具有精確的 TypeScript 型別。

## 5. TypeScript 設定

*   **Strict Mode**: 開啟所有嚴格檢查（`noImplicitAny`, `strictNullChecks` 等）。
*   **Path Aliases**:
    ```json
    "paths": {
      "@/*": ["./src/*"]
    }
    ```
    這消除了 `../../../../components/ui/button` 這種地獄式引用 (Import Hell)。
