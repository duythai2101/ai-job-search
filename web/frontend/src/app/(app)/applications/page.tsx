"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Application, STATUS_LABELS, STATUS_COLORS } from "@/lib/types";
import toast from "react-hot-toast";
import clsx from "clsx";
import { ClipboardList, LayoutGrid, List, ExternalLink, Trash2 } from "lucide-react";

const STATUSES = ["bookmarked", "applied", "interview", "offer", "rejected", "withdrawn"] as const;

const COLUMN_ACCENTS: Record<string, string> = {
  bookmarked: "bg-slate-400",
  applied:    "bg-brand-500",
  interview:  "bg-amber-400",
  offer:      "bg-emerald-500",
  rejected:   "bg-red-400",
  withdrawn:  "bg-slate-300",
};

const COLUMN_HEADER_BG: Record<string, string> = {
  bookmarked: "bg-slate-50 border-slate-200",
  applied:    "bg-brand-50 border-brand-100",
  interview:  "bg-amber-50 border-amber-100",
  offer:      "bg-emerald-50 border-emerald-100",
  rejected:   "bg-red-50 border-red-100",
  withdrawn:  "bg-slate-50 border-slate-200",
};

const COLUMN_TEXT: Record<string, string> = {
  bookmarked: "text-slate-600",
  applied:    "text-brand-700",
  interview:  "text-amber-700",
  offer:      "text-emerald-700",
  rejected:   "text-red-600",
  withdrawn:  "text-slate-500",
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={clsx("h-full rounded-full transition-all", color)} style={{ width: `${score}%` }} />
      </div>
      <span
        className={clsx(
          "text-xs font-semibold",
          score >= 75 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-red-500"
        )}
      >
        {score}%
      </span>
    </div>
  );
}

function CompanyInitials({ name }: { name: string }) {
  const init = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">
      {init || "?"}
    </div>
  );
}

function KanbanColumn({
  status,
  apps,
  onStatusChange,
  onDelete,
}: {
  status: string;
  apps: Application[];
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) {
  const label = STATUS_LABELS[status] || status;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-3 min-w-[220px] flex-1 flex flex-col shadow-card">
      {/* Column header */}
      <div className={clsx("flex items-center gap-2 px-3 py-2 rounded-xl border mb-3", COLUMN_HEADER_BG[status])}>
        <div className={clsx("w-2 h-2 rounded-full shrink-0", COLUMN_ACCENTS[status])} />
        <span className={clsx("text-xs font-semibold flex-1", COLUMN_TEXT[status])}>{label}</span>
        <span className={clsx("text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center bg-white/70", COLUMN_TEXT[status])}>
          {apps.length}
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-2 flex-1">
        {apps.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-xl border border-slate-100 p-3.5 hover:border-slate-200 transition-colors hover:shadow-sm"
          >
            <div className="flex items-start gap-2.5 mb-2">
              <CompanyInitials name={app.company_name || app.job_postings?.company || "?"} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-xs leading-tight line-clamp-1">
                  {app.role_title || app.job_postings?.title || "—"}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {app.company_name || app.job_postings?.company || "—"}
                </p>
              </div>
            </div>

            {app.fit_score != null && <ScoreBar score={app.fit_score} />}

            {app.applied_at && (
              <p className="text-[11px] text-slate-300 mt-2">
                {new Date(app.applied_at).toLocaleDateString("vi-VN")}
              </p>
            )}

            <div className="flex items-center gap-1.5 mt-2.5">
              <select
                value={app.status}
                onChange={(e) => onStatusChange(app.id, e.target.value)}
                className="flex-1 text-[11px] border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer bg-white"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
              <div className="flex gap-1">
                {app.source_url && (
                  <a
                    href={app.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-brand-600 hover:border-brand-200 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={() => onDelete(app.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-300 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {apps.length === 0 && (
          <div className="py-6 text-center text-slate-300 text-xs">Trống</div>
        )}
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"kanban" | "table">("kanban");

  async function load() {
    try {
      const data = await api.get<Application[]>("/applications");
      setApps(data);
    } catch {
      toast.error("Không tải được danh sách ứng tuyển");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    try {
      await api.patch(`/applications/${id}`, { status });
      setApps((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: status as Application["status"] } : a))
      );
      toast.success("Đã cập nhật");
    } catch {
      toast.error("Không cập nhật được");
    }
  }

  async function deleteApp(id: string) {
    if (!confirm("Xóa đơn ứng tuyển này?")) return;
    await api.delete(`/applications/${id}`);
    setApps((prev) => prev.filter((a) => a.id !== id));
    toast.success("Đã xóa");
  }

  const byStatus = STATUSES.reduce((acc, s) => {
    acc[s] = apps.filter((a) => a.status === s);
    return acc;
  }, {} as Record<string, Application[]>);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Theo dõi ứng tuyển</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {apps.length > 0 ? `${apps.length} đơn đang theo dõi` : "Quản lý toàn bộ hành trình ứng tuyển"}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setView("kanban")}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer",
              view === "kanban" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Kanban
          </button>
          <button
            onClick={() => setView("table")}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer",
              view === "table" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <List className="w-3.5 h-3.5" /> Bảng
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex gap-4 overflow-x-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 min-w-[220px] h-64 animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-7 h-7 text-brand-400" />
          </div>
          <p className="font-semibold text-slate-700">Chưa có đơn ứng tuyển nào</p>
          <p className="text-sm text-slate-400 mt-1">
            Tìm việc và lưu vào tracker để bắt đầu theo dõi
          </p>
        </div>
      ) : view === "kanban" ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STATUSES.map((s) => (
            <KanbanColumn
              key={s}
              status={s}
              apps={byStatus[s]}
              onStatusChange={updateStatus}
              onDelete={deleteApp}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Vị trí", "Công ty", "Trạng thái", "Độ phù hợp", "Ngày ứng tuyển", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-slate-900 text-sm">
                    {app.role_title || app.job_postings?.title || "—"}
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-sm">
                    {app.company_name || app.job_postings?.company || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className={clsx(
                        "px-2.5 py-1 rounded-lg text-xs font-medium border-0 outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer",
                        STATUS_COLORS[app.status]
                      )}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    {app.fit_score != null ? (
                      <span
                        className={clsx(
                          "text-sm font-semibold",
                          app.fit_score >= 75
                            ? "text-emerald-600"
                            : app.fit_score >= 50
                            ? "text-amber-600"
                            : "text-red-500"
                        )}
                      >
                        {app.fit_score}%
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-sm">
                    {app.applied_at ? new Date(app.applied_at).toLocaleDateString("vi-VN") : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {app.source_url && (
                        <a
                          href={app.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-300 hover:text-brand-500 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => deleteApp(app.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
