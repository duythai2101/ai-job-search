"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { JobPosting, SOURCE_LABELS, formatSalary } from "@/lib/types";
import toast from "react-hot-toast";
import {
  Search, MapPin, Bookmark, ExternalLink, Briefcase,
  Clock, Building2, SlidersHorizontal,
} from "lucide-react";

const SOURCES = [
  { id: "vietnamworks", label: "VietnamWorks" },
  { id: "topcv",        label: "TopCV" },
  { id: "itviec",       label: "ITviec" },
  { id: "careerviet",   label: "CareerViet" },
];

const SOURCE_BADGE: Record<string, string> = {
  vietnamworks: "bg-red-50 text-red-600 ring-1 ring-red-100",
  topcv:        "bg-sky-50 text-sky-600 ring-1 ring-sky-100",
  itviec:       "bg-violet-50 text-violet-600 ring-1 ring-violet-100",
  careerviet:   "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
  jobsgo:       "bg-orange-50 text-orange-600 ring-1 ring-orange-100",
};

const QUICK_SEARCHES = [
  "Frontend Developer", "Data Analyst", "Product Manager",
  "Backend Developer", "UX Designer", "Marketing",
];

function CompanyAvatar({ logo, name }: { logo?: string; name: string }) {
  if (logo) {
    return (
      <img
        src={logo}
        alt={name}
        className="w-11 h-11 rounded-xl object-contain border border-slate-100 shrink-0 bg-white"
      />
    );
  }
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-sm font-bold shrink-0 border border-brand-100">
      {initials || <Building2 className="w-5 h-5" />}
    </div>
  );
}

export default function JobsPage() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const search = useCallback(
    async (q?: string) => {
      const searchQuery = q ?? query;
      if (!searchQuery.trim()) {
        toast.error("Vui lòng nhập từ khóa tìm kiếm");
        return;
      }
      if (q) setQuery(q);
      setLoading(true);
      setSearched(true);
      try {
        const params = new URLSearchParams({
          q: searchQuery,
          location,
          sources: selectedSources.join(","),
          limit: "30",
        });
        const result = await api.get<{ jobs: JobPosting[] }>(`/jobs/search?${params}`);
        setJobs(result.jobs || []);
        if (result.jobs.length === 0)
          toast("Không tìm thấy việc làm phù hợp", { icon: "🔍" });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Có lỗi khi tìm kiếm";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [query, location, selectedSources]
  );

  function toggleSource(id: string) {
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  async function saveJob(job: JobPosting) {
    if (savedIds.has(job.id)) return;
    try {
      await api.post("/applications", {
        job_posting_id: job.id,
        company_name: job.company,
        role_title: job.title,
        source_url: job.url,
        status: "bookmarked",
      });
      setSavedIds((prev) => new Set(prev).add(job.id));
      toast.success("Đã lưu việc làm");
    } catch {
      toast.error("Không thể lưu việc làm");
    }
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tìm kiếm việc làm</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Tổng hợp từ VietnamWorks, TopCV, ITviec và CareerViet
        </p>
      </div>

      {/* Search panel */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 mb-5">
        {/* Main search inputs */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Vị trí, kỹ năng, tên công ty..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
            />
          </div>
          <div className="relative w-44">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Địa điểm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
            />
          </div>
          <button
            onClick={() => search()}
            disabled={loading}
            className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 cursor-pointer shadow-btn-brand hover:shadow-none"
          >
            {loading ? "Đang tìm..." : "Tìm kiếm"}
          </button>
        </div>

        {/* Source filters */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <SlidersHorizontal className="w-3 h-3" /> Nguồn:
          </span>
          {SOURCES.map((s) => (
            <button
              key={s.id}
              onClick={() => toggleSource(s.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer border ${
                selectedSources.includes(s.id)
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {s.label}
            </button>
          ))}
          {selectedSources.length > 0 && (
            <button
              onClick={() => setSelectedSources([])}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer underline"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Quick searches */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Gợi ý:</span>
          {QUICK_SEARCHES.map((q) => (
            <button
              key={q}
              onClick={() => search(q)}
              className="text-xs text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1 rounded-lg font-medium transition-all duration-150 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse h-[112px]" />
          ))}
        </div>
      )}

      {/* Empty searched state */}
      {!loading && searched && jobs.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-slate-300" />
          </div>
          <p className="font-semibold text-slate-700">Không tìm thấy kết quả</p>
          <p className="text-sm text-slate-400 mt-1">Thử từ khóa khác hoặc thay đổi bộ lọc nguồn</p>
        </div>
      )}

      {/* Initial empty state */}
      {!loading && !searched && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-7 h-7 text-brand-400" />
          </div>
          <p className="font-semibold text-slate-700">Nhập từ khóa để tìm kiếm</p>
          <p className="text-sm text-slate-400 mt-1">
            Ví dụ: &quot;Frontend Developer&quot;, &quot;Data Analyst&quot;, &quot;Product Manager&quot;
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && jobs.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-xs text-slate-400 font-medium mb-3">
            {jobs.length} kết quả được tìm thấy
          </p>
          {jobs.map((job) => {
            const saved = savedIds.has(job.id);
            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <CompanyAvatar logo={job.company_logo_url} name={job.company} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            href={`/jobs/${job.id}`}
                            className="font-semibold text-slate-900 hover:text-brand-600 transition-colors text-sm line-clamp-1"
                          >
                            {job.title}
                          </Link>
                          <p className="text-xs text-slate-500 mt-0.5">{job.company}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                              SOURCE_BADGE[job.source] || "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {SOURCE_LABELS[job.source] || job.source}
                          </span>
                          {job.is_remote && (
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-teal-50 text-teal-600 ring-1 ring-teal-100 font-medium">
                              Remote
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {job.location}
                          </span>
                        )}
                        {(job.salary_min || job.salary_max || job.salary_negotiable) && (
                          <span className="font-medium text-slate-600">
                            {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_negotiable)}
                          </span>
                        )}
                        {job.employment_type && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {job.employment_type}
                          </span>
                        )}
                      </div>

                      {job.skills_required.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {job.skills_required.slice(0, 5).map((skill) => (
                            <span
                              key={skill}
                              className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills_required.length > 5 && (
                            <span className="text-[11px] text-slate-400">
                              +{job.skills_required.length - 5}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-3.5 border-t border-slate-50">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="flex-1 text-center text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors py-1"
                    >
                      Xem chi tiết &amp; đánh giá AI
                    </Link>
                    <button
                      onClick={() => saveJob(job)}
                      disabled={saved}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 cursor-pointer ${
                        saved
                          ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-emerald-500 text-emerald-500" : ""}`} />
                      {saved ? "Đã lưu" : "Lưu"}
                    </button>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-all duration-150"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Ứng tuyển
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
