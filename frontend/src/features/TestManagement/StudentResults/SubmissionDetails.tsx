import React from "react";
import type { GetSubmissionResponse } from "../../../types/submission.types";
import { ChevronRight } from "lucide-react";

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
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col gap-4 overflow-y-auto max-h-[120vh]">
      {/* Section heading */}
      <h2 className="text-xl font-bold text-gray-900">Submissions Details</h2>

      {/* Problem title + difficulty */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-bold text-gray-900 leading-snug">{problem.title}</span>
        <span
          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${
            difficultyStyles[problem.difficulty] || difficultyStyles.Easy
          }`}
        >
          {problem.difficulty}
        </span>
      </div>

      {/* Topic */}
      {problem.topic?.length > 0 && (
        <p className="text-xs text-gray-500 -mt-2">Topic: {problem.topic.join(", ")}</p>
      )}

      {/* Description */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-1.5">Description</h3>
        <p className="text-[16px] text-gray-500 leading-relaxed">{renderHTML(problem.problem_description)}</p>
      </div>

      {/* Submitted Code */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-800">Submitted Code</h3>
          <button className="flex items-center gap-0.5 text-[11px] font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded-md px-2.5 py-1 hover:bg-gray-200 transition-colors">
            {submission.language || "JavaScript"}
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="bg-[#1e1e2e] rounded-xl overflow-auto max-h-64 font-mono text-xs leading-6 scrollbar-thin">
          {codeLines.map((line, i) => (
            <div key={i} className="flex items-start hover:bg-white/5 px-0">
              <span className="w-9 flex-shrink-0 text-right text-[#4b5278] select-none pr-3 pl-2 py-0">
                {i + 1}
              </span>
              <span className="text-[#cdd6f4] whitespace-pre py-0 pr-3">{line || "\u00A0"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Submission Info */}
      <div>
        <h3 className="text-xs font-semibold text-gray-800 mb-2.5">Submission Info</h3>

        {/* 4-col grid */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide leading-none">
              Total Test Cases
            </span>
            <span className="text-lg font-bold text-gray-900 leading-none mt-1">
              {submission.total_test_cases}
            </span>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-green-500 uppercase tracking-wide leading-none">
              Passed
            </span>
            <span className="text-lg font-bold text-green-600 leading-none mt-1">
              {submission.passed_test_cases}
            </span>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wide leading-none">
              Failed
            </span>
            <span className="text-lg font-bold text-red-500 leading-none mt-1">
              {submission.total_test_cases - submission.passed_test_cases}
            </span>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide leading-none">
              Status
            </span>
            <span
              className={`text-[11px] font-semibold mt-1.5 px-2 py-0.5 rounded-md inline-block w-fit ${submissionStatusStyle}`}
            >
              {submissionStatusLabel}
            </span>
          </div>
        </div>

        {/* Exec + Memory */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide leading-none">
              Execution Time
            </span>
            <span className="text-lg font-bold text-gray-900 leading-none mt-1">
              {submission.execution_time}
            </span>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide leading-none">
              Memory Used
            </span>
            <span className="text-lg font-bold text-gray-900 leading-none mt-1">
              {submission.memory_used} MB
            </span>
          </div>
        </div>
      </div>
    </div>
  );

};

export default ProblemDetails;