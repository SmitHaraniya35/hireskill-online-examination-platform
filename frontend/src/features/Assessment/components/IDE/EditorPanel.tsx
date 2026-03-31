import React, { useState, useEffect, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { useAssessment } from "../../context/AssessmentContext";
import TestCaseOutput from "./TestCaseOutput";
import type {
  SubmitCodeData,
  TestCaseResult,
  WorkerResponse,
} from "../../../../types/testFlow.types";
import type { SupportedLanguage } from "../../../../constants/languages";
import testFlowService from "../../../../services/testFlow.services";

const languageMap: Record<SupportedLanguage, string> = {
  "C++": "cpp",
  C: "c",
  Python: "python",
  JavaScript: "javascript",
};

const languageOptions: { id: SupportedLanguage; name: string }[] = [
  { id: "Python", name: "Python" },
  { id: "JavaScript", name: "JavaScript" },
  { id: "C++", name: "C++" },
  { id: "C", name: "C" },
];

const EditorPanel: React.FC = () => {
  const {
    currentProblem,
    currentAssignedProblemId,
    currentCode,
    currentLanguage,
    setCurrentCode,
    setCurrentLanguage,
    updateProblemStatus,
    saveDraft,
    saveDraftToSession
  } = useAssessment();

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testCases, setTestCases] = useState<TestCaseResult[]>([]);
  const [isSubmission, setIsSubmission] = useState(false);
  const [workerResponse, setWorkerResponse] = useState<WorkerResponse | null>(
    null,
  );

  // Resizable panel state
  const [outputHeight, setOutputHeight] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartYRef = useRef(0);
  const dragStartHeightRef = useRef(0);

  const getDraftFromSession = useCallback((assignedProblemId: string) => {
    try {
      const draft = sessionStorage.getItem(`draft_${assignedProblemId}`);
      return draft ? JSON.parse(draft) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    setTestCases([]);
    setWorkerResponse(null);
    setIsSubmission(false);
    const draft = getDraftFromSession(currentAssignedProblemId!);
    if (draft && draft.last_language === currentLanguage) {
      setCurrentLanguage(draft.last_language);
      setCurrentCode(draft.last_saved_code);
    } else {
      if (currentProblem?.templateCodes) {
        const template = currentProblem.templateCodes.find(
          (tc) => tc.language === currentLanguage,
        );
        if (template) {
          // Only if no draft
          setCurrentCode(template.basic_code_layout);
          saveDraftToSession(currentAssignedProblemId!, {
            last_language: currentLanguage,
            last_saved_code: template.basic_code_layout
          })
          console.log("editor:", currentCode, currentLanguage)
        }
      }
    }
  }, [currentProblem, currentLanguage]);

  // Handle mouse events for resizing (unchanged)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartYRef.current = e.clientY;
    dragStartHeightRef.current = outputHeight;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const deltaY = e.clientY - dragStartYRef.current;
      const newHeight = dragStartHeightRef.current - deltaY;

      const minHeight = 100;
      const maxHeight = containerRect.height * 0.8;

      setOutputHeight(Math.min(Math.max(newHeight, minHeight), maxHeight));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, outputHeight]);

  const handleRunCode = async () => {
    if (!currentProblem || !currentCode.trim()) return;

    try {
      setIsRunning(true);
      setIsSubmission(false);
      setTestCases([]);
      setWorkerResponse(null);

      const testCasesData = currentProblem.testCases!.map((tc) => ({
        testCaseId: tc.id!,
        input: tc.input!,
        expected: tc.expected_output!,
      }));

      const response = await testFlowService.runCodeService({
        language: languageMap[currentLanguage],
        code: currentCode,
        testCases: testCasesData,
      });

      setWorkerResponse(response.payload!);
      if (response.payload?.results) {
        setTestCases(response.payload.results);
      }
    } catch (err: any) {
      // console.error("Run code error:", err);
      setWorkerResponse({
        status: "Failed",
        error: err.message || "Failed to run code",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = useCallback(async () => {
    if (!currentProblem || !currentCode.trim() || !currentAssignedProblemId) {
      alert("Please select a problem first");
      return;
    }

    try {
      setIsSubmitting(true);
      setIsRunning(false);
      setIsSubmission(true);
      setTestCases([]);
      setWorkerResponse(null);

      const submitData: SubmitCodeData = {
        problemId: currentProblem.id!,
        language: languageMap[currentLanguage],
        code: currentCode,
        assignedProblemId: currentAssignedProblemId,
      };
      
      const response = await testFlowService.submitCodeService(submitData);

      if (response.success) {
        await testFlowService.submitted(currentAssignedProblemId);
        updateProblemStatus(currentAssignedProblemId, "Submitted");
        const payload = response.payload;
        let workerResponse: WorkerResponse;

        if (payload?.error) {
          // Treat as failure (TLE, Runtime, etc.)
          workerResponse = {
            status: "Failed",
            error: payload.error,
            message: (payload as any)?.message,
          };
          setTestCases([]);
        } else if (payload?.status === "Completed") {
          const results: TestCaseResult[] = (payload.results || []).map(
            (r: any, index: number) => ({
              ...r,
              index,
              testCaseId: r.testCaseId || `tc-${index}`,
            }),
          );

          workerResponse = {
            status: payload.status,
            time: payload.time,
            totalTestCases: payload.totalTestCases,
            passedTestCases: payload.passedTestCases,
            results,
          };

          setTestCases(results);
        } else {
          // fallback safety
          workerResponse = {
            status: "Failed",
            error: "Unknown execution error",
          };
          setTestCases([]);
        }
        setWorkerResponse(workerResponse);
      } else {
        throw new Error(response.message || "Submission failed");
      }

    } catch (err: any) {
      setWorkerResponse({
        status: "Failed",
        error: err.message || "Failed to submit",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [currentProblem, currentAssignedProblemId, currentCode, currentLanguage]);

  const handleResetCode = async () => {
    if (currentProblem?.templateCodes) {
      const template = currentProblem.templateCodes.find(
        (tc) => tc.language === currentLanguage,
      );
      if (template) {
        setCurrentCode(template.basic_code_layout);
        console.log("CurrentLangue & CurrentCode", currentCode, currentLanguage);
        
        await saveDraft(currentAssignedProblemId!, {
          last_saved_code: currentCode,
          last_language: currentLanguage,
        });
      }
    }
    setTestCases([]);
    setWorkerResponse(null);
  };

  if (!currentProblem) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <p className="text-gray-400">Select a problem to start coding</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full flex flex-col bg-gray-900">
      {/* Editor Toolbar */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <select
            value={currentLanguage}
            onChange={(e) =>
              setCurrentLanguage(e.target.value as SupportedLanguage)
            }
            className="bg-gray-700 text-gray-200 text-sm rounded-lg px-3 py-1.5 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languageOptions.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleResetCode}
            className="px-3 py-1.5 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
          >
            Reset Code
          </button>
        </div>
      </div>

      {/* Editor Section */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={languageMap[currentLanguage]}
          value={currentCode}
          onChange={(value) => setCurrentCode(value || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            lineNumbers: "on",
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            renderLineHighlight: "all",
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-y border-gray-700">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunCode}
            disabled={isRunning || !currentCode.trim()}
            className={`px-4 py-1.5 rounded-lg transition-colors text-sm font-medium ${
              isRunning
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {isRunning ? "Running..." : "Run Code"}
          </button>
          <button
            onClick={handleSubmitCode}
            disabled={isSubmitting || !currentCode.trim()}
            className={`px-4 py-1.5 rounded-lg transition-colors text-sm font-medium ${
              isSubmitting
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {isSubmitting ? "Submitting..." : "Submit Solution"}
          </button>
        </div>
        <span className="text-xs text-gray-400">{currentLanguage}</span>
      </div>

      {/* Draggable Divider */}
      <div
        className="h-2 bg-gray-700 hover:bg-blue-600 cursor-row-resize flex items-center justify-center transition-colors group"
        onMouseDown={handleMouseDown}
      >
        <div className="w-16 h-1 bg-gray-500 rounded-full group-hover:bg-white transition-colors"></div>
      </div>

      {/* TestCaseOutput Section */}
      <div
        className="bg-gray-900 overflow-auto"
        style={{ height: outputHeight }}
      >
        <TestCaseOutput
          testCases={testCases}
          workerResponse={workerResponse}
          isSubmission={isSubmission}
          isSubmitting={isSubmitting}
          isLoading={isRunning}
        />
      </div>

      {isDragging && <div className="fixed inset-0 cursor-row-resize z-50" />}
    </div>
  );
};

export default React.memo(EditorPanel);
