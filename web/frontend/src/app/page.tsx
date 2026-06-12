"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import {
  Briefcase, Sparkles, FileText, BarChart3, MessageSquare, TrendingUp,
  ArrowRight, CheckCircle2, MapPin, Search, ClipboardList,
} from "lucide-react";

/* ---------------------------------- Data ---------------------------------- */

const features = [
  { icon: Briefcase, title: "Tổng hợp từ 4 cổng việc làm", desc: "VietnamWorks, TopCV, ITviec, CareerViet — tìm một lần, thấy tất cả." },
  { icon: Sparkles, title: "AI đánh giá độ phù hợp", desc: "AI chấm điểm và giải thích chi tiết tại sao bạn phù hợp với vị trí đó." },
  { icon: FileText, title: "CV builder thông minh", desc: "Xây dựng CV, nhận gợi ý cải thiện, xuất PDF chuyên nghiệp." },
  { icon: ClipboardList, title: "Theo dõi ứng tuyển", desc: "Kanban board theo dõi pipeline từ Saved → Applied → Interview → Offer." },
  { icon: MessageSquare, title: "AI đồng hành mọi trang", desc: "Trợ lý AI hiểu ngữ cảnh từng trang, tư vấn chiến lược và phỏng vấn." },
  { icon: TrendingUp, title: "Dashboard thị trường", desc: "Phân tích xu hướng tuyển dụng, mức lương, kỹ năng hot theo ngành." },
];

const stats = [
  { value: "4+", label: "Cổng việc làm" },
  { value: "10k+", label: "Việc làm mới / tuần" },
  { value: "AI", label: "Đánh giá tự động" },
  { value: "100%", label: "Miễn phí" },
];

const benefits = [
  "Không cần tìm trên nhiều trang",
  "AI chỉ ra chính xác điểm mạnh / yếu của bạn",
  "CV được tối ưu cho từng vị trí",
  "Theo dõi tất cả đơn ứng tuyển một chỗ",
];

/* ------------------------------ Motion helpers ----------------------------- */

const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------- Hero 3D floating scene -------------------------- */

function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [14, 4]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 18 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ perspective: 1400, y: sceneY }}
      className="relative mx-auto mt-20 max-w-4xl px-6"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        {/* Main dashboard card */}
        <div
          className="relative bg-white rounded-3xl border border-slate-200/80 overflow-hidden
                     shadow-[0_40px_80px_-20px_rgba(15,23,42,0.18),0_18px_36px_-18px_rgba(15,23,42,0.14)]"
          style={{ transform: "translateZ(0px)" }}
        >
          {/* Window chrome */}
          <div className="h-11 px-5 flex items-center gap-2 border-b border-slate-100 bg-slate-50">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <span className="ml-4 text-[11px] text-slate-400 font-medium tracking-wide">vica.app / dashboard</span>
          </div>

          <div className="flex">
            {/* Mini sidebar */}
            <div className="hidden sm:flex w-14 flex-col items-center gap-1.5 py-5 border-r border-slate-100">
              <span className="text-sm font-bold text-slate-900 mb-3">V</span>
              {[BarChart3, Search, ClipboardList, FileText].map((Icon, i) => (
                <span
                  key={i}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    i === 0 ? "bg-slate-900 text-white" : "text-slate-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </span>
              ))}
            </div>

            {/* Dashboard body */}
            <div className="flex-1 p-6 sm:p-8">
              <p className="text-base font-bold text-slate-900 tracking-tight">Chào buổi sáng, Thái</p>
              <p className="text-xs text-slate-500 mt-0.5 mb-6">Tiến độ tìm việc của bạn tuần này</p>

              <div className="grid grid-cols-4 border-y border-slate-200 divide-x divide-slate-200 mb-6">
                {[
                  { v: "24", l: "Đơn ứng tuyển" },
                  { v: "8", l: "Đang active" },
                  { v: "3", l: "Phỏng vấn" },
                  { v: "86", l: "Điểm fit TB" },
                ].map((s) => (
                  <div key={s.l} className="py-4 px-3 sm:px-5">
                    <p className="text-lg sm:text-2xl font-bold text-slate-900">{s.v}</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {[
                  { label: "Frontend Developer · Tiki", w: "86%" },
                  { label: "Product Engineer · MoMo", w: "72%" },
                  { label: "Fullstack Intern · VNG", w: "64%" },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-[11px] mb-1.5">
                      <span className="text-slate-500">{row.label}</span>
                      <span className="text-slate-900 font-semibold">{row.w}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: row.w }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating: AI fit score */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -right-4 sm:-right-12 w-48 bg-white rounded-2xl border border-slate-200/80 p-4
                     shadow-[0_24px_48px_-12px_rgba(15,23,42,0.18)]"
          style={{ transform: "translateZ(90px)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </span>
            <p className="text-[11px] font-semibold text-slate-900 leading-tight">Đánh giá AI</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            86<span className="text-sm text-slate-300 font-semibold">/100</span>
          </p>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
            <div className="h-full w-[86%] bg-blue-600 rounded-full" />
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Phù hợp cao với vị trí này</p>
        </motion.div>

        {/* Floating: job row */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute -bottom-8 -left-4 sm:-left-14 w-60 bg-white rounded-2xl border border-slate-200/80 p-4
                     shadow-[0_24px_48px_-12px_rgba(15,23,42,0.16)]"
          style={{ transform: "translateZ(70px)" }}
        >
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
              T
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-slate-900 truncate">Frontend Developer</p>
              <p className="text-[10px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> TP.HCM · Remote
              </p>
            </div>
          </div>
          <div className="flex gap-1.5 mt-3">
            {["React", "TypeScript", "Next.js"].map((s) => (
              <span key={s} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                {s}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Floating: CV chip */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
          className="absolute top-1/3 -left-3 sm:-left-20 bg-slate-900 text-white rounded-xl px-4 py-2.5
                     flex items-center gap-2 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.4)]"
          style={{ transform: "translateZ(110px)" }}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[11px] font-semibold">CV đã tối ưu cho vị trí</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------ Feature card ------------------------------- */

function FeatureCard({
  icon: Icon,
  title,
  desc,
  index,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease }}
      whileHover={{ y: -8, rotateX: 3, rotateY: -3 }}
      style={{ transformPerspective: 900 }}
      className="bg-white rounded-2xl p-7 border border-slate-200
                 shadow-[0_1px_2px_rgba(15,23,42,0.04)]
                 hover:shadow-[0_28px_56px_-16px_rgba(15,23,42,0.14)]
                 hover:border-slate-300
                 transition-[box-shadow,border-color] duration-300 cursor-default"
    >
      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
        <Icon className="w-[18px] h-[18px] text-blue-600" />
      </div>
      <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

/* --------------------------- AI evaluation panel --------------------------- */

function EvaluationPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [18, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);

  return (
    <div ref={ref} style={{ perspective: 1200 }} className="relative">
      <motion.div
        style={{ rotateX, y, opacity, transformStyle: "preserve-3d" }}
        className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden
                   shadow-[0_48px_96px_-24px_rgba(15,23,42,0.4)]"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[11px] text-white/50">Đánh giá AI</div>
              <div className="font-semibold text-sm">Frontend Developer @ Tiki</div>
            </div>
            <span className="ml-auto text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/25 px-3 py-1 rounded-full">
              86/100
            </span>
          </div>

          <div className="space-y-4 mb-7">
            {[
              { label: "Kỹ năng kỹ thuật", score: 82 },
              { label: "Kinh nghiệm", score: 65 },
              { label: "Văn hóa & hành vi", score: 78 },
              { label: "Định hướng nghề nghiệp", score: 88 },
            ].map((item, i) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-white/60">{item.label}</span>
                  <span className="text-white font-semibold">{item.score}/100</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease }}
                    className="h-full bg-blue-400 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-[11px] text-white/50 mb-1">Nhận xét AI</div>
            <p className="text-white/90 text-sm leading-relaxed">
              Bạn có nền tảng React tốt. Cần bổ sung kinh nghiệm TypeScript và quen với CI/CD
              để cạnh tranh tốt hơn cho vị trí này.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* --------------------------------- Page ------------------------------------ */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-slate-900 text-xl tracking-tight">Vica</span>
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="text-slate-500 hover:text-slate-900 px-4 py-2 text-sm font-medium transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/auth/register"
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Bắt đầu miễn phí
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-28 relative">
        <div className="max-w-3xl mx-auto text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.04] tracking-tight mb-6"
          >
            Tìm việc thông minh,
            <br />
            <span className="text-blue-600">bắt đầu từ hôm nay.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Từ tìm kiếm, đánh giá độ phù hợp AI, tạo CV đến theo dõi ứng tuyển —
            tất cả trong một nền tảng, hoàn toàn miễn phí.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-12px_rgba(15,23,42,0.35)]"
            >
              Bắt đầu miễn phí <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              Đã có tài khoản
            </Link>
          </motion.div>
        </div>

        <HeroScene />
      </section>

      {/* Stats strip */}
      <section className="px-6 pb-24">
        <Reveal className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 border-y border-slate-200 divide-x divide-slate-200">
            {stats.map((s) => (
              <div key={s.label} className="py-8 px-6 text-center">
                <div className="text-3xl font-bold text-slate-900 mb-1">{s.value}</div>
                <div className="text-xs text-slate-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-xs font-semibold text-blue-600 tracking-[0.2em] uppercase mb-4">Tính năng</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Mọi thứ bạn cần để tìm việc
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Một nền tảng duy nhất cho toàn bộ hành trình ứng tuyển của bạn
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Vica + evaluation panel */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <p className="text-xs font-semibold text-blue-600 tracking-[0.2em] uppercase mb-4">
              Tại sao chọn Vica?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-6">
              Không chỉ là trang tìm việc
            </h2>
            <p className="text-slate-500 mb-9 leading-relaxed">
              Vica là người đồng hành nghề nghiệp — từ lúc bạn còn chưa biết bắt đầu từ đâu,
              đến khi nhận được offer đầu tiên.
            </p>
            <ul className="space-y-4">
              {benefits.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm font-medium">{b}</span>
                </motion.li>
              ))}
            </ul>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 mt-10 bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-12px_rgba(15,23,42,0.35)]"
            >
              Dùng thử ngay — Miễn phí <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>

          <EvaluationPanel />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28">
        <Reveal className="max-w-5xl mx-auto">
          <div className="bg-slate-900 rounded-3xl px-8 py-20 text-center relative overflow-hidden shadow-[0_48px_96px_-32px_rgba(15,23,42,0.4)]">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                Sẵn sàng bắt đầu?
              </h2>
              <p className="text-white/60 mb-9 max-w-md mx-auto">
                Tạo tài khoản miễn phí và bắt đầu tìm kiếm việc làm ngay hôm nay.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 px-9 py-4 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5"
              >
                Đăng ký miễn phí <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/70 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-slate-900 text-base tracking-tight">Vica</span>
            <span className="text-slate-400 text-sm">· 2025</span>
          </div>
          <p className="text-slate-400 text-xs">VietnamWorks · TopCV · ITviec · CareerViet</p>
        </div>
      </footer>
    </div>
  );
}
