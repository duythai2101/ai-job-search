"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Briefcase, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Email hoặc mật khẩu không đúng" : error.message);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-surface flex font-sans">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-500 rounded-full blur-3xl opacity-10" />

        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">JobViet AI</span>
        </Link>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-white/10">
            <Sparkles className="w-3 h-3" />
            Powered by Gemini AI
          </div>
          <h2 className="text-3xl font-extrabold text-white leading-snug tracking-tight mb-4">
            Nền tảng tìm việc<br />
            thông minh nhất<br />
            <span className="text-accent-400">cho sinh viên Việt.</span>
          </h2>
          <p className="text-primary-200 text-sm leading-relaxed font-body max-w-xs">
            Tổng hợp từ 4 cổng việc làm lớn nhất Việt Nam,
            AI đánh giá độ phù hợp và hỗ trợ bạn từng bước trong hành trình nghề nghiệp.
          </p>
        </div>

        <div className="relative z-10 text-primary-400 text-xs font-body">
          © 2025 JobViet AI
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary-800 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">JobViet AI</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Chào mừng trở lại</h1>
            <p className="text-slate-500 text-sm font-body">Đăng nhập để tiếp tục hành trình tìm việc</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ban@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition font-body placeholder:text-slate-300"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition font-body placeholder:text-slate-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary-800 hover:bg-primary-900 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 cursor-pointer mt-2"
            >
              {loading ? "Đang đăng nhập..." : (
                <>Đăng nhập <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 font-body">
              Chưa có tài khoản?{" "}
              <Link href="/auth/register" className="font-bold text-primary-700 hover:text-primary-800 transition-colors duration-150">
                Đăng ký miễn phí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
