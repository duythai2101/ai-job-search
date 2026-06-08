"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { JobPosting, FitEvaluation, SOURCE_LABELS, formatSalary } from "@/lib/types";
import toast from "react-hot-toast";
import clsx from "clsx";
import {
  ArrowLeft, MapPin, Banknote, Clock, Wifi, Sparkles,
  CheckCircle2, AlertCircle, Lightbulb, ExternalLink, Bookmark, MessageSquare, FileText,
} from "lucide-react";

function ScoreBar({ score, label }: { score: number; label: string }) {
  const color = score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-amber-400" : "bg-red-400";
  const textColor = score >= 75 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-red-500";
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-700 font-body">{label}</span>
        <span className={clsx("text-sm font-bold tabular-nums", textColor)}>{score}/100</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={clsx("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [evaluation, setEvaluation] = useState<FitEvaluation | null>(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [loadingEval, setLoadingEval] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<JobPosting>(`/jobs/${id}`)
      .then(setJob)
      .catch(() => toast.error("Không tải được thông tin việc làm"))
      .finally(() => setLoadingJob(false));
  }, [id]);

  async function evaluate() {
    setLoadingEval(true);
    try {
      setEvaluation(await api.post<FitEvaluation>(`/jobs/${id}/evaluate-fit`));
    } catch (e: unknown) {
      toast.error((e as Error).message || "Có lỗi khi đánh giá");
    } finally {
      setLoadingEval(false);
    }
  }

  async function apply() {
    if (!job) return;
    setSaving(true);
    try {
      await api.post("/applications", {
        job_posting_id: job.id, company_name: job.company,
        role_title: job.title, source_url: job.url, status: "applied",
        fit_score: evaluation?.overall_score, fit_evaluation: evaluation,
      });
      toast.success("Đã thêm vào danh sách ứng tuyển");
      router.push("/applications");
    } catch {
      toast.error("Không thể lưu đơn ứng tuyển");
    } finally {
      setSaving(false);
    }
  }

  if (loadingJob) {
    return (
      <div className="p-8 max-w-4xl animate-pulse space-y-4">
        <div className="h-4 bg-slate-100 rounded w-24" />
        <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4">
          <div className="h-6 bg-slate-100 rounded w-64" />
          <div className="h-4 bg-slate-100 rounded w-40" />
          <div className="flex gap-3">
            <div className="h-4 bg-slate-100 rounded w-20" />
            <div className="h-4 bg-slate-100 rounded w-28" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-64 text-center">
        <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
        <p className="text-slate-500 font-medium">Không tìm thấy việc làm</p>
        <Link href="/jobs" className="mt-4 text-sm text-primary-600 hover:underline">Quay lại tìm kiếm</Link>
      </div>
    );
  }

  const overallScore = evaluation?.overall_score ?? 0;
  const verdictBg = overallScore >= 75
    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
    : overallScore >= 50
    ? "bg-amber-50 border-amber-200 text-amber-700"
    : "bg-red-50 border-red-200 text-red-600";

  return (
    <div className="min-h-full bg-surface">
      <div className="max-w-4xl mx-auto px-8 py-8">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors duration-150 mb-6 font-body"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay lại tìm kiếm
        </Link>

        {/* Job header card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-5">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
              {job.company_logo_url ? (
                <img src={job.company_logo_url} alt={job.company} className="w-full h-full object-contain" />
              ) : (
                <span className="text-2xl font-extrabold text-slate-300">{job.company?.[0]}</span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">{job.title}</h1>
              <p className="text-base text-slate-500 mt-1 font-body">{job.company}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-400 font-body">
                {job.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</span>}
                <span className="flex items-center gap-1.5"><Banknote className="w-3.5 h-3.5" />{formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_negotiable)}</span>
                {job.employment_type && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{job.employment_type}</span>}
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                  {SOURCE_LABELS[job.source] || job.source}
                </span>
                {job.is_remote && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 bg-teal-50 text-teal-600 rounded-lg text-xs font-semibold border border-teal-100">
                    <Wifi className="w-3 h-3" /> Remote
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2.5 mt-5 pt-5 border-t border-slate-50">
            <button
              onClick={evaluate}
              disabled={loadingEval}
              className="flex items-center gap-2 bg-primary-800 hover:bg-primary-900 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              {loadingEval ? "Đang phân tích..." : "Đánh giá độ phù hợp AI"}
            </button>
            <button
              onClick={apply}
              disabled={saving}
              className="flex items-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              {saving ? "Đang lưu..." : "Lưu vào tracker"}
            </button>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-2 border border-slate-200 hover:border-primary-300 text-slate-600 hover:text-primary-700 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 hover:bg-primary-50"
            >
              Xem bản gốc <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* AI Evaluation */}
        {evaluation && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-primary-600" />
                </div>
                <h2 className="font-extrabold text-slate-900 text-lg tracking-tight">Kết quả đánh giá AI</h2>
              </div>
              <div className={clsx("px-4 py-1.5 rounded-xl border font-bold text-sm", verdictBg)}>
                {evaluation.overall_score}/100 · {evaluation.verdict}
              </div>
            </div>

            <div className="mb-6">
              <ScoreBar score={evaluation.technical_skills.score} label="Kỹ năng kỹ thuật" />
              <ScoreBar score={evaluation.experience_match.score} label="Kinh nghiệm" />
              <ScoreBar score={evaluation.cultural_fit.score} label="Văn hóa & hành vi" />
              <ScoreBar score={evaluation.career_alignment.score} label="Định hướng nghề nghiệp" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-emerald-800 text-sm">Điểm mạnh</h3>
                </div>
                <ul className="space-y-1.5">
                  {evaluation.strengths.map((s, i) => (
                    <li key={i} className="text-emerald-700 text-sm font-body flex gap-2">
                      <span className="shrink-0 mt-1 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <h3 className="font-bold text-red-800 text-sm">Khoảng cách cần bổ sung</h3>
                </div>
                <ul className="space-y-1.5">
                  {evaluation.gaps.map((g, i) => (
                    <li key={i} className="text-red-700 text-sm font-body flex gap-2">
                      <span className="shrink-0 mt-1 w-1.5 h-1.5 bg-red-400 rounded-full" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-primary-600" />
                <h3 className="font-bold text-primary-800 text-sm">Khuyến nghị</h3>
              </div>
              <p className="text-primary-700 text-sm leading-relaxed font-body">{evaluation.recommendation}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 flex gap-4">
              <Link href="/cv" className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-150">
                <FileText className="w-3.5 h-3.5" />
                Tạo CV cho vị trí này
              </Link>
              <Link href={`/chat?context=job&id=${job.id}`} className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-150">
                <MessageSquare className="w-3.5 h-3.5" />
                Hỏi AI chiến lược ứng tuyển
              </Link>
            </div>
          </div>
        )}

        {/* Content columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-4">
            {job.description && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                <h2 className="font-extrabold text-slate-900 mb-4 tracking-tight">Mô tả công việc</h2>
                <div className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed font-body">{job.description}</div>
              </div>
            )}
            {job.requirements.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                <h2 className="font-extrabold text-slate-900 mb-4 tracking-tight">Yêu cầu</h2>
                <ul className="space-y-2.5">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="text-sm text-slate-600 font-body flex gap-3">
                      <span className="shrink-0 w-1.5 h-1.5 bg-accent-400 rounded-full mt-1.5" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {job.skills_required.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                <h2 className="font-extrabold text-slate-900 mb-3 text-sm tracking-tight">Kỹ năng cần có</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.map((s) => (
                    <span key={s} className="text-xs bg-primary-50 text-primary-700 border border-primary-100 px-3 py-1.5 rounded-lg font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {job.benefits.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                <h2 className="font-extrabold text-slate-900 mb-3 text-sm tracking-tight">Phúc lợi</h2>
                <ul className="space-y-2">
                  {job.benefits.map((b, i) => (
                    <li key={i} className="text-xs text-slate-600 font-body flex gap-2 items-start">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
