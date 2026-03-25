import React from "react";
import { CheckCircle2, ChevronRight, Code, Cpu, Info, Timer, XCircle } from "lucide-react";
import type { GetSubmissionResponse } from "../../../types/submission.types";

interface ProblemDetailsProps {
  data: GetSubmissionResponse | null;
  loading: boolean;
  error: string | null;
}

const difficultyStyles: Record<string, string> = {
  Easy: "bg-green-50 text-green-700",
  Medium: "bg-amber-50 text-amber-700",
  Hard: "bg-red-50 text-red-600",
};

  const renderHTML = (htmlString: string) => (
    <div dangerouslySetInnerHTML={{ __html: htmlString }} />
  );

const ProblemDetails: React.FC<ProblemDetailsProps> = ({ data, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center justify-center min-h-56 gap-3">
        <div className="w-7 h-7 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading problem details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center justify-center min-h-56">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center justify-center min-h-56">
        <p className="text-sm text-gray-400">Select a problem to view its details.</p>
      </div>
    );
  }

  const { problem, submission } = data;

  const isPassed =
    submission.status?.toLowerCase() === "passed" ||
    submission.passed_test_cases === submission.total_test_cases;
  const isPartial =
    !isPassed &&
    submission.passed_test_cases > 0 &&
    submission.passed_test_cases < submission.total_test_cases;

  const submissionStatusStyle = isPassed
    ? "bg-green-50 text-green-700"
    : isPartial
    ? "bg-amber-50 text-amber-700"
    : "bg-red-50 text-red-600";

  const submissionStatusLabel = submission.status;

  const codeLines = (submission.source_code || "").split("\n");
  

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100 bg-gray-50/30">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Submission Details</h2>
          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm ${
              difficultyStyles[problem.difficulty] || difficultyStyles.Easy
            }`}
          >
            {problem.difficulty}
          </span>
        </div>
        <h1 className="text-xl font-semibold text-gray-800 leading-tight">
          {problem.title}
        </h1>
        {problem.topic?.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {problem.topic.map((t: string) => (
              <span key={t} className="text-[10px] bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-md font-medium">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
        {/* Description Section */}
        <section>
          <div className="flex items-center gap-2 mb-3 text-gray-900">
            <Info size={18} className="text-[#1DA077]" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Problem Description</h3>
          </div>
          <div className="text-[15px] text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            {renderHTML(problem.problem_description)}
          </div>
        </section>

        {/* Code Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-900">
              <Code size={18} className="text-[#1DA077]" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Submitted Code</h3>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-lg">
              {submission.language || "JavaScript"}
            </div>
          </div>

          <div className="bg-[#1e1e2e] rounded-xl overflow-hidden border border-gray-800 shadow-inner">
            <div className="max-h-80 overflow-auto  text-[13px] leading-6 py-4">
              {codeLines.map((line: string, i: number) => (
                <div key={i} className="flex items-start hover:bg-white/5 group px-4">
                  <span className="w-10 flex-shrink-0 text-right text-[#4b5278] select-none pr-4 text-xs">
                    {i + 1}
                  </span>
                  <span className="text-[#cdd6f4] whitespace-pre truncate">
                    {line || "\u00A0"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-gray-900">
            <Cpu size={18} className="text-[#1DA077]" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Performance Metrics</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Test Case Stats */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm group hover:border-[#1DA077] transition-colors">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Test Cases</p>
              <p className="text-2xl font-black text-gray-900">{submission.total_test_cases}</p>
            </div>

            <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Passed</p>
                <CheckCircle2 size={14} className="text-green-500" />
              </div>
              <p className="text-2xl font-black text-green-700">{submission.passed_test_cases}</p>
            </div>

            <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Failed</p>
                <XCircle size={14} className="text-red-500" />
              </div>
              <p className="text-2xl font-black text-red-700">
                {submission.total_test_cases - submission.passed_test_cases}
              </p>
            </div>

            <div className="rounded-xl p-4 shadow-sm flex flex-col">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Result</p>
              <span className={`text-[12px] font-bold text-center py-1 rounded ${submissionStatusStyle}`}>
                {submissionStatusLabel}
              </span>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-4 rounded-xl">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Timer size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Execution Time</p>
                <p className="text-lg font-bold text-gray-900">{submission.execution_time}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-4 rounded-xl">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Cpu size={20} className="text-purple-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Memory Used</p>
                <p className="text-lg font-bold text-gray-900">{submission.memory_used} MB</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProblemDetails;