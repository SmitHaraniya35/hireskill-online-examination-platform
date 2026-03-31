import React from "react";
import Editor from "@monaco-editor/react";
import type { GetSubmissionResponse } from "../../../types/submission.types";
import { CheckCircle2, XCircle, Clock, Cpu } from "lucide-react";

interface ProblemDetailsProps {
  data: GetSubmissionResponse | null;
  loading: boolean;
  error: string | null;
}

const difficultyStyles: Record<string, string> = {
  Easy:   "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Medium: "bg-amber-50  text-amber-700  ring-1 ring-amber-200",
  Hard:   "bg-red-50    text-red-600    ring-1 ring-red-200",
};

const renderHTML = (html: string) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
);

const ProblemDetails: React.FC<ProblemDetailsProps> = ({ data, loading, error }) => {

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xs flex flex-col items-center justify-center min-h-56 gap-3">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-400 tracking-wide">Loading details…</p>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xs flex items-center justify-center min-h-56">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  /* ── Empty ── */
  if (!data) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xs flex items-center justify-center min-h-56">
        <p className="text-sm text-gray-400">Select a problem to view its details.</p>
      </div>
    );
  }

  const { problem, submission } = data;

  const failed = submission.total_test_cases - submission.passed_test_cases;

  const isPassed =
    submission.status?.toLowerCase() === "passed" ||
    submission.passed_test_cases === submission.total_test_cases;
  const isPartial =
    !isPassed && submission.passed_test_cases > 0 && submission.passed_test_cases < submission.total_test_cases;

  const statusStyle = isPassed
    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
    : isPartial
    ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
    : "bg-red-50 text-red-600 ring-1 ring-red-200";

  const monacoLang = (lang: string) => {
    const map: Record<string, string> = {
      javascript: "javascript",
      typescript: "typescript",
      python: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      go: "go",
      rust: "rust",
    };
    return map[lang?.toLowerCase()] ?? "plaintext";
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col gap-6 overflow-y-auto max-h-[100vh]">

      {/* ── Header ── */}
      <div>
        <p className="text-[11px] uppercase">
        <h2 className="text-sm font-bold text-gray-900">Submission Details</h2>
      </p>
        <div className="flex items-start justify-between gap-3">
          <h1 className="mt-4 text-base leading-snug">
            {problem.title}
          </h1>
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${difficultyStyles[problem.difficulty] || difficultyStyles.Easy}`}>
            {problem.difficulty}
          </span>
        </div>
        {problem.topic?.length > 0 && (
          <p className="mt-1 text-xs text-gray-400">
            {problem.topic.join(" · ")}
          </p>
        )}
      </div>

      {/* ── Divider ── */}
      <hr className="border-gray-100" />

      {/* ── Description ── */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
          Problem Description
        </p>
        <div className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none">
          {renderHTML(problem.problem_description)}
        </div>
      </div>

      {/* ── Divider ── */}
      <hr className="border-gray-100" />

      {/* ── Code ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            Submitted Code
          </p>
          <span className="text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1">
            {submission.language || "JavaScript"}
          </span>
        </div>

        <div className="rounded-xl overflow-hidden border border-gray-800" style={{ height: 260 }}>
          <Editor
            height="100%"
            width="100%"
            language={monacoLang(submission.language)}
            value={submission.source_code}
            theme="vs-dark"
            options={{
              readOnly: true,
              domReadOnly: true,
              readOnlyMessage: { value: "" },
              minimap: { enabled: false },
              fontSize: 12.5,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on",
              lineNumbers: "on",
              glyphMargin: false,
              folding: true,
              renderValidationDecorations: "off",
              scrollbar: { vertical: "visible", horizontal: "visible" },
              cursorStyle: "line",
              contextmenu: false,
              renderLineHighlight: "none",
              lineDecorationsWidth: 0,
              overviewRulerBorder: false,
            }}
            loading={
              <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-gray-500 text-xs">
                Loading editor…
              </div>
            }
          />
        </div>
      </div>

      {/* ── Divider ── */}
      <hr className="border-gray-100" />

      {/* ── Submission Info ── */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Submission Info
        </p>

        {/* Test case row */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          <StatCard
            label="Total Cases"
            value={submission.total_test_cases}
            valueClass="text-gray-800"
          />
          <StatCard
            label="Passed"
            value={submission.passed_test_cases}
            valueClass="text-emerald-600"
            icon={<CheckCircle2 size={13} className="text-emerald-500" />}
          />
          <StatCard
            label="Failed"
            value={failed}
            valueClass={failed > 0 ? "text-red-500" : "text-gray-400"}
            icon={failed > 0 ? <XCircle size={13} className="text-red-400" /> : undefined}
          />
        </div>

        {/* Status + perf row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
              Status
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md inline-block w-fit mt-0.5 ${statusStyle}`}>
              {submission.status}
            </span>
          </div>
          <StatCard
            label="Exec Time"
            value={submission.execution_time}
            valueClass="text-gray-800"
            icon={<Clock size={13} className="text-gray-400" />}
          />
          <StatCard
            label="Memory"
            value={`${submission.memory_used} MB`}
            valueClass="text-gray-800"
            icon={<Cpu size={13} className="text-gray-400" />}
          />
        </div>
      </div>

    </div>
  );
};

/* ── Small reusable stat card ── */
interface StatCardProps {
  label: string;
  value: string | number;
  valueClass?: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, valueClass = "", icon }) => (
  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col gap-1">
    <div className="flex items-center gap-1">
      {icon}
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide leading-none">
        {label}
      </span>
    </div>
    <span className={`text-base font-bold leading-none mt-1 ${valueClass}`}>
      {value}
    </span>
  </div>
);

export default ProblemDetails;