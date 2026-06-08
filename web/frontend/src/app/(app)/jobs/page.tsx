"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { JobPosting, SOURCE_LABELS, formatSalary } from "@/lib/types";
import toast from "react-hot-toast";
import { Search, MapPin, Banknote, Clock, GraduationCap, Bookmark, ExternalLink, Wifi, ChevronRight } from "lucide-react";
import clsx from "clsx";

const SOURCES = [
  { id: "vietnamworks", label: "VietnamWorks", dot: "bg-red-400" },
  { id: "topcv",        label: "TopCV",        dot: "bg-blue-400" },
  { id: "itviec",       label: "ITviec",       dot: "bg-violet-400" },
  { id: "careerviet",   label: "CareerViet",   dot: "bg-emerald-400" },
];

const SOURCE_BADGE: Record<string, string> = {
  vietnamworks: "bg-red-50 text-red-600 border-red-100",
  topcv:        "bg-blue-50 text-blue-600 border-blue-100",
  itviec:       "bg-violet-50 text-violet-600 border-violet-100",
  careerviet:   "bg-emerald-50 text-emerald-600 border-emerald-100",
};

const QUICK_SEARCHES = ["Frontend Developer", "Data Analyst", "Marketing", "Kế toán", "Backend Developer"];

export default function JobsPage() {
  const [query, setQuery]     = useState("");
  const [location, setLocation] = useState("");
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [jobs, setJobs]       = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (overrideQuery?: string) => {
    const q = overrideQuery ?? query;
    if (!q.trim()) { toast.error("Vui lòng nhập từ khóa tìm kiếm"); return; }
    setLoading(true);
    setSearched(true);
    if (overrideQuery) setQuery(overrideQuery);
    try {
      const params = new URLSearchParams({ q, location, sources: selectedSources.join(","), limit: "30" });
      const result = await api.get<{ jobs: JobPosting[] }>(`/jobs/search?${params}`);
      setJobs(result.jobs || []);
      if (!result.jobs.length) toast("Không tìm thấy kết quả", { icon: "🔍" });
    } catch (e: unknown) {
      toast.error((e as Error).message || "Có lỗi khi tìm kiếm");
    } finally {
      setLoading(false);
    }
  }, [query, location, selectedSources]);

  function toggleSource(id: string) {
    setSelectedSources((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  }

  async function saveJob(job: JobPosting) {
    try {
      await api.post("/applications", {
        job_posting_id: job.id, company_name: job.company,
        role_title: job.title, source_url: job.url, status: "bookmarked",
      });
      toast.success("Đã lưu việc làm");
    } catch { toast.error("Không thể lưu việc làm"); }
  }

  return (
    <div className="min-h-full bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-8 pt-8 pb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Tìm kiếm việc làm</h1>
        <p className="text-slate-400 text-sm font-body">Tổng hợp từ VietnamWorks · TopCV · ITviec · CareerViet</p>

        {/* Search bar */}
        <div className="mt-5 flex gap-2.5">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Tên công việc, kỹ năng, công ty..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition placeholder:text-slate-300 font-body"
            />
          </div>
          <div className="relative w-48">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Địa điểm..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition placeholder:text-slate-300 font-body"
            />
          </div>
          <button
            onClick={() => search()}
            disabled={loading}
            className="bg-primary-800 hover:bg-primary-900 disabled:opacity-60 text-white px-7 py-3 rounded-xl font-semibold text-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 cursor-pointer"
          >
            {loading ? "Đang tìm..." : "Tìm kiếm"}
          </button>
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Nguồn</span>
            <div className="flex gap-1.5">
              {SOURCES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggleSource(s.id)}
                  className={clsx(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border cursor-pointer",
                    selectedSources.includes(s.id)
                      ? "bg-primary-50 border-primary-200 text-primary-700"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  )}
                >
                  <span className={clsx("w-1.5 h-1.5 rounded-full", s.dot)} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          {selectedSources.length > 0 && (
            <button onClick={() => setSelectedSources([])} className="text-xs text-slate-400 hover:text-slate-600 transition cursor-pointer">
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Quick searches */}
        {!searched && !loading && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Tìm kiếm phổ biến</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SEARCHES.map((q) => (
                <button
                  key={q}
                  onClick={() => search(q)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition-all duration-150 cursor-pointer"
                >
                  <Search className="w-3 h-3" />
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse flex gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2.5">
                  <div className="h-4 bg-slate-100 rounded w-2/5" />
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                  <div className="flex gap-2 mt-3">
                    <div className="h-3 bg-slate-100 rounded w-20" />
                    <div className="h-3 bg-slate-100 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty states */}
        {!loading && searched && jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-700 mb-1">Không tìm thấy kết quả</h3>
            <p className="text-sm text-slate-400 font-body max-w-xs">Thử từ khóa khác hoặc thay đổi nguồn tìm kiếm</p>
          </div>
        )}

        {!loading && !searched && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-primary-400" />
            </div>
            <h3 className="font-bold text-slate-700 mb-1">Nhập từ khóa để bắt đầu</h3>
            <p className="text-sm text-slate-400 font-body">Ví dụ: "Frontend Developer", "Data Analyst", "Marketing Manager"</p>
          </div>
        )}

        {/* Results count */}
        {!loading && jobs.length > 0 && (
          <p className="text-sm text-slate-500 font-body mb-4">
            Tìm thấy <span className="font-semibold text-slate-800">{jobs.length}</span> việc làm
          </p>
        )}

        {/* Job cards */}
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group overflow-hidden"
            >
              {/* Accent left bar */}
              <div className="flex">
                <div className="w-1 bg-accent-400 shrink-0 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="flex-1 p-5">
                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className="w-12 h-12 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                      {job.company_logo_url ? (
                        <img src={job.company_logo_url} alt={job.company} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-lg font-bold text-slate-400">{job.company?.[0]}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div>
                          <Link
                            href={`/jobs/${job.id}`}
                            className="font-bold text-slate-900 hover:text-primary-700 transition-colors duration-150 text-[15px] line-clamp-1"
                          >
                            {job.title}
                          </Link>
                          <p className="text-sm text-slate-500 mt-0.5 font-body">{job.company}</p>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <span className={clsx("text-xs px-2.5 py-1 rounded-lg font-medium border", SOURCE_BADGE[job.source] || "bg-slate-50 text-slate-600 border-slate-100")}>
                            {SOURCE_LABELS[job.source] || job.source}
                          </span>
                          {job.is_remote && (
                            <span className="text-xs px-2.5 py-1 rounded-lg bg-teal-50 text-teal-600 border border-teal-100 font-medium flex items-center gap-1">
                              <Wifi className="w-3 h-3" />
                              Remote
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-body">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {job.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Banknote className="w-3 h-3" />
                          {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_negotiable)}
                        </span>
                        {job.employment_type && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {job.employment_type}
                          </span>
                        )}
                        {job.experience_years_min != null && (
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" /> {job.experience_years_min}+ năm
                          </span>
                        )}
                      </div>

                      {job.skills_required.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {job.skills_required.slice(0, 5).map((skill) => (
                            <span key={skill} className="text-xs bg-slate-50 text-slate-600 border border-slate-100 px-2.5 py-1 rounded-lg font-medium">
                              {skill}
                            </span>
                          ))}
                          {job.skills_required.length > 5 && (
                            <span className="text-xs text-slate-400 px-2 py-1">+{job.skills_required.length - 5}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-slate-50">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors duration-150"
                    >
                      Xem & đánh giá phù hợp <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => saveJob(job)}
                      aria-label="Lưu việc làm"
                      className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-accent-500 hover:border-accent-200 hover:bg-accent-50 transition-all duration-150 cursor-pointer"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 bg-primary-800 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-all duration-150 hover:-translate-y-0.5"
                    >
                      Ứng tuyển <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
