// import React, { useState, useEffect, useRef, useCallback } from "react";
// import Editor from "@monaco-editor/react";
// import { useAssessment } from "../../context/AssessmentContext";
// import TestCaseOutput from "./TestCaseOutput";
// import type {
//   SubmitCodeData,
//   TestCaseResult,
//   WorkerResponse,
// } from "../../../../types/testFlow.types";
// import type { SupportedLanguage } from "../../../../constants/languages";
// import testFlowService from "../../../../services/testFlow.services";

// const languageMap: Record<SupportedLanguage, string> = {
//   "C++": "cpp",
//   C: "c",
//   Python: "python",
//   JavaScript: "javascript",
// };

// const languageOptions: { id: SupportedLanguage; name: string }[] = [
//   { id: "Python", name: "Python" },
//   { id: "JavaScript", name: "JavaScript" },
//   { id: "C++", name: "C++" },
//   { id: "C", name: "C" },
// ];

// const EditorPanel: React.FC = () => {
//   const {
//     currentProblem,
//     currentAssignedProblemId,
//     currentCode,
//     currentLanguage,
//     setCurrentCode,
//     setCurrentLanguage,
//     updateProblemStatus,
//     saveDraft,
//     saveDraftToSession
//   } = useAssessment();

//   const [isRunning, setIsRunning] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [testCases, setTestCases] = useState<TestCaseResult[]>([]);
//   const [isSubmission, setIsSubmission] = useState(false);
//   const [workerResponse, setWorkerResponse] = useState<WorkerResponse | null>(
//     null,
//   );
//   // const requestIdRef = useRef(0);

//   // Resizable panel state
//   const [outputHeight, setOutputHeight] = useState(300);
//   const [isDragging, setIsDragging] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const dragStartYRef = useRef(0);
//   const dragStartHeightRef = useRef(0);

//   const getDraftFromSession = useCallback((assignedProblemId: string) => {
//     try {
//       const draft = sessionStorage.getItem(`draft_${assignedProblemId}`);
//       return draft ? JSON.parse(draft) : null;
//     } catch {
//       return null;
//     }
//   }, []);

//   useEffect(() => {
//     // requestIdRef.current += 1;
//     setTestCases([]);
//     setWorkerResponse(null);
//     setIsSubmission(false);
//     // setIsRunning(false);    // <-- add this
//     // setIsSubmitting(false); // <-- add this
//     const draft = getDraftFromSession(currentAssignedProblemId!);
//     if (draft && draft.last_language === currentLanguage) {
//       setCurrentLanguage(draft.last_language);
//       setCurrentCode(draft.last_saved_code);
//     } else {
//       if (currentProblem?.templateCodes) {
//         const template = currentProblem.templateCodes.find(
//           (tc) => tc.language === currentLanguage,
//         );
//         if (template) {
//           // Only if no draft
//           setCurrentCode(template.basic_code_layout);
//           saveDraftToSession(currentAssignedProblemId!, {
//             last_language: currentLanguage,
//             last_saved_code: template.basic_code_layout
//           })
//         }
//       }
//     }
//   }, [currentProblem, currentLanguage]);

//   // Handle mouse events for resizing (unchanged)
//   const handleMouseDown = (e: React.MouseEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//     dragStartYRef.current = e.clientY;
//     dragStartHeightRef.current = outputHeight;
//   };

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!isDragging || !containerRef.current) return;

//       const containerRect = containerRef.current.getBoundingClientRect();
//       const deltaY = e.clientY - dragStartYRef.current;
//       const newHeight = dragStartHeightRef.current - deltaY;

//       const minHeight = 100;
//       const maxHeight = containerRect.height * 0.8;

//       setOutputHeight(Math.min(Math.max(newHeight, minHeight), maxHeight));
//     };

//     const handleMouseUp = () => {
//       setIsDragging(false);
//     };

//     if (isDragging) {
//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);
//     }

//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDragging, outputHeight]);

//   const handleRunCode = async () => {
//     if (!currentProblem || !currentCode.trim()) return;

//     // const myRequestId = ++requestIdRef.current;

//     try {
//       setIsRunning(true);
//       setIsSubmission(false);
//       setTestCases([]);
//       setWorkerResponse(null);

//       const testCasesData = currentProblem.testCases!.map((tc) => ({
//         testCaseId: tc.id!,
//         input: tc.input!,
//         expected: tc.expected_output!,
//       }));

//       const response = await testFlowService.runCodeService({
//         language: languageMap[currentLanguage],
//         code: currentCode,
//         testCases: testCasesData,
//       });

//       // if (requestIdRef.current !== myRequestId) return; // <-- stale, discard

//       setWorkerResponse(response.payload!);
//       if (response.payload?.results) {
//         setTestCases(response.payload.results);
//       }
//     } catch (err: any) {
//       // console.error("Run code error:", err);
//       // if (requestIdRef.current !== myRequestId) return; // <-- stale, discard
//       setWorkerResponse({
//         status: "Failed",
//         error: err.message || "Failed to run code",
//       });
//     } finally {
//       // if (requestIdRef.current === myRequestId) { // <-- only clear if still relevant
//       setIsRunning(false);
//     // }
//     }
//   };

//   const handleSubmitCode = useCallback(async () => {
//     if (!currentProblem || !currentCode.trim() || !currentAssignedProblemId) {
//       alert("Please select a problem first");
//       return;
//     }
//     // const myRequestId = ++requestIdRef.current; // <-- capture

//     try {
//       setIsSubmitting(true);
//       setIsRunning(false);
//       setIsSubmission(true);
//       setTestCases([]);
//       setWorkerResponse(null);

//       const submitData: SubmitCodeData = {
//         problemId: currentProblem.id!,
//         language: languageMap[currentLanguage],
//         code: currentCode,
//         assignedProblemId: currentAssignedProblemId,
//       };
      
//       const response = await testFlowService.submitCodeService(submitData);

//       if (response.success) {
//         await testFlowService.submitted(currentAssignedProblemId);
//         updateProblemStatus(currentAssignedProblemId, "Submitted");
//         const payload = response.payload;
//         let workerResponse: WorkerResponse;

//         if (payload?.error) {
//           // Treat as failure (TLE, Runtime, etc.)
//           workerResponse = {
//             status: "Failed",
//             error: payload.error,
//             message: (payload as any)?.message,
//           };
//           setTestCases([]);
//         } else if (payload?.status === "Completed") {
//           const results: TestCaseResult[] = (payload.results || []).map(
//             (r: any, index: number) => ({
//               ...r,
//               index,
//               testCaseId: r.testCaseId || `tc-${index}`,
//             }),
//           );

//           workerResponse = {
//             status: payload.status,
//             time: payload.time,
//             totalTestCases: payload.totalTestCases,
//             passedTestCases: payload.passedTestCases,
//             results,
//           };

//           setTestCases(results);
//         } else {
//           // fallback safety
//           workerResponse = {
//             status: "Failed",
//             error: "Unknown execution error",
//           };
//           setTestCases([]);
//         }
//         setWorkerResponse(workerResponse);
//       } else {
//         throw new Error(response.message || "Submission failed");
//       }

//     } catch (err: any) {
//       // if (requestIdRef.current !== myRequestId) return; // <-- stale, discard
//       setWorkerResponse({
//         status: "Failed",
//         error: err.message || "Failed to submit",
//       });
//     } finally {
//       // if (requestIdRef.current === myRequestId) { // <-- only clear if still relevant
//       setIsSubmitting(false);
//     }
//     // }
//   }, [currentProblem, currentAssignedProblemId, currentCode, currentLanguage]);

//   const handleResetCode = async () => {
//     if (currentProblem?.templateCodes) {
//       const template = currentProblem.templateCodes.find(
//         (tc) => tc.language === currentLanguage,
//       );
//       if (template) {
//         setCurrentCode(template.basic_code_layout);
        
//         await saveDraft(currentAssignedProblemId!, {
//           last_saved_code: currentCode,
//           last_language: currentLanguage,
//         });
//       }
//     }
//     setTestCases([]);
//     setWorkerResponse(null);
//   };

//   if (!currentProblem) {
//     return (
//       <div className="h-full flex items-center justify-center bg-gray-900">
//         <p className="text-gray-400">Select a problem to start coding</p>
//       </div>
//     );
//   }

//   return (
//     <div ref={containerRef} className="h-full flex flex-col bg-gray-900">
//       {/* Editor Toolbar */}
//       <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
//         <div className="flex items-center space-x-4">
//           <select
//             value={currentLanguage}
//             onChange={(e) =>
//               setCurrentLanguage(e.target.value as SupportedLanguage)
//             }
//             className="bg-gray-700 text-gray-200 text-sm rounded-lg px-3 py-1.5 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             {languageOptions.map((lang) => (
//               <option key={lang.id} value={lang.id}>
//                 {lang.name}
//               </option>
//             ))}
//           </select>
//           <button
//             onClick={handleResetCode}
//             className="px-3 py-1.5 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
//           >
//             Reset Code
//           </button>
//         </div>
//       </div>

//       {/* Editor Section */}
//       <div className="flex-1 min-h-0">
//         <Editor
//           height="100%"
//           language={languageMap[currentLanguage]}
//           value={currentCode}
//           onChange={(value) => setCurrentCode(value || "")}
//           theme="vs-dark"
//           options={{
//             minimap: { enabled: false },
//             fontSize: 14,
//             scrollBeyondLastLine: false,
//             automaticLayout: true,
//             tabSize: 2,
//             wordWrap: "on",
//             lineNumbers: "on",
//             glyphMargin: false,
//             folding: true,
//             lineDecorationsWidth: 10,
//             renderLineHighlight: "all",
//           }}
//         />
//       </div>

//       {/* Action Buttons */}
//       <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-y border-gray-700">
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={handleRunCode}
//             disabled={isRunning || !currentCode.trim()}
//             className={`px-4 py-1.5 rounded-lg transition-colors text-sm font-medium ${
//               isRunning
//                 ? "bg-gray-600 cursor-not-allowed"
//                 : "bg-green-600 hover:bg-green-700"
//             } text-white`}
//           >
//             {isRunning ? "Running..." : "Run Code"}
//           </button>
//           <button
//             onClick={handleSubmitCode}
//             disabled={isSubmitting || !currentCode.trim()}
//             className={`px-4 py-1.5 rounded-lg transition-colors text-sm font-medium ${
//               isSubmitting
//                 ? "bg-gray-600 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             } text-white`}
//           >
//             {isSubmitting ? "Submitting..." : "Submit Solution"}
//           </button>
//         </div>
//         <span className="text-xs text-gray-400">{currentLanguage}</span>
//       </div>

//       {/* Draggable Divider */}
//       <div
//         className="h-2 bg-gray-700 hover:bg-blue-600 cursor-row-resize flex items-center justify-center transition-colors group"
//         onMouseDown={handleMouseDown}
//       >
//         <div className="w-16 h-1 bg-gray-500 rounded-full group-hover:bg-white transition-colors"></div>
//       </div>

//       {/* TestCaseOutput Section */}
//       <div
//         className="bg-gray-900 overflow-auto"
//         style={{ height: outputHeight }}
//       >
//         <TestCaseOutput
//           testCases={testCases}
//           workerResponse={workerResponse}
//           isSubmission={isSubmission}
//           isSubmitting={isSubmitting}
//           isLoading={isRunning}
//         />
//       </div>

//       {isDragging && <div className="fixed inset-0 cursor-row-resize z-50" />}
//     </div>
//   );
// };

// export default EditorPanel;




import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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

// ─── Constants ────────────────────────────────────────────────────────────────

const LANGUAGE_MAP: Record<SupportedLanguage, string> = {
  "C++": "cpp",
  C: "c",
  Python: "python",
  JavaScript: "javascript",
};

/** Reads saved draft from sessionStorage. Returns null if nothing found. */
const getDraftFromSession = (assignedProblemId: string) => {
  try {
    const raw = sessionStorage.getItem(`draft_${assignedProblemId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// ─── Component ────────────────────────────────────────────────────────────────

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
    saveDraftToSession,
  } = useAssessment();

  // ── Local state (resets automatically when key changes) ───────────────────
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testCases, setTestCases] = useState<TestCaseResult[]>([]);
  const [workerResponse, setWorkerResponse] = useState<WorkerResponse | null>(null);
  const [isSubmission, setIsSubmission] = useState(false);

  // ── Resizable output panel ─────────────────────────────────────────────────
  const [outputHeight, setOutputHeight] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartYRef = useRef(0);
  const dragStartHeightRef = useRef(0);

  const availableLanguages = useMemo(() => {
    if (!currentProblem?.templateCodes) return [];

    // Map through the templates provided by the backend
    return currentProblem.templateCodes.map((tc) => ({
      id: tc.language as SupportedLanguage,
      name: tc.language,
    }));
  }, [currentProblem]);

  useEffect(() => {
    if (availableLanguages.length > 0) {
      const isCurrentValid = availableLanguages.some(lang => lang.id === currentLanguage);
      
      // If the default language isn't in the list for this problem, 
      // switch to the first available one
      if (!isCurrentValid) {
        setCurrentLanguage(availableLanguages[0].id);
      }
    }
  }, [availableLanguages, currentLanguage, setCurrentLanguage]);

  useEffect(() => {
    if (!currentProblem || !currentAssignedProblemId) return;

    const savedDraft = getDraftFromSession(currentAssignedProblemId);

    // If there's a saved draft for this exact language, restore it
    if (savedDraft?.last_language === currentLanguage && savedDraft?.last_saved_code) {
      setCurrentCode(savedDraft.last_saved_code);
      return;
    }

    // Otherwise, find the template for the selected language
    const template = currentProblem.templateCodes?.find(
      (tc) => tc.language === currentLanguage
    );

    if (template) {
      setCurrentCode(template.basic_code_layout);
      // Save the fresh template to session so we can restore it later
      saveDraftToSession(currentAssignedProblemId, {
        last_language: currentLanguage,
        last_saved_code: template.basic_code_layout,
      });
    }
  }, [currentLanguage, currentAssignedProblemId]); // ← Only re-runs when language or problem ID changes

  // ── Drag-to-resize logic ───────────────────────────────────────────────────

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

      const MIN_HEIGHT = 100;
      const MAX_HEIGHT = containerRect.height * 0.8;

      setOutputHeight(Math.min(Math.max(newHeight, MIN_HEIGHT), MAX_HEIGHT));
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // ── Run Code ──────────────────────────────────────────────────────────────

  const handleRunCode = async () => {
    if (!currentProblem || !currentCode.trim()) return;

    // Capture this request's ID so we can detect if it becomes stale
    // const myRequestId = ++requestIdRef.current;

    setIsRunning(true);
    setIsSubmission(false);
    setTestCases([]);
    setWorkerResponse(null);

    try {
      const testCasesData = currentProblem.testCases!.map((tc) => ({
        testCaseId: tc.id!,
        input: tc.input!,
        expected: tc.expected_output!,
      }));

      const response = await testFlowService.runCodeService({
        language: LANGUAGE_MAP[currentLanguage],
        code: currentCode,
        testCases: testCasesData,
      });

      // If the user clicked Run again while this was running, discard this old result
      // if (requestIdRef.current !== myRequestId) return;

      setWorkerResponse(response.payload!);
      if (response.payload?.results) {
        setTestCases(response.payload.results);
      }
    } catch (err: any) {
      // if (requestIdRef.current !== myRequestId) return;

      setWorkerResponse({
        status: "Failed",
        error: err.message || "Failed to run code",
      });
    } finally {
      // if (requestIdRef.current === myRequestId) {
        setIsRunning(false);
      // }
    }
  };

  // ── Submit Code ───────────────────────────────────────────────────────────

  const handleSubmitCode = useCallback(async () => {
    if (!currentProblem || !currentCode.trim() || !currentAssignedProblemId) {
      alert("Please select a problem first");
      return;
    }

    // const myRequestId = ++requestIdRef.current;

    setIsSubmitting(true);
    setIsSubmission(true);
    setTestCases([]);
    setWorkerResponse(null);

    try {
      const submitData: SubmitCodeData = {
        problemId: currentProblem.id!,
        language: LANGUAGE_MAP[currentLanguage],
        code: currentCode,
        assignedProblemId: currentAssignedProblemId,
      };

      const response = await testFlowService.submitCodeService(submitData);

      // if (requestIdRef.current !== myRequestId) return;

      if (!response.success) {
        throw new Error(response.message || "Submission failed");
      }

      // Mark this problem as submitted in the sidebar
      updateProblemStatus(currentAssignedProblemId, "Submitted");

      const payload = response.payload;

      // Build the worker response based on what came back
      let finalWorkerResponse: WorkerResponse;

      if (payload?.error) {
        // Something went wrong during execution (TLE, Runtime Error, etc.)
        finalWorkerResponse = {
          status: "Failed",
          error: payload.error,
          message: (payload as any)?.message,
        };
        setTestCases([]);
      } else if (payload?.status === "Completed") {
        // All test cases were executed successfully
        const results: TestCaseResult[] = (payload.results || []).map(
          (r: any, index: number) => ({
            ...r,
            index,
            testCaseId: r.testCaseId || `tc-${index}`,
          })
        );
        finalWorkerResponse = {
          status: payload.status,
          time: payload.time,
          totalTestCases: payload.totalTestCases,
          passedTestCases: payload.passedTestCases,
          results,
        };
        setTestCases(results);
      } else {
        // Unexpected response shape
        finalWorkerResponse = { status: "Failed", error: "Unknown execution error" };
        setTestCases([]);
      }

      setWorkerResponse(finalWorkerResponse);
    } catch (err: any) {
      // if (requestIdRef.current !== myRequestId) return;

      setWorkerResponse({
        status: "Failed",
        error: err.message || "Failed to submit",
      });
    } finally {
      // if (requestIdRef.current === myRequestId) {
        setIsSubmitting(false);
      // }
    }
  }, [currentProblem, currentAssignedProblemId, currentCode, currentLanguage]);

  // ── Reset Code ────────────────────────────────────────────────────────────

  /**
   * Resets the editor back to the original template for the current language.
   * Also saves this reset state as the new draft.
   */
  const handleResetCode = async () => {
    const template = currentProblem?.templateCodes?.find(
      (tc) => tc.language === currentLanguage
    );

    if (!template) return;

    // Use `template.basic_code_layout` directly here, NOT `currentCode`.
    // `currentCode` is still the OLD value at this point due to React's
    // async state updates — the setState above hasn't applied yet.
    setCurrentCode(template.basic_code_layout);

    await saveDraft(currentAssignedProblemId!, {
      last_saved_code: template.basic_code_layout,
      last_language: currentLanguage,
    });

    // Clear previous run/submit results
    setTestCases([]);
    setWorkerResponse(null);
  };

  // ── Early return if no problem selected ───────────────────────────────────

  if (!currentProblem) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <p className="text-gray-400">Select a problem to start coding</p>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="h-full flex flex-col bg-gray-900">

      {/* ── Top Toolbar: Language Selector + Reset ── */}
      <div className="bg-gray-800 px-4 py-2 flex items-center space-x-4 border-b border-gray-700">
        <select
          value={currentLanguage}
          onChange={(e) => setCurrentLanguage(e.target.value as SupportedLanguage)}
          className="bg-gray-700 text-gray-200 text-sm rounded-lg px-3 py-1.5 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {availableLanguages.map((lang) => (
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

      {/* ── Monaco Editor ── */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={LANGUAGE_MAP[currentLanguage]}
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

      {/* ── Bottom Toolbar: Run + Submit ── */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-y border-gray-700">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunCode}
            disabled={isRunning || !currentCode.trim()}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-colors ${
              isRunning ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isRunning ? "Running..." : "Run Code"}
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={isSubmitting || !currentCode.trim()}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-colors ${
              isSubmitting ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Solution"}
          </button>
        </div>
        <span className="text-xs text-gray-400">{currentLanguage}</span>
      </div>

      {/* ── Drag Handle (resize the output panel) ── */}
      <div
        className="h-2 bg-gray-700 hover:bg-blue-600 cursor-row-resize flex items-center justify-center transition-colors group"
        onMouseDown={handleMouseDown}
      >
        <div className="w-16 h-1 bg-gray-500 rounded-full group-hover:bg-white transition-colors" />
      </div>

      {/* ── Test Case Output Panel ── */}
      <div className="bg-gray-900 overflow-auto" style={{ height: outputHeight }}>
        <TestCaseOutput
          testCases={testCases}
          workerResponse={workerResponse}
          isSubmission={isSubmission}
          isSubmitting={isSubmitting}
          isLoading={isRunning}
        />
      </div>

      {/* Invisible overlay that keeps the cursor as resize-cursor while dragging */}
      {isDragging && <div className="fixed inset-0 cursor-row-resize z-50" />}
    </div>
  );
};


export default EditorPanel; 