import React, {
  useState,
  useEffect,
  type Dispatch,
  type SetStateAction,
  useMemo,
} from "react";
import submissionService from "../../../../services/submission.services";
import type { TestCaseResult } from "../../../../types/editor.types";

interface TestCaseOutputProps {
  testCases: TestCaseResult[];
  setTestCases: Dispatch<SetStateAction<TestCaseResult[]>>;
  sampleInput?: string;
  sampleOutput?: string;
}

const TestCaseOutput: React.FC<TestCaseOutputProps> = ({
  testCases,
  setTestCases,
  sampleInput,
  sampleOutput,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  // Poll for submission results
  useEffect(() => {
    const pendingCases = testCases.filter((tc) =>
      ["In Queue", "Processing"].includes(tc.status),
    );

    if (pendingCases.length === 0) return;

    const interval = setInterval(async () => {
      const updatedCases = [...testCases];

      for (let i = 0; i < updatedCases.length; i++) {
        const tc = updatedCases[i];
        if (!["In Queue", "Processing"].includes(tc.status)) continue;

        try {
          const response = await submissionService.getSubmissionService(tc.submissionId);

          if (response.success && response.payload) {
            const newStatus = response.payload.data.status?.description || "Processing";

            if (newStatus !== tc.status) {
              updatedCases[i] = {
                ...updatedCases[i],
                status: newStatus,
                output: response.payload.data.stdout || "",
                apiRes: response.payload.data,
              };
              setTestCases(updatedCases);
            }
          }
        } catch (error) {
          console.error(`Error polling ${tc.submissionId}:`, error);
        }
      }
      setTestCases(updatedCases);
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [testCases]);

  // Determine what to display
  const displayCases = useMemo(() => {
    return testCases.length > 0
      ? testCases
      : [
          {
            testCaseId: "sample",
            submissionId: "sample",
            status: "Ready",
            input: sampleInput,
            expected_output: sampleOutput,
            output: "",
          } as TestCaseResult,
        ];
  }, [testCases, sampleInput, sampleOutput]);

  const currentCase = displayCases[activeTab] || displayCases[0];
  // Status color utilities
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Accepted":
        return "text-green-500";
      case "Wrong Answer":
        return "text-red-500";
      case "In Queue":
      case "Processing":
        return "text-amber-500 animate-pulse";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Wrong Answer":
        return "bg-red-100 text-red-700";
      case "In Queue":
      case "Processing":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case "Accepted":
        return "✓";
      case "Wrong Answer":
        return "✗";
      case "In Queue":
      case "Processing":
        return "⋯";
      default:
        return "•";
    }
  };

  return (
    <div className="mt-4 w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Tab Navigation */}
      {displayCases.length > 1 && (
        <div className="grid grid-cols-5 items-center gap-1 px-4 py-2 bg-gray-50 border-b overflow-x-auto">
          {displayCases.map((tc, index) => (
            <button
              key={tc.testCaseId || index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-2 ${
                activeTab === index
                  ? "bg-white border-gray-300 shadow-sm"
                  : "border-transparent text-gray-500 hover:bg-gray-100"
              }`}
            >
              <span>Case {index + 1}</span>
              <span className={`${getStatusColor(tc.status)} font-bold`}>
                {getStatusIcon(tc.status)}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Results Content */}
      <div className="p-4 space-y-4">
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Status:</span>
          <span
            className={`text-sm font-bold px-3 py-1 rounded-full ${getStatusBadgeClass(currentCase.status)}`}
          >
            {currentCase.status}
          </span>
        </div>

        {/* Error Display */}
        {currentCase.apiRes?.stderr && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-xs font-bold text-red-600 uppercase mb-2">
              Runtime Error
            </p>
            <pre className="text-sm text-red-700 font-mono whitespace-pre-wrap overflow-x-auto">
              {currentCase.apiRes.stderr}
            </pre>
          </div>
        )}

        {currentCase.apiRes?.compile_output && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-xs font-bold text-red-600 uppercase mb-2">
              Compilation Error
            </p>
            <pre className="text-sm text-red-700 font-mono whitespace-pre-wrap overflow-x-auto">
              {currentCase.apiRes.compile_output}
            </pre>
          </div>
        )}

        {/* Input/Output Display */}
        {!currentCase.apiRes?.stderr && !currentCase.apiRes?.compile_output && (
          <div className="space-y-4">
            {/* Input */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                Input
              </p>
              <pre className="bg-gray-50 p-4 rounded-lg border font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                {currentCase.input || "No input"}
              </pre>
            </div>

            {/* Expected Output */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                Expected Output
              </p>
              <pre className="bg-gray-50 p-4 rounded-lg border font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                {currentCase.expected_output || "No expected output"}
              </pre>
            </div>

            {/* Your Output (if available) */}
            {currentCase.output && (
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                  Your Output
                </p>
                <pre
                  className={`p-4 rounded-lg border font-mono text-sm whitespace-pre-wrap overflow-x-auto ${
                    currentCase.status === "Accepted"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  {currentCase.output}
                </pre>
              </div>
            )}

            {/* Execution Details */}
            {currentCase.apiRes && (
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                {currentCase.apiRes.time && (
                  <div>
                    <span className="font-medium">Time:</span>{" "}
                    {currentCase.apiRes.time}s
                  </div>
                )}
                {currentCase.apiRes.memory && (
                  <div>
                    <span className="font-medium">Memory:</span>{" "}
                    {currentCase.apiRes.memory} KB
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TestCaseOutput);
