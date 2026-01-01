"use client";

import {
  ArrowRight,
  Code2,
  Database,
  Github,
  Layers,
  Lock,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const techStack = [
    {
      category: "前端開發",
      icon: <Layers className="w-5 h-5" />,
      items: [
        { name: "Next.js 15", desc: "App Router 架構 + Turbopack" },
        { name: "React 19", desc: "支援最新特性" },
        { name: "TypeScript", desc: "型別安全" },
        { name: "Tailwind CSS", desc: "原子化樣式" },
      ],
    },
    {
      category: "後端開發",
      icon: <Code2 className="w-5 h-5" />,
      items: [
        { name: "tRPC v11", desc: "端對端型別安全" },
        { name: "TanStack Query", desc: "智慧資料快取" },
        { name: "Zod", desc: "執行時驗證" },
        { name: "Server Actions", desc: "伺服器端操作" },
      ],
    },
    {
      category: "資料庫",
      icon: <Database className="w-5 h-5" />,
      items: [
        { name: "Supabase", desc: "PostgreSQL 雲端資料庫" },
        { name: "Row Level Security", desc: "列級安全策略 (RLS)" },
        { name: "Realtime", desc: "即時資料同步" },
        { name: "Edge Functions", desc: "邊緣運算" },
      ],
    },
    {
      category: "認證與安全",
      icon: <Shield className="w-5 h-5" />,
      items: [
        { name: "Supabase Auth", desc: "OAuth 2.0 認證" },
        { name: "GitHub OAuth", desc: "一鍵登入" },
        { name: "JWT Tokens", desc: "安全工作階段" },
        { name: "PKCE Flow", desc: "強化安全性" },
      ],
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* MD3 Background - Subtle gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: "hsl(var(--md-primary) / 0.15)" }}
        />
        <div
          className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: "hsl(var(--md-tertiary) / 0.1)" }}
        />
      </div>

      {/* Navigation - MD3 Top App Bar */}
      <nav className="nav-bar fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-3 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
            >
              <span className="text-title-large" style={{ color: "hsl(var(--md-on-surface))" }}>
                Prompt<span style={{ color: "hsl(var(--md-primary))" }}>Manger</span>
              </span>
            </div>
            <div
              className={`flex items-center gap-4 transition-all duration-500 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
            >
              <a href="/login" className="btn-primary">
                登入
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-32 pb-24 px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">


          {/* Main Title - MD3 Display */}
          <h1
            className={`mb-6 transition-all duration-500 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span
              className="text-display-medium block"
              style={{ color: "hsl(var(--md-on-surface))" }}
            >
              AI Prompt
            </span>
            <span
              className="text-display-medium block font-medium"
              style={{ color: "hsl(var(--md-primary))" }}
            >
              管理器
            </span>
          </h1>

          {/* Subtitle - MD3 Body */}
          <p
            className={`text-body-large max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-500 delay-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ color: "hsl(var(--md-on-surface-variant))" }}
          >
            管理、複用 AI Prompt
            <br className="hidden sm:block" />
            支援變數範本
          </p>

          {/* CTA Buttons - MD3 Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-500 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <a href="/login" className="btn-primary py-4 px-8 text-base flex items-center gap-2">
              立即開始
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section - MD3 Cards */}
      <section className="relative z-10 py-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-500 delay-600 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h2 className="text-headline-large mb-4" style={{ color: "hsl(var(--md-on-surface))" }}>
              核心<span style={{ color: "hsl(var(--md-primary))" }}>功能</span>
            </h2>
            <p className="text-body-large" style={{ color: "hsl(var(--md-on-surface-variant))" }}>
              簡潔而強大的功能設計，讓您專注於創作
            </p>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-6 transition-all duration-500 delay-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {/* Feature Card 1 */}
            <div className="card p-6">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "hsl(var(--md-primary-container))" }}
              >
                <Zap className="w-6 h-6" style={{ color: "hsl(var(--md-on-primary-container))" }} />
              </div>
              <h3 className="text-title-medium mb-2" style={{ color: "hsl(var(--md-on-surface))" }}>
                變數範本
              </h3>
              <p
                className="text-body-medium"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                使用 {"{{變數}}"} 語法，一鍵替換內容，複用 Prompt 更高效
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="card p-6">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "hsl(var(--md-secondary-container))" }}
              >
                <Sparkles
                  className="w-6 h-6"
                  style={{ color: "hsl(var(--md-on-secondary-container))" }}
                />
              </div>
              <h3 className="text-title-medium mb-2" style={{ color: "hsl(var(--md-on-surface))" }}>
                智慧分類
              </h3>
              <p
                className="text-body-medium"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                標籤管理，快速檢索，讓您的 Prompt 庫井井有條
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="card p-6">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "hsl(var(--md-tertiary-container))" }}
              >
                <Lock
                  className="w-6 h-6"
                  style={{ color: "hsl(var(--md-on-tertiary-container))" }}
                />
              </div>
              <h3 className="text-title-medium mb-2" style={{ color: "hsl(var(--md-on-surface))" }}>
                安全儲存
              </h3>
              <p
                className="text-body-medium"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                資料加密，隱私優先，雲端同步，隨時隨地存取
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section - MD3 Cards */}
      <section className="relative z-10 py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-500 delay-800 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="chip mb-6">
              <Code2 className="w-4 h-4" style={{ color: "hsl(var(--md-primary))" }} />
              <span>Built with Modern Stack</span>
            </div>
            <h2 className="text-headline-large mb-4" style={{ color: "hsl(var(--md-on-surface))" }}>
              Tech<span style={{ color: "hsl(var(--md-primary))" }}>Stack</span>
            </h2>
            <p className="text-body-large" style={{ color: "hsl(var(--md-on-surface-variant))" }}>
              採用最新的開源技術構建，注重效能、型別安全與開發體驗
            </p>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 delay-900 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {techStack.map((stack) => (
              <div key={stack.category} className="card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "hsl(var(--md-surface-container-high))" }}
                  >
                    <span style={{ color: "hsl(var(--md-primary))" }}>{stack.icon}</span>
                  </div>
                  <h3 className="text-title-medium" style={{ color: "hsl(var(--md-on-surface))" }}>
                    {stack.category}
                  </h3>
                </div>
                <div className="space-y-3">
                  {stack.items.map((item) => (
                    <div key={item.name} className="flex flex-col">
                      <span
                        className="text-label-large"
                        style={{ color: "hsl(var(--md-on-surface))" }}
                      >
                        {item.name}
                      </span>
                      <span
                        className="text-label-medium"
                        style={{ color: "hsl(var(--md-on-surface-variant))" }}
                      >
                        {item.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Tech Badges - MD3 Chips */}
          <div
            className={`flex flex-wrap justify-center gap-3 mt-12 transition-all duration-500 delay-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {["Biome", "pnpm", "Vercel", "Edge Runtime", "SSR", "ISR"].map((tech) => (
              <span key={tech} className="chip">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - MD3 Filled Card */}
      <section className="relative z-10 py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`card-filled p-12 transition-all duration-500 delay-1100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h2
              className="text-headline-medium mb-4"
              style={{ color: "hsl(var(--md-on-surface))" }}
            >
              準備好<span style={{ color: "hsl(var(--md-primary))" }}>開始</span>了嗎？
            </h2>
            <p
              className="text-body-large mb-8 max-w-md mx-auto"
              style={{ color: "hsl(var(--md-on-surface-variant))" }}
            >
              使用 GitHub 帳號一鍵登入，開始建構您的 Prompt 倉庫
            </p>
            <a href="/login" className="btn-primary inline-flex items-center gap-2 py-4 px-8">
              <Github className="w-5 h-5" />
              <span>使用 GitHub 登入</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer - MD3 Style */}
      <footer
        className="relative z-10 mt-auto"
        style={{ background: "hsl(var(--md-surface-container))" }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6">
          <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-500 delay-1200 ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "hsl(120 60% 50%)" }}
                />
                <span
                  className="text-label-medium"
                  style={{ color: "hsl(var(--md-on-surface-variant))" }}
                >
                  系統連線中
                </span>
              </div>
              <div className="divider w-px h-4" />
              <span
                className="text-label-medium font-mono"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                v0.5.0
              </span>
            </div>
            {/* <div className="flex items-center gap-6">
              <a href="/terms" className="btn-text text-label-medium">
                服務條款
              </a>
              <a href="/privacy" className="btn-text text-label-medium">
                隱私政策
              </a>
            </div> */}
          </div>
        </div>
      </footer>
    </div>
  );
}
