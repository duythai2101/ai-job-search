"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Search, ClipboardList, FileText,
  MessageSquare, BarChart3, User, LogOut, Briefcase,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Tổng quan" },
  { href: "/jobs",      icon: Search,           label: "Tìm việc" },
  { href: "/applications", icon: ClipboardList, label: "Ứng tuyển" },
  { href: "/cv",        icon: FileText,          label: "CV Builder" },
  { href: "/chat",      icon: MessageSquare,     label: "AI Chat" },
  { href: "/analytics", icon: BarChart3,         label: "Thị trường" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [initials, setInitials] = useState("U");

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getUser().then(({ data }) => {
      const full = data.user?.user_metadata?.full_name || "";
      const email = data.user?.email || "";
      setUserName(full || email.split("@")[0]);
      setUserEmail(email);
      const parts = full.trim().split(" ").filter(Boolean);
      if (parts.length >= 2) {
        setInitials((parts[0][0] + parts[parts.length - 1][0]).toUpperCase());
      } else if (full) {
        setInitials(full.slice(0, 2).toUpperCase());
      } else {
        setInitials(email.slice(0, 2).toUpperCase());
      }
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <aside className="w-60 bg-white border-r border-slate-100 flex flex-col fixed h-full z-40">
        {/* Brand */}
        <div className="px-5 pt-5 pb-4">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center shadow-btn-brand transition-transform duration-150 group-hover:scale-105">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-[17px] tracking-tight">Vica</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto py-2">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-[17px] h-[17px] shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 pt-2 border-t border-slate-100 space-y-1">
          <Link
            href="/profile"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              pathname === "/profile"
                ? "bg-brand-600 text-white"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <User className="w-[17px] h-[17px] shrink-0" />
            Hồ sơ cá nhân
          </Link>

          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 mt-1">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0 select-none">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate leading-tight">{userName || "User"}</p>
              <p className="text-[11px] text-slate-400 truncate leading-tight mt-0.5">{userEmail}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-slate-300 hover:text-red-500 transition-colors duration-150 cursor-pointer shrink-0 p-1"
              title="Đăng xuất"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-60 flex-1 min-h-screen">
        {children}
      </main>
    </div>
  );
}
