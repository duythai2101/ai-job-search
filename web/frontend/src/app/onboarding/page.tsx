"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { api, CVAnalysisResult, CVSection } from "@/lib/api";
import clsx from "clsx";
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  FileText,
  Send,
  Sparkles,
  XCircle,
  Upload,
} from "lucide-react";

type Step = "welcome" | "uploading" | "analyzing" | "review";

interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
}

function scoreColor(score: number) {
  if (score >= 8) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (score >= 5) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-red-600 bg-red-50 border-red-200";
}

function ScoreIcon({ score }: { score: number }) {
  if (score >= 8) return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
  if (score >= 5) return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
  return <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
}

function AiAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
      <Sparkles className="w-4 h-4 text-white" />
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState<CVAnalysisResult | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [userName, setUserName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const prevActiveSectionRef = useRef<string | null>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        const full =
          data.user?.user_metadata?.full_name || data.user?.email?.split("@")[0] || "";
        const parts = full.trim().split(" ").filter(Boolean);
        setUserName(parts[parts.length - 1] || full);
      });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!analysis) return;

    const greeting: Message = {
      id: "ai-1",
      role: "ai",
      content: `Tôi đã xem qua CV của bạn rồi! ${analysis.summary_message}`,
    };

    const prioritiesText = analysis.top_priorities.map((p, i) => `${i + 1}. ${p}`).join("\n");
    const priorities: Message = {
      id: "ai-2",
      role: "ai",
      content: `3 điều cần cải thiện ngay:\n${prioritiesText}`,
    };

    const weakSections = analysis.sections.filter((s) => s.issues.length > 0).slice(0, 2);
    const guide: Message = {
      id: "ai-3",
      role: "ai",
      content:
        weakSections.length > 0
          ? `Click vào từng mục bên trái để xem chi tiết:\n${weakSections
              .map((s) => `• ${s.title} (${s.score}/10): ${s.issues[0]}`)
              .join("\n")}`
          : "CV của bạn trông khá tốt! Click vào từng mục bên trái để xem gợi ý cải thiện.",
    };

    setTimeout(() => setMessages([greeting]), 300);
    setTimeout(() => setMessages((m) => [...m, priorities]), 1100);
    setTimeout(() => setMessages((m) => [...m, guide]), 2000);
  }, [analysis]);

  useEffect(() => {
    if (!activeSection || activeSection === prevActiveSectionRef.current || !analysis) return;
    prevActiveSectionRef.current = activeSection;

    const section = analysis.sections.find((s) => s.id === activeSection);
    if (!section) return;

    const content =
      section.issues.length > 0
        ? `${section.title} — Điểm ${section.score}/10\n\nVấn đề:\n${section.issues
            .map((i) => `• ${i}`)
            .join("\n")}\n\nGợi ý:\n${section.suggestions.map((s) => `• ${s}`).join("\n")}`
        : `${section.title} — Điểm ${section.score}/10\n\nMục này trông ổn. ${section.content_preview}`;

    setMessages((m) => [
      ...m,
      { id: `section-${activeSection}-${Date.now()}`, role: "ai", content },
    ]);
  }, [activeSection, analysis]);

  const handleFile = useCallback(async (file: File) => {
    const allowed = [".pdf", ".doc", ".docx", ".txt"];
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    if (!allowed.includes(ext)) {
      alert("Chỉ hỗ trợ file PDF, DOC, DOCX hoặc TXT");
      return;
    }
    setFileName(file.name);
    setStep("uploading");
    await new Promise((r) => setTimeout(r, 500));
    setStep("analyzing");
    try {
      const result = await api.uploadCv(file);
      setAnalysis(result);
      setStep("review");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Có lỗi khi phân tích CV";
      alert(msg);
      setStep("welcome");
    }
  }, []);

  async function sendMessage() {
    const text = chatInput.trim();
    if (!text || streaming) return;
    setChatInput("");
    setStreaming(true);

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((m) => [...m, userMsg, { id: "streaming", role: "ai", content: "" }]);

    try {
      const { reader } = await api.streamChat({
        message: text,
        context_type: "cv_onboarding",
        context_id: activeSection || undefined,
      });
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages((m) =>
          m.map((msg) => (msg.id === "streaming" ? { ...msg, content: full } : msg))
        );
      }
      setMessages((m) =>
        m.map((msg) => (msg.id === "streaming" ? { ...msg, id: Date.now().toString() } : msg))
      );
    } catch {
      setMessages((m) => m.filter((msg) => msg.id !== "streaming"));
    } finally {
      setStreaming(false);
    }
  }

  async function completeOnboarding() {
    const supabase = createClient();
    await supabase.auth.updateUser({ data: { onboarding_completed: true } });
    router.push("/jobs");
  }

  // ── Welcome ───────────────────────────────────────────────────
  if (step === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30 flex flex-col">
        {/* Top bar */}
        <header className="px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center shadow-btn-brand">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-[17px]">Vica</span>
          </div>
          <button
            onClick={completeOnboarding}
            className="text-slate-400 text-sm hover:text-slate-600 transition-colors cursor-pointer"
          >
            Bỏ qua
          </button>
        </header>

        {/* Center content */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-md">
            {/* Step indicator */}
            <div className="flex items-center gap-2 justify-center mb-8">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">1</div>
                <span className="text-xs font-medium text-brand-600">Upload CV</span>
              </div>
              <div className="w-8 h-px bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 text-xs font-bold flex items-center justify-center">2</div>
                <span className="text-xs font-medium text-slate-400">Phân tích</span>
              </div>
              <div className="w-8 h-px bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 text-xs font-bold flex items-center justify-center">3</div>
                <span className="text-xs font-medium text-slate-400">Tìm việc</span>
              </div>
            </div>

            {/* AI greeting */}
            <div className="flex gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shrink-0 mt-1 shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-4 shadow-card border border-slate-100 flex-1">
                <p className="text-slate-800 text-sm leading-relaxed font-medium">
                  Chào {userName || "bạn"}! Tôi là <strong>Vica AI</strong>.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mt-1.5">
                  Upload CV của bạn để tôi phân tích chi tiết từng mục và chỉ ra cụ thể
                  những gì cần cải thiện nhé!
                </p>
              </div>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files[0];
                if (f) handleFile(f);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={clsx(
                "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 select-none",
                dragOver
                  ? "border-brand-400 bg-brand-50 scale-[1.01] shadow-md"
                  : "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/30 hover:shadow-sm"
              )}
            >
              <div className={clsx(
                "w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors",
                dragOver ? "bg-brand-100" : "bg-brand-50"
              )}>
                <Upload className={`w-6 h-6 ${dragOver ? "text-brand-600" : "text-brand-500"}`} />
              </div>
              <p className="font-semibold text-slate-800 text-sm">
                {dragOver ? "Thả file vào đây" : "Kéo thả CV vào đây"}
              </p>
              <p className="text-slate-400 text-xs mt-1">hoặc click để chọn file</p>
              <p className="text-slate-300 text-xs mt-3">PDF · DOC · DOCX · TXT</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />

            <p className="text-center text-xs text-slate-400 mt-5">
              Hoặc{" "}
              <button
                onClick={completeOnboarding}
                className="text-brand-600 hover:underline cursor-pointer font-medium"
              >
                bỏ qua bước này
              </button>
              , bạn có thể upload CV sau
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Uploading / Analyzing ─────────────────────────────────────
  if (step === "uploading" || step === "analyzing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30 flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-brand-200">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-slate-900 text-base">
            {step === "uploading" ? "Đang tải file lên..." : "AI đang phân tích CV của bạn..."}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            {step === "uploading" ? fileName : "Thường mất 10–20 giây"}
          </p>
        </div>
        <div className="w-52 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={clsx(
              "h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full transition-all duration-700",
              step === "uploading" ? "w-1/3" : "w-2/3 animate-pulse"
            )}
          />
        </div>
        <p className="text-xs text-slate-300">
          {step === "analyzing" ? "Đang đọc và chấm điểm từng mục..." : ""}
        </p>
      </div>
    );
  }

  // ── Review ────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="h-14 border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-900">Vica</span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="text-slate-500 text-sm">Phân tích CV</span>
        </div>
        <div className="flex items-center gap-3">
          {analysis && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-sm font-bold text-amber-700">{analysis.overall_score}/100</span>
            </div>
          )}
          <button
            onClick={completeOnboarding}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-150 cursor-pointer shadow-btn-brand hover:shadow-none"
          >
            Bắt đầu tìm việc <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: CV sections */}
        <div className="w-[54%] border-r border-slate-100 overflow-y-auto bg-slate-50/40 p-5">
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide mb-4">
            {fileName} · Click vào mục để xem chi tiết
          </p>

          {analysis && (
            <div className="space-y-2.5">
              {analysis.sections.map((section: CVSection) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(isActive ? null : section.id)}
                    className={clsx(
                      "w-full text-left bg-white rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer",
                      isActive
                        ? "border-brand-300 shadow-md ring-1 ring-brand-100"
                        : "border-slate-100 hover:border-slate-200 shadow-sm hover:shadow"
                    )}
                  >
                    <div className="flex items-center justify-between p-3.5">
                      <div className="flex items-center gap-3">
                        <ScoreIcon score={section.score} />
                        <div className="text-left">
                          <div className="font-medium text-slate-900 text-sm">{section.title}</div>
                          {section.content_preview && (
                            <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                              {section.content_preview}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        {section.issues.length > 0 && (
                          <span className={clsx("text-xs font-medium px-2 py-0.5 rounded-full border", scoreColor(section.score))}>
                            {section.issues.length} vấn đề
                          </span>
                        )}
                        <span className={clsx("text-xs font-bold px-2 py-1 rounded-lg border", scoreColor(section.score))}>
                          {section.score}/10
                        </span>
                      </div>
                    </div>

                    {isActive && (
                      <div className="border-t border-slate-100 px-4 pb-4 pt-3 bg-slate-50/60">
                        {section.issues.length > 0 && (
                          <div className="mb-3">
                            <p className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                              Vấn đề phát hiện
                            </p>
                            <ul className="space-y-1.5">
                              {section.issues.map((issue, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                                  <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                                  {issue}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {section.suggestions.length > 0 && (
                          <div>
                            <p className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                              Gợi ý cải thiện
                            </p>
                            <ul className="space-y-1.5">
                              {section.suggestions.map((sug, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                  {sug}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={clsx("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                {msg.role === "ai" && <AiAvatar />}
                <div
                  className={clsx(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "ai"
                      ? "bg-white border border-slate-100 shadow-sm text-slate-800 rounded-tl-sm whitespace-pre-wrap"
                      : "bg-brand-600 text-white rounded-tr-sm"
                  )}
                >
                  {msg.content || (
                    <div className="flex gap-1 py-0.5">
                      {[0, 150, 300].map((d) => (
                        <div
                          key={d}
                          className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"
                          style={{ animationDelay: `${d}ms` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-100 p-4 bg-white shrink-0">
            <div className="flex gap-2">
              <input
                ref={chatInputRef}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Hỏi thêm về CV của bạn..."
                disabled={streaming}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-60 transition-shadow"
              />
              <button
                onClick={sendMessage}
                disabled={streaming || !chatInput.trim()}
                className="bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {[
                "CV tôi thiếu gì so với thị trường?",
                "Cách cải thiện mục kinh nghiệm?",
                "Tôi nên apply vị trí nào?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => { setChatInput(q); chatInputRef.current?.focus(); }}
                  className="text-xs text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
