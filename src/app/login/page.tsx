"use client";

import { createClient } from "@/lib/supabase/client";
import { Github } from "lucide-react";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Login error:", error.message);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error("Login error:", error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden">
      {/* MD3 Background - Subtle gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: "hsl(var(--md-primary) / 0.15)" }}
        />
        <div
          className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: "hsl(var(--md-tertiary) / 0.1)" }}
        />
      </div>

      {/* Left Panel - Brand & Visual */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        {/* Content */}
        <div className="relative z-10">
          <div
            className={`transition-all duration-500 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="chip">AI Prompt Manager</span>
          </div>
        </div>

        {/* Hero typography - MD3 Display */}
        <div className="relative z-10 space-y-6">
          <h1
            className={`transition-all duration-500 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span
              className="text-display-large block"
              style={{ color: "hsl(var(--md-on-surface))" }}
            >
              儲存
            </span>
            <span
              className="text-display-large block font-medium"
              style={{ color: "hsl(var(--md-primary))" }}
            >
              您的靈感
            </span>
          </h1>
          <p
            className={`max-w-md text-body-large leading-relaxed transition-all duration-500 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ color: "hsl(var(--md-on-surface-variant))" }}
          >
            將您精心打磨的 AI Prompt 安全儲存，隨時調用，讓創意永不流失。
          </p>
        </div>

        {/* Bottom decoration */}
        <div
          className={`relative z-10 flex items-center gap-8 transition-all duration-500 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "hsl(120 60% 50%)" }}
            />
            <span
              className="text-label-medium tracking-wide"
              style={{ color: "hsl(var(--md-on-surface-variant))" }}
            >
              系統連線中
            </span>
          </div>
          <div className="divider w-px h-4" />
          <span
            className="text-label-medium tracking-wide font-mono"
            style={{ color: "hsl(var(--md-on-surface-variant))" }}
          >
            v0.1.0
          </span>
        </div>
      </div>

      {/* Right Panel - Login Form (MD3 Card) */}
      <div className="relative flex items-center justify-center p-8 lg:p-16">
        <div
          className={`relative z-10 w-full max-w-[400px] transition-all duration-500 delay-300 ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}
        >
          {/* MD3 Card Container */}
          <div className="card p-8 lg:p-10">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-10">
              <h1
                className="text-headline-large mb-2"
                style={{ color: "hsl(var(--md-on-surface))" }}
              >
                Prompt<span style={{ color: "hsl(var(--md-primary))" }}>Manager</span>
              </h1>
              <p
                className="text-body-medium"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                儲存、組織、複用您的 AI Prompt
              </p>
            </div>

            {/* Form content */}
            <div className="space-y-8">
              <div className="space-y-2 text-center lg:text-left">
                <h2 className="text-headline-medium" style={{ color: "hsl(var(--md-on-surface))" }}>
                  歡迎回來
                </h2>
                <p
                  className="text-body-medium"
                  style={{ color: "hsl(var(--md-on-surface-variant))" }}
                >
                  使用 GitHub 帳號繼續
                </p>
              </div>

              {/* Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="btn-outlined w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed mb-4 bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
              >
                <span className="relative flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      <span>正在連線...</span>
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                        <path
                          d="M12.0003 20.4501C16.6693 20.4501 20.5907 17.2762 21.9961 13.125H21.0003V12.75H12.0003V12.7501V11.25H21.9961C22.2539 12.0253 22.4042 12.8711 22.4042 13.7844C22.4042 19.4674 17.7397 24.0001 12.0003 24.0001C5.37286 24.0001 0.000289917 18.6275 0.000289917 12.0001C0.000289917 5.37265 5.37286 0.0000915527 12.0003 0.0000915527C14.9254 0.0000915527 17.5878 1.05608 19.6644 2.80903L17.2023 5.27115C15.8673 4.14385 14.0728 3.43575 12.0003 3.43575C7.39176 3.43575 3.53589 6.96345 3.06456 11.4589H3.06415V12.0001V12.5412H3.06456C3.53589 17.0367 7.39176 20.5644 12.0003 20.5644V20.4501Z"
                          fill="currentColor"
                        />
                        <path
                          d="M3.06415 11.4588C2.86438 10.4506 2.86438 9.40826 3.06415 8.40002L6.3475 10.9298C6.16016 11.6666 6.16016 12.4335 6.3475 13.1704L3.06415 15.7001C2.58356 14.3333 2.58356 12.8256 3.06415 11.4588Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12.0002 3.43567C14.0727 3.43567 15.8672 4.14377 17.2022 5.27107L19.6643 2.80894C17.5877 1.056 14.9253 0 12.0002 0C7.23071 0 3.12564 2.76638 1.13965 6.72626L4.4988 9.32049C5.59012 5.91508 8.49074 3.43567 12.0002 3.43567Z"
                          fill="#EA4335"
                        />
                        <path
                          d="M12.0002 20.5644C8.49074 20.5644 5.59012 18.085 4.4988 14.6796L1.13965 17.2738C3.12564 21.2337 7.23071 24.0001 12.0002 24.0001C14.7171 24.0001 17.1654 23.0807 19.0493 21.5644L16.2974 18.5746C15.068 19.4623 13.5658 19.9984 12.0002 19.9984V20.5644Z"
                          fill="#34A853"
                        />
                        <path
                          d="M22.4042 13.7844C22.4042 12.8711 22.2539 12.0253 21.9961 11.25H12.0002V15.3406H17.9519C17.6534 16.9205 16.4862 18.0664 15.1118 18.6946L17.8637 21.6844C18.1578 21.4526 21.3906 18.8471 22.1866 14.7797L22.4042 13.7844Z"
                          fill="#4285F4"
                        />
                      </svg>
                      <span>使用 Google 登入</span>
                    </>
                  )}
                </span>
              </button>

              {/* GitHub Login Button - MD3 Filled Button */}
              <button
                type="button"
                onClick={handleGitHubLogin}
                disabled={isLoading}
                className="btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>正在連線...</span>
                    </>
                  ) : (
                    <>
                      <Github className="w-5 h-5" />
                      <span>使用 GitHub 登入</span>
                    </>
                  )}
                </span>
              </button>

              {/* Divider - MD3 Style */}
              <div className="flex items-center gap-4">
                <div className="flex-1 divider" />
                <span
                  className="text-label-medium tracking-[0.15em] uppercase"
                  style={{ color: "hsl(var(--md-on-surface-variant))" }}
                >
                  安全加密
                </span>
                <div className="flex-1 divider" />
              </div>

              {/* Terms */}
              {/* <p
                className="text-center text-label-medium leading-relaxed"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                登入即表示您同意我們的
                <a
                  href="/terms"
                  className="transition-colors ml-1"
                  style={{ color: "hsl(var(--md-primary))" }}
                >
                  服務條款
                </a>{" "}
                和{" "}
                <a
                  href="/privacy"
                  className="transition-colors"
                  style={{ color: "hsl(var(--md-primary))" }}
                >
                  隱私政策
                </a>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
