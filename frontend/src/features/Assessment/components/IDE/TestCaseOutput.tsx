import React, { useState, useMemo } from "react";
import type {
  TestCaseResult,
  WorkerResponse,
} from "../../../../types/testFlow.types";

interface TestCaseOutputProps {
  testCases: TestCaseResult[];
  workerResponse?: WorkerResponse | null;
  isSubmission?: boolean;
  isSubmitting: boolean;
  isLoading?: boolean;
}

const TestCaseOutput: React.FC<TestCaseOutputProps> = ({
  testCases,
  isSubmitting,
  workerResponse,
  isSubmission = false,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  // console.log(workerResponse);
  // Memoized stats - ALWAYS computed
  const stats = useMemo(() => {
    const totalTestCases = workerResponse?.totalTestCases || testCases.length;
    const passedTestCases =
      workerResponse?.passedTestCases ||
      testCases.filter((tc) => tc.status === "Accepted").length;
    const percentage =
      totalTestCases > 0 ? (passedTestCases / totalTestCases) * 100 : 0;
    const isAllPassed =
      passedTestCases === totalTestCases && totalTestCases > 0;
    return { totalTestCases, passedTestCases, percentage, isAllPassed };
  }, [workerResponse, testCases]);

  // Memoized current test case - ALWAYS computed
  const currentTestCase = useMemo(() => {
    return testCases.length === 1
      ? testCases[0]
      : testCases[activeTab] || testCases[0];
  }, [testCases, activeTab]);

  if (isSubmitting) {
    return (
      <div className="w-full p-8 flex flex-col items-center justify-center space-y-4 bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <p className="text-gray-300 font-medium">Submitting your solution...</p>
        <p className="text-sm text-gray-500">Please wait for results</p>
      </div>
    );
  }

  // Early returns after ALL hooks
  if (isLoading) {
    return (
      <div className="w-full p-8 flex flex-col items-center justify-center space-y-4 bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <p className="text-gray-300 font-medium">Running your code...</p>
        <p className="text-sm text-gray-500">This may take a few seconds</p>
      </div>
    );
  }

  if (workerResponse?.error) {
    return (
      <div className="w-full p-6 bg-gray-900">
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-xs font-bold text-red-400 uppercase mb-2">
            {workerResponse.error}
          </p>
          <pre className="text-sm text-red-300  whitespace-pre-wrap overflow-x-auto">
            {workerResponse.message}
          </pre>
        </div>
      </div>
    );
  }

  if (workerResponse?.message) {
    return (
      <div className="w-full p-6 bg-gray-900">
        <div className="bg-orange-900/20 border border-orange-500/50 rounded-lg p-4">
          <p className="text-xs font-bold text-orange-400 uppercase mb-2">
            {workerResponse.message.includes("Compilation")
              ? "Compilation Warning"
              : "Message"}
          </p>
          <pre className="text-sm text-orange-300  whitespace-pre-wrap overflow-x-auto">
            {workerResponse.message}
          </pre>
        </div>
      </div>
    );
  }

  if (!workerResponse || testCases.length === 0) {
    return (
      <div className="w-full p-8 flex flex-col items-center justify-center bg-gray-900">
        <p className="text-gray-400 text-center">
          Click <span className="font-semibold text-green-400">Run Code</span>{" "}
          to test your solution
        </p>
      </div>
    );
  }
  return (
    <div className="w-full bg-gray-900 overflow-hidden">
      {/* SUBMIT MODE: Header + Progress + Tabs */}
      {isSubmission ? (
        <>
          {/* Header */}
          <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-300">
                Test Results:
              </span>
              <span
                className={`text-sm font-semibold ${stats.isAllPassed ? "text-green-400" : "text-orange-400"}`}
              >
                {stats.passedTestCases}/{stats.totalTestCases} Passed
              </span>
              {workerResponse?.time && (
                <span className="text-xs text-gray-500">
                  Time: {workerResponse.time}ms
                </span>
              )}
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full border ${
                workerResponse?.status === "Completed"
                  ? "bg-green-900/50 text-green-400 border-green-500/50"
                  : "bg-red-900/50 text-red-400 border-red-500/50"
              }`}
            >
              {workerResponse?.status}
            </span>
          </div>

          {/* Progress Bar */}
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

          {/* Case Tabs */}
          <div className="p-4 w-full h-[200px] overflow-auto">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(70px,1fr))] gap-2">
              {testCases.map((tc, index) => (
                <div
                  key={tc.testCaseId || index}
                  className={`p-2 rounded-md text-center text-[10px] border transition-all cursor-default
          ${getStatusBadgeClass(tc.status)}
        `}
                >
                  {/* Case Number */}
                  <div className="font-medium">
                    {tc.index !== undefined ? tc.index + 1 : index + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className={`text-sm font-bold ${getStatusColor(tc.status)}`}
                  >
                    {getStatusIcon(tc.status)}
                  </div>

                  {/* Status */}
                  <div className="opacity-70 truncate">{tc.status}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* RUN MODE: Tabs + Details ONLY (no header/progress) */
        <>
          {/* Tab Navigation */}
          {testCases.length > 1 && (
            <div className="grid grid-cols-5 items-center gap-1 px-4 py-2 bg-gray-800 border-b border-gray-700 overflow-x-auto">
              {testCases.map((tc, index) => (
                <button
                  key={tc.testCaseId || index}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-2 ${
                    activeTab === index
                      ? "bg-gray-700 border-gray-500 text-white shadow-sm"
                      : "border-transparent text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                  }`}
                >
                  <span>
                    Case {tc.index !== undefined ? tc.index + 1 : index + 1}
                  </span>
                  <span className={getStatusColor(tc.status)}>
                    {getStatusIcon(tc.status)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Full Test Case Details */}
          <div className="p-6 bg-gray-900 space-y-6">
            {renderTestCaseDetails(currentTestCase)}
          </div>
        </>
      )}
    </div>
  );
};

// Helper functions (unchanged)
const renderTestCaseDetails = (testCase: TestCaseResult) => {
  if (!testCase) return null;

  return (
    <div className="space-y-5">
      {/* Status */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-300">Status:</span>
          <span
            className={`px-3 py-1.5 rounded-full text-sm font-bold border ${getStatusBadgeClass(testCase.status)}`}
          >
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
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">
          Input
        </p>
        <pre className="bg-gray-800/70 p-4 rounded-xl border border-gray-700  text-sm whitespace-pre-wrap overflow-x-auto text-gray-100 shadow-sm">
          {testCase.input || "(no input)"}
        </pre>
      </div>

      {/* Your Output */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">
          Your Output
        </p>
        <pre
          className={`p-4 rounded-xl border  text-sm whitespace-pre-wrap overflow-x-auto shadow-sm ${
            testCase.status === "Accepted"
              ? "bg-green-900/40 border-green-500/60 text-green-200"
              : "bg-red-900/40 border-red-500/60 text-red-200"
          }`}
        >
          {testCase.output !== undefined
            ? testCase.output || " "
            : "(not executed)"}
        </pre>
      </div>

      {/* Expected Output */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">
          Expected Output
        </p>
        <pre className="bg-gray-800/70 p-4 rounded-xl border border-gray-700  text-sm whitespace-pre-wrap overflow-x-auto text-gray-100 shadow-sm">
          {testCase.expected !== undefined
            ? testCase.expected || "No expected output"
            : "(not available)"}
        </pre>
      </div>
    </div>
  );
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Accepted":
      return "text-green-400";
    case "Wrong Answer":
      return "text-red-400";
    case "Runtime Error":
    case "Time Limit Exceeded":
    case "Memory Limit Exceeded":
      return "text-orange-400";
    default:
      return "text-gray-400";
  }
};

const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case "Accepted":
      return "bg-green-900/60 text-green-300 border-green-400/60 shadow-md";
    case "Wrong Answer":
      return "bg-red-900/60 text-red-300 border-red-400/60 shadow-md";
    case "Runtime Error":
    case "Time Limit Exceeded":
    case "Memory Limit Exceeded":
      return "bg-orange-900/60 text-orange-300 border-orange-400/60 shadow-md";
    default:
      return "bg-gray-700 text-gray-300 border-gray-600";
  }
};

const getStatusIcon = (status: string): string => {
  switch (status) {
    case "Accepted":
      return "✓";
    case "Wrong Answer":
      return "✗";
    case "Runtime Error":
      return "⚠";
    case "Time Limit Exceeded":
      return "⏱";
    case "Memory Limit Exceeded":
      return "💾";
    default:
      return "•";
  }
};

export default React.memo(TestCaseOutput);
