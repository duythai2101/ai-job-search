"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Briefcase, User, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

const PERKS = [
  "Tổng hợp từ 4 cổng việc làm lớn nhất",
  "AI đánh giá độ phù hợp tự động",
  "CV builder với gợi ý thông minh",
  "Hoàn toàn miễn phí",
];

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { toast.error("Mật khẩu phải có ít nhất 6 ký tự"); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Đăng ký thành công!");
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
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-500 rounded-full blur-3xl opacity-10" />

        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">JobViet AI</span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white leading-snug tracking-tight mb-6">
            Bắt đầu hành trình<br />
            sự nghiệp của bạn<br />
            <span className="text-accent-400">ngay hôm nay.</span>
          </h2>
          <ul className="space-y-3">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <CheckCircle2 className="w-4.5 h-4.5 text-accent-400 shrink-0" />
                <span className="text-primary-200 text-sm font-body">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-primary-400 text-xs font-body">
          © 2025 JobViet AI
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary-800 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">JobViet AI</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Tạo tài khoản</h1>
            <p className="text-slate-500 text-sm font-body">Miễn phí · Không cần thẻ tín dụng</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition font-body placeholder:text-slate-300"
                />
              </div>
            </div>

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
                  placeholder="Ít nhất 6 ký tự"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition font-body placeholder:text-slate-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all duration-150 hover:-translate-y-0.5 shadow-btn-accent hover:shadow-none active:translate-y-0 cursor-pointer mt-2"
            >
              {loading ? "Đang tạo tài khoản..." : (
                <>Tạo tài khoản miễn phí <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6 font-body">
            Đã có tài khoản?{" "}
            <Link href="/auth/login" className="font-bold text-primary-700 hover:text-primary-800 transition-colors duration-150">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
