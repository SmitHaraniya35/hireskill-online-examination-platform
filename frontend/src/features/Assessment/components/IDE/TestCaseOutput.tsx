import React, { useState, useMemo } from "react";
import type { TestCaseResult, WorkerResponse } from "../../../../types/testFlow.types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TestCaseOutputProps {
  testCases: TestCaseResult[];
  workerResponse?: WorkerResponse | null;
  isSubmission?: boolean;
  isSubmitting: boolean;
  isLoading?: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TestCaseOutput: React.FC<TestCaseOutputProps> = ({
  testCases,
  workerResponse,
  isSubmission = false,
  isSubmitting,
  isLoading = false,
}) => {
  // Which test case tab is currently selected (only used in Run mode)
  const [activeTab, setActiveTab] = useState(0);

  // ── Derived stats (memoized so they don't recalculate on every render) ────
  const stats = useMemo(() => {
    const total = workerResponse?.totalTestCases ?? testCases.length;
    const passed =
      workerResponse?.passedTestCases ??
      testCases.filter((tc) => tc.status === "Accepted").length;
    const percentage = total > 0 ? (passed / total) * 100 : 0;
    const isAllPassed = passed === total && total > 0;
    return { total, passed, percentage, isAllPassed };
  }, [workerResponse, testCases]);

  // The test case currently shown in detail view (Run mode)
  const activeTestCase = useMemo(
    () => testCases[activeTab] ?? testCases[0],
    [testCases, activeTab]
  );

  // ── Loading states ────────────────────────────────────────────────────────
  // These are shown BEFORE we have any results

  if (isSubmitting) {
    return <LoadingSpinner message="Submitting your solution..." subMessage="Please wait for results" />;
  }

  if (isLoading) {
    return <LoadingSpinner message="Running your code..." subMessage="This may take a few seconds" />;
  }

  // ── Error / message states ────────────────────────────────────────────────

  // Hard error (compilation error, TLE, runtime error, etc.)
  if (workerResponse?.error) {
    return (
      <div className="w-full p-6 bg-gray-900">
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-xs font-bold text-red-400 uppercase mb-2">
            {workerResponse.error}
          </p>
          {workerResponse.message && (
            <pre className="text-sm text-red-300 whitespace-pre-wrap overflow-x-auto">
              {workerResponse.message}
            </pre>
          )}
        </div>
      </div>
    );
  }

  // Soft message (e.g. compilation warning)
  if (workerResponse?.message) {
    const isCompilationWarning = workerResponse.message.includes("Compilation");
    return (
      <div className="w-full p-6 bg-gray-900">
        <div className="bg-orange-900/20 border border-orange-500/50 rounded-lg p-4">
          <p className="text-xs font-bold text-orange-400 uppercase mb-2">
            {isCompilationWarning ? "Compilation Warning" : "Message"}
          </p>
          <pre className="text-sm text-orange-300 whitespace-pre-wrap overflow-x-auto">
            {workerResponse.message}
          </pre>
        </div>
      </div>
    );
  }

  // Default empty state — user hasn't run anything yet
  if (!workerResponse || testCases.length === 0) {
    return (
      <div className="w-full p-8 flex items-center justify-center bg-gray-900">
        <p className="text-gray-400 text-center">
          Click <span className="font-semibold text-green-400">Run Code</span> to test your solution
        </p>
      </div>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────

  return (
    <div className="w-full bg-gray-900 overflow-hidden">
      {isSubmission
        ? <SubmitModeResults testCases={testCases} workerResponse={workerResponse} stats={stats} />
        : <RunModeResults testCases={testCases} activeTab={activeTab} activeTestCase={activeTestCase} onTabChange={setActiveTab} />
      }
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * Shown while code is running or being submitted.
 */
const LoadingSpinner: React.FC<{ message: string; subMessage: string }> = ({
  message,
  subMessage,
}) => (
  <div className="w-full p-8 flex flex-col items-center justify-center space-y-4 bg-gray-900">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
    <p className="text-gray-300 font-medium">{message}</p>
    <p className="text-sm text-gray-500">{subMessage}</p>
  </div>
);

/**
 * SUBMIT MODE
 * Shows a summary header, progress bar, and a grid of pass/fail badges
 * for every test case.
 */
interface SubmitModeResultsProps {
  testCases: TestCaseResult[];
  workerResponse: WorkerResponse;
  stats: { total: number; passed: number; percentage: number; isAllPassed: boolean };
}

const SubmitModeResults: React.FC<SubmitModeResultsProps> = ({
  testCases,
  workerResponse,
  stats,
}) => (
  <>
    {/* Summary header */}
    <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-300">Test Results:</span>
        <span className={`text-sm font-semibold ${stats.isAllPassed ? "text-green-400" : "text-orange-400"}`}>
          {stats.passed}/{stats.total} Passed
        </span>
        {workerResponse.time && (
          <span className="text-xs text-gray-500">Time: {workerResponse.time}ms</span>
        )}
      </div>
      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${
        workerResponse.status === "Completed"
          ? "bg-green-900/50 text-green-400 border-green-500/50"
          : "bg-red-900/50 text-red-400 border-red-500/50"
      }`}>
        {workerResponse.status}
      </span>
    </div>

    {/* Progress bar */}
    <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            stats.isAllPassed ? "bg-green-500" : "bg-blue-500"
          }`}
          style={{ width: `${stats.percentage}%` }}
        />
      </div>
    </div>

    {/* Badge grid — one badge per test case */}
    <div className="p-4 h-[200px] overflow-auto">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(70px,1fr))] gap-2">
        {testCases.map((tc, index) => (
          <div
            key={tc.testCaseId || index}
            className={`p-2 rounded-md text-center text-[10px] border ${getStatusBadgeClass(tc.status)}`}
          >
            <div className="font-medium">{(tc.index ?? index) + 1}</div>
            <div className={`text-sm font-bold ${getStatusColor(tc.status)}`}>
              {getStatusIcon(tc.status)}
            </div>
            <div className="opacity-70 truncate">{tc.status}</div>
          </div>
        ))}
      </div>
    </div>
  </>
);

/**
 * RUN MODE
 * Shows tabs for each test case, and detailed input/output for the selected one.
 */
interface RunModeResultsProps {
  testCases: TestCaseResult[];
  activeTab: number;
  activeTestCase: TestCaseResult;
  onTabChange: (index: number) => void;
}

const RunModeResults: React.FC<RunModeResultsProps> = ({
  testCases,
  activeTab,
  activeTestCase,
  onTabChange,
}) => (
  <>
    {/* Tab navigation — only shown if there are multiple test cases */}
    {testCases.length > 1 && (
      <div className="grid grid-cols-5 gap-1 px-4 py-2 bg-gray-800 border-b border-gray-700 overflow-x-auto">
        {testCases.map((tc, index) => (
          <button
            key={tc.testCaseId || index}
            onClick={() => onTabChange(index)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-2 ${
              activeTab === index
                ? "bg-gray-700 border-gray-500 text-white shadow-sm"
                : "border-transparent text-gray-400 hover:bg-gray-700 hover:text-gray-200"
            }`}
          >
            <span>Case {(tc.index ?? index) + 1}</span>
            <span className={getStatusColor(tc.status)}>{getStatusIcon(tc.status)}</span>
          </button>
        ))}
      </div>
    )}

    {/* Detailed input/output for the active test case */}
    <div className="p-6 bg-gray-900 space-y-6">
      <TestCaseDetail testCase={activeTestCase} />
    </div>
  </>
);

/**
 * Shows the input, your output, and expected output for a single test case.
 */
const TestCaseDetail: React.FC<{ testCase: TestCaseResult }> = ({ testCase }) => {
  if (!testCase) return null;

  const isAccepted = testCase.status === "Accepted";

  return (
    <div className="space-y-5">
      {/* Status badge + execution time */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-300">Status:</span>
          <span className={`px-3 py-1.5 rounded-full text-sm font-bold border ${getStatusBadgeClass(testCase.status)}`}>
            {testCase.status}
          </span>
        </div>
        {testCase.time > 0 && (
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
            {testCase.time}ms
          </span>
        )}
      </div>

      {/* Input */}
      <CodeBlock label="Input" content={testCase.input || "(no input)"} />

      {/* Your Output */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">
          Your Output
        </p>
        <pre className={`p-4 rounded-xl border text-sm whitespace-pre-wrap overflow-x-auto shadow-sm ${
          isAccepted
            ? "bg-green-900/40 border-green-500/60 text-green-200"
            : "bg-red-900/40 border-red-500/60 text-red-200"
        }`}>
          {testCase.output !== undefined ? testCase.output || " " : "(not executed)"}
        </pre>
      </div>

      {/* Expected Output */}
      <CodeBlock
        label="Expected Output"
        content={
          testCase.expected !== undefined
            ? testCase.expected || "No expected output"
            : "(not available)"
        }
      />
    </div>
  );
};

/**
 * A simple labelled code block.
 * Extracted to avoid repeating the same pre/label structure.
 */
const CodeBlock: React.FC<{ label: string; content: string }> = ({ label, content }) => (
  <div>
    <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">{label}</p>
    <pre className="bg-gray-800/70 p-4 rounded-xl border border-gray-700 text-sm whitespace-pre-wrap overflow-x-auto text-gray-100 shadow-sm">
      {content}
    </pre>
  </div>
);

// ─── Status Helpers ───────────────────────────────────────────────────────────
// Plain functions — no hooks, no state. Just string → string mappings.

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Accepted":             return "text-green-400";
    case "Wrong Answer":         return "text-red-400";
    case "Runtime Error":
    case "Time Limit Exceeded":
    case "Memory Limit Exceeded":return "text-orange-400";
    default:                     return "text-gray-400";
  }
};

const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case "Accepted":             return "bg-green-900/60 text-green-300 border-green-400/60 shadow-md";
    case "Wrong Answer":         return "bg-red-900/60 text-red-300 border-red-400/60 shadow-md";
    case "Runtime Error":
    case "Time Limit Exceeded":
    case "Memory Limit Exceeded":return "bg-orange-900/60 text-orange-300 border-orange-400/60 shadow-md";
    default:                     return "bg-gray-700 text-gray-300 border-gray-600";
  }
};

const getStatusIcon = (status: string): string => {
  switch (status) {
    case "Accepted":              return "✓";
    case "Wrong Answer":          return "✗";
    case "Runtime Error":         return "⚠";
    case "Time Limit Exceeded":   return "⏱";
    case "Memory Limit Exceeded": return "💾";
    default:                      return "•";
  }
};

export default TestCaseOutput;