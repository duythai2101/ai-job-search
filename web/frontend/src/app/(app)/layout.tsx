"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  LayoutDashboard, Search, ClipboardList, FileText,
  MessageSquare, BarChart3, User, LogOut, Briefcase,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard",    label: "Tổng quan",   icon: LayoutDashboard },
  { href: "/jobs",         label: "Tìm việc",    icon: Search },
  { href: "/applications", label: "Ứng tuyển",   icon: ClipboardList },
  { href: "/cv",           label: "CV của tôi",  icon: FileText },
  { href: "/chat",         label: "AI Chat",     icon: MessageSquare },
  { href: "/analytics",   label: "Thị trường",  icon: BarChart3 },
  { href: "/profile",      label: "Hồ sơ",       icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-slate-100 flex flex-col shrink-0 shadow-[1px_0_0_0_#f1f5f9]">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary-800 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors duration-150">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-[15px] tracking-tight">JobViet AI</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative",
                  active
                    ? "bg-primary-50 text-primary-800"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary-700 rounded-r-full" />
                )}
                <Icon className={clsx("w-4 h-4 shrink-0", active ? "text-primary-700" : "text-slate-400 group-hover:text-slate-600")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 pb-5 border-t border-slate-100 pt-3">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-150 cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
