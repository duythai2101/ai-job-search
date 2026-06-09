"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import {
  ClipboardList, Zap, Search, FileText, MessageSquare,
  TrendingUp, ArrowRight, Target,
} from "lucide-react";
import { api } from "@/lib/api";
import { STATUS_LABELS } from "@/lib/types";
import { createClient } from "@/lib/supabase";

interface Stats {
  total: number;
  by_status: Record<string, number>;
  active: number;
  success_rate: number;
  jobs_explored: number;
  cvs_created: number;
  avg_fit_score: number | null;
}

const STATUS_CHART_COLORS: Record<string, string> = {
  bookmarked: "#94a3b8",
  applied:    "#6366f1",
  interview:  "#f59e0b",
  offer:      "#10b981",
  rejected:   "#f87171",
  withdrawn:  "#d1d5db",
};

const QUICK_ACTIONS = [
  { href: "/jobs",      Icon: Search,       label: "Tìm kiếm việc làm",  desc: "Tổng hợp từ 4 cổng tuyển dụng VN" },
  { href: "/cv",        Icon: FileText,     label: "Tạo hoặc chỉnh CV",  desc: "AI phân tích và đề xuất cải thiện" },
  { href: "/chat",      Icon: MessageSquare, label: "Hỏi AI tư vấn",    desc: "Chiến lược tìm việc cá nhân hoá" },
  { href: "/analytics", Icon: TrendingUp,   label: "Xu hướng thị trường", desc: "Kỹ năng và mức lương đang hot" },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Chào buổi sáng";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        const full = data.user?.user_metadata?.full_name || data.user?.email?.split("@")[0] || "";
        const parts = full.trim().split(" ").filter(Boolean);
        setFirstName(parts[parts.length - 1] || full);
      });

    async function load() {
      try {
        const [activity, appStats] = await Promise.all([
          api.get<{ jobs_explored: number; cvs_created: number; avg_fit_score: number | null }>(
            "/analytics/user/activity"
          ),
          api.get<{ total: number; by_status: Record<string, number>; active: number; success_rate: number }>(
            "/applications/stats"
          ),
        ]);
        setStats({ ...appStats, ...activity });
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statusData = stats
    ? Object.entries(stats.by_status)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => ({ name: STATUS_LABELS[k] || k, value: v, key: k }))
    : [];

  const metrics = [
    {
      label: "Tổng đơn ứng tuyển",
      value: stats?.total ?? "—",
      Icon: ClipboardList,
      color: "text-brand-600",
      bg: "bg-brand-50",
      border: "border-l-brand-500",
    },
    {
      label: "Đang tiến hành",
      value: stats?.active ?? "—",
      Icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-l-amber-400",
    },
    {
      label: "Việc đã khám phá",
      value: stats?.jobs_explored ?? "—",
      Icon: Search,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-l-violet-400",
    },
    {
      label: "CV đã tạo",
      value: stats?.cvs_created ?? "—",
      Icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-l-emerald-400",
    },
  ];

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-slate-400 font-medium mb-0.5">{greeting()}</p>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {firstName ? `${firstName}!` : "Chào mừng trở lại!"}
        </h1>
        <p className="text-slate-500 mt-1 text-sm">Đây là tổng quan hành trình tìm việc của bạn.</p>
      </div>

      {/* Avg fit score banner */}
      {!loading && stats?.avg_fit_score ? (
        <div className="mb-6 bg-gradient-to-r from-brand-600 to-indigo-500 rounded-2xl p-5 flex items-center justify-between text-white shadow-btn-brand">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold">Điểm phù hợp trung bình của bạn</p>
              <p className="text-white/70 text-sm">Dựa trên {stats.total} lần đánh giá AI</p>
            </div>
          </div>
          <div className="text-4xl font-bold">{stats.avg_fit_score}%</div>
        </div>
      ) : null}

      {/* Metric cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-28 animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((m) => (
            <div
              key={m.label}
              className={`bg-white rounded-2xl p-5 border border-slate-100 border-l-4 ${m.border} shadow-card`}
            >
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${m.bg} mb-3`}>
                <m.Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className="text-2xl font-bold text-slate-900">{m.value}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Pipeline + Quick actions */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Pipeline */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card">
            <h2 className="font-semibold text-slate-900 mb-1">Pipeline ứng tuyển</h2>
            <p className="text-xs text-slate-400 mb-4">Phân bổ theo trạng thái hiện tại</p>
            {statusData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%" cy="50%"
                      innerRadius={52} outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusData.map((entry) => (
                        <Cell key={entry.key} fill={STATUS_CHART_COLORS[entry.key] || "#94a3b8"} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #f1f5f9", fontSize: 12 }}
                      formatter={(value: number, name: string) => [value, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                  {statusData.map((d) => (
                    <div key={d.key} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: STATUS_CHART_COLORS[d.key] }}
                      />
                      {d.name}
                      <span className="text-slate-400">({d.value})</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[200px] flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                  <ClipboardList className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-500">Chưa có đơn ứng tuyển</p>
                <Link
                  href="/jobs"
                  className="text-xs text-brand-600 hover:underline mt-1.5 inline-flex items-center gap-1"
                >
                  Tìm việc ngay <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card">
            <h2 className="font-semibold text-slate-900 mb-1">Bắt đầu nhanh</h2>
            <p className="text-xs text-slate-400 mb-4">Truy cập các tính năng phổ biến</p>
            <div className="space-y-1">
              {QUICK_ACTIONS.map(({ href, Icon, label, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors duration-150 group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors duration-150">
                    <Icon className="w-4 h-4 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 group-hover:text-brand-700 transition-colors">
                      {label}
                    </div>
                    <div className="text-xs text-slate-400">{desc}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-400 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
