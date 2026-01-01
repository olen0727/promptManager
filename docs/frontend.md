# 前端架構 (Frontend Architecture)

前端架構緊密圍繞 **Next.js 15 App Router**、**TanStack Query** 和 **Server Components** 展開，旨在實現極致的效能和優秀的使用者體驗。

## 資料流向 (Data Flow)

在 App Router 中，資料獲取可以發生在伺服器端（RSC）也可以發生在用戶端（Client Components）。

```mermaid
graph TD
    subgraph Server["Server (Next.js)"]
        RSC[Server Component (page.tsx)]
        Prefetch[tRPC Caller (Prefetch)]
        Dehydrate[Dehydrate State]
    end

    subgraph Client["Client (Browser)"]
        Provider[TanStack Query Provider]
        Hydrate[Hydrate State]
        CC[Client Component (PromptList.tsx)]
        Hook[useTRPC Hook]
    end

    RSC -- "1. Prefetch Data" --> Prefetch
    Prefetch -- "2. Pass to Client" --> Dehydrate
    Dehydrate -- "3. Serialize JSON" --> Provider
    Provider -- "4. Hydrate Cache" --> Hydrate
    Hydrate -- "5. Initial Render" --> CC
    CC -- "6. Refetch/Mutate (Interaction)" --> Hook
    Hook -- "7. Background Update" --> Provider
```

### 1. 混合渲染策略 (Hybrid Rendering)
*   **首屏載入 (Initial Load)**: 利用 Server Components 在伺服器端直接呼叫 tRPC (`server/trpc/server.ts`) 獲取資料。資料被序列化並傳遞給用戶端的 `HydrationBoundary`。
*   **用戶端互動 (Interaction)**: 頁面載入後，Client Components 接管。使用者點擊翻頁或搜尋時，透過 `useTRPC` Hook 發起 HTTP 請求更新資料。
*   **優勢**: 結合了 SSR 的 SEO/首屏速度優勢和 SPA 的互動體驗。

## UI 元件體系 (Component System)

我們採用 **Headless UI + Utility CSS** 的現代組合。

### 1. Tailwind CSS 最佳實踐
*   **Utility-First**: 不寫 `.card { ... }`，而是寫 `p-4 rounded-xl shadow-sm`。這減少了 CSS 體積增長，避免了命名困難。
*   **Design Tokens**: 在 `tailwind.config.ts` 中定義顏色、字體、圓角等 Design Tokens。
    ```typescript
    // tailwind.config.ts
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))", // 引用 CSS 變數
          foreground: "hsl(var(--primary-foreground))",
        },
      }
    }
    ```
*   **Dark Mode**: 使用 CSS 變數 (`globals.css`) 實作深色模式切換，而不是使用 Tailwind 的 `dark:` 前綴（這使得程式碼更整潔）。

### 2. shadcn/ui 架構
*   **Copy-Paste Philosophy**: 元件程式碼直接存在於專案中 (`src/components/ui`)。如果您需要修改 Button 的圓角？直接改 `button.tsx`。
*   **Radix UI**: 這是一個無頭元件庫 (Headless UI Library)，處理了複雜的互動邏輯（如 Dialog 的焦點捕捉、Dropdown 的鍵盤導覽）。shadcn/ui 只是給 Radix UI 加上了 Tailwind 的外貌。
*   **`cn` Helper**: 核心工具函式。
    ```typescript
    import { clsx, type ClassValue } from "clsx"
    import { twMerge } from "tailwind-merge"

    // 合併類名，處理條件邏輯 (clsx)，並解決 Tailwind 衝突 (twMerge)
    export function cn(...inputs: ClassValue[]) {
      return twMerge(clsx(inputs))
    }
    ```

## 狀態管理 (State Management)

### 1. TanStack Query (Server State)
我們幾乎不使用 `useEffect` 來獲取資料。TanStack Query 處理了所有伺服器端狀態。
*   **Stale-While-Revalidate**: 預設設定下，資料被認為是「陳舊」的，但會在背景靜默刷新。
*   **Window Focus Refetching**: 使用者切出標籤頁再切回來時，會自動刷新資料。
*   **Optimistic Updates**: 在 Mutation 發送前，先手動更新快取 (Cache)，讓 UI 立即回應。如果請求失敗，會自動回滾。

### 2. URL State (Client State)
對於搜尋框、分頁、篩選等狀態，我們優先將其同步到 URL Search Params 中，而不是使用 `useState`。
*   **好處**: 使用者刷新頁面或分享連結時，狀態（如搜尋關鍵字）能得以保留。
*   **實作**: 使用 `useSearchParams` 和 `useRouter`。

## 圖示系統
使用 `lucide-react`。
*   **特點**: 風格統一、體積小。
*   **使用**: `<IconName className="w-4 h-4" />`。
