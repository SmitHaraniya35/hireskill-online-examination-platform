import React, { useState, useCallback } from "react";
import StatusBadge from "../Shared/StatusBadge";
import {
  useAssessment,
  type ProblemStatus,
} from "../../context/AssessmentContext";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const {
    assignedProblems,
    currentAssignedProblemId,
    currentCode,
    currentLanguage,
    setCurrentAssignedProblemId,
    setCurrentProblemId,
    loadProblemDetails,
    saveDraft,
    isDashboardView,
    toggleView,
  } = useAssessment();

  const [isSwitching, setIsSwitching] = useState(false);

  const handleToggleView = useCallback(async () => {
    if (currentAssignedProblemId && currentCode.trim() && !isSwitching) {
      setIsSwitching(true);
      try {
        await saveDraft(currentAssignedProblemId, {
          last_saved_code: currentCode,
          last_language: currentLanguage,
        });
      } finally {
        setIsSwitching(false);
      }
    }
    toggleView();
  }, [
    currentAssignedProblemId,
    currentCode,
    currentLanguage,
    saveDraft,
    toggleView,
    isSwitching,
  ]);

  const handleProblemSelect = useCallback(
    async (problemId: string, assignedProblemId: string) => {
      if (isSwitching || assignedProblemId === currentAssignedProblemId) return;

      setIsSwitching(true);

      try {
        if (currentAssignedProblemId && currentCode.trim()) {
          await saveDraft(currentAssignedProblemId, {
            last_saved_code: currentCode,
            last_language: currentLanguage,
          });
        }
        await loadProblemDetails(problemId, assignedProblemId);
      } catch (error) {
        console.error("Failed to switch problem:", error);
        alert("Failed to switch problem. Please try again.");
      } finally {
        setIsSwitching(false);
      }
    },
    [
      currentAssignedProblemId,
      currentCode,
      currentLanguage,
      saveDraft,
      loadProblemDetails,
      setCurrentProblemId,
      setCurrentAssignedProblemId,
      isSwitching,
    ],
  );

  const completedCount = assignedProblems.filter(
    (p) => p.status === "Submitted",
  ).length;

  return (
    <div
      className={`bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300 ${
        isOpen ? "w-80" : "w-16"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex flex-col gap-2">
        {isOpen ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-700">Problems</h3>
                <p className="text-xs text-gray-500">
                  {completedCount}/{assignedProblems.length} Completed
                </p>
              </div>
              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Toggle Button Inside Sidebar */}
            <button
              onClick={handleToggleView}
              disabled={isSwitching}
              className={`w-full px-3 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                isSwitching
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : isDashboardView
                    ? "bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
                    : "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
              }`}
            >
              {isSwitching ? (
                <>
                  <div className="w-4 h-4 border-2 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  {isDashboardView ? (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-8m0 0l4 8M14 12l4-8 4 8M4 7l8 8m0 0l8-8"
                        />
                      </svg>
                      Switch to Coding
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                      View Dashboard
                    </>
                  )}
                </>
              )}
            </button>
          </>
        ) : (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 mx-auto"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Problems List */}
      <div className="flex-1 overflow-y-auto relative">
        {assignedProblems.map((problem) => (
          <button
            key={problem.id}
            onClick={() => handleProblemSelect(problem.problem_id, problem.id)}
            className={`w-full text-left transition-all duration-200 group ${
                isSwitching
                  ? "opacity-75 cursor-wait"
                  : "hover:bg-gray-50"
            } ${
              currentAssignedProblemId === problem.id
                ? "bg-blue-50 border-l-4 border-blue-500 shadow-sm"
                : ""
            } ${isOpen ? "p-4 border-b border-gray-100" : "p-3 flex justify-center"}`}
            title={!isOpen ? problem.title : ""}
          >
            {isOpen ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800 truncate group-hover:text-blue-700">
                    {problem.title}
                  </span>
                  <StatusBadge
                    type="difficulty"
                    value={problem.difficulty as "Easy" | "Medium" | "Hard"}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <StatusBadge
                    type="status"
                    value={problem.status as ProblemStatus}
                  />
                  {isSwitching && currentAssignedProblemId === problem.id && (
                    <div className="flex items-center gap-1 text-xs text-blue-500 animate-pulse">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Current</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <span>
                {assignedProblems.indexOf(problem) + 1}
                {isSwitching && currentAssignedProblemId === problem.id && (
                  <span className="text-xs ml-1 animate-pulse">★</span>
                )}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${(completedCount / assignedProblems.length || 0) * 100}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">
            {completedCount}/{assignedProblems.length} completed
          </p>
        </div>
      )}

      {/* Global Loading Overlay */}
      {isSwitching && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 border-2 border-blue-200 rounded-lg">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="text-xs text-gray-600 font-medium">
              Saving & Switching...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Sidebar);
