# PromptManager 🚀

**PromptManager** 是一個現代化的 Prompt 管理工具，專為 AI 繪圖與大型語言模型使用者設計。協助您有效率地整理、分類、測試與迭代您的 Prompt 庫。


## ✨ 主要功能 (Features)

- **現代化介面**：採用 Material Design 3 風格，支援響應式設計，提供流暢的互動體驗。
- **變數系統**：
    - 支援 `{{變數名稱}}` 語法，快速替換關鍵詞。
    - 支援 `{{變數名稱:選項A,選項B}}` 下拉選單語法，建立標準化模板。
- **動態預覽**：輸入變數後即時預覽最終組合出的 Prompt。
- **標籤管理**：支援自定義標籤與顏色，快速篩選與分類。
- **一鍵複製**：智慧複製功能，自動填入變數值。
- **圖片支援**：可為每個 Prompt 上傳參考圖或生成結果圖，圖片支援URL、本地檔案上傳、剪貼簿貼上。
- **雲端同步**：整合 Supabase，資料安全儲存在雲端，支援 Google / GitHub 登入。

## 🛠️ 技術棧 (Tech Stack)

| 層級 | 技術 | 版本 |
|------|------|------|
| **框架** | Next.js (App Router + Turbopack) | 15.x |
| **語言** | TypeScript (Strict Mode) | 5.x |
| **UI** | React 19 + Tailwind CSS + shadcn/ui | 19.x |
| **API** | tRPC v11 | 11.x |
| **資料庫** | Supabase (PostgreSQL + Auth + RLS) | - |
| **部署** | Vercel | - |

## 🚀 快速開始 (Quick Start)

### 1. 安裝依賴

```bash
pnpm install
```

### 2. 設定環境變數

請複製 `.env.example` 為 `.env.local` 並填入以下資訊：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 啟動開發伺服器

```bash
pnpm dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)。

## 📖 使用指南 (User Guide)

1.  **登入**：點擊首頁的 "Sign in" 使用 Google 或 GitHub 帳號登入。
2.  **儀表板 (Dashboard)**：登入後會看到您的 Prompt 列表，新用戶會自動獲得一則「示範 Prompt」。
3.  **新增 Prompt**：
    -   點擊右下角的 **+** 浮動按鈕 (FAB)。
    -   填寫標題、內容。
    -   在內容中使用 `{{...}}` 定義變數。
    -   上傳參考圖片 (選填)。
    -   設定標籤。
4.  **使用變數**：
    -   在列表卡片上，您會看到變數輸入框。
    -   輸入數值或選擇選項後，點擊「複製」按鈕即可取得完整 Prompt。
5.  **搜尋與篩選**：上方搜尋列可即時過濾標題或標籤。


## 📂 專案結構

```
src/
├── app/                    # Next.js App Router 頁面
├── components/            # React 元件 (UI, Prompts, Layout)
├── lib/                   # 工具函數與 Supabase Client
├── server/               # 伺服器端程式碼 (tRPC Routers)
└── middleware.ts         # 路由保護中間件
```

## 🔮 未來規劃 (Roadmap)


### Features
- [ ] **分類管理**：支援自定義分類，快速篩選與分類。
- [ ] **tag管理**：支援自定義標籤與顏色。
- [ ] **AI 自動生成**：整合 LLM API，協助優化或自動生成 Prompt 描述。
- [ ] **版本控制**：記錄 Prompt 的修改歷史，隨時還原舊版本。
- [ ] **資料匯入/匯出**：支援 CSV/JSON 格式備份資料。
- [ ] **多語言介面**：支援英文與其他語系切換。

## 📜 License

MIT
