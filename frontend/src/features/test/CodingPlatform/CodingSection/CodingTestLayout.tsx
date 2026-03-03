// import React, { useState, useEffect, useCallback } from "react";
// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import ProblemDescriptionSection from "./ProblemDescription";
// import TestCaseOutputSection from "./TestCaseOutput";
// import testFlowService from "../../../../services/testFlow.services";
// import type { FinishData, TestData } from "../../../../types/testFlow.types";
// import type { CodingProblemData } from "../../../../types/codingProblem.types";
// import type { TestCaseResult } from "../../../../types/editor.types";
// import codingProblemService from "../../../../services/codingProblem.services";
// import ExamTimer from "../../../../components/ExamTimer";
// import CodeEditor from "./CodeEditor";
// import submissionService from "../../../../services/submission.services";

// interface LocationState {
//   test?: TestData;
//   studentId?: string;
// }

// const CodingTestLayout: React.FC = () => {
//   const { slug, studentAttemptId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const state = location.state as LocationState;

//   const [problem, setProblem] = useState<CodingProblemData | null>(null);
//   const [problemId, setProblemId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [validationError, setValidationError] = useState<string | null>(null);
//   const [testCases, setTestCases] = useState<TestCaseResult[]>([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [totalTestCases,setTotalTestCases] = useState<number | undefined>(0);

//   // Shared state for code editor
//   const [code, setCode] = useState("");
//   const [language, setLanguage] = useState("63");

//   // Validate student attempt on mount
//   useEffect(() => {
//     const validateAttempt = async () => {
//       if (!slug || !studentAttemptId) {
//         setValidationError("Invalid attempt");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await testFlowService.validateStudentAttempt(studentAttemptId);

//         if (response?.success && response.payload?.problem_id) {
//           setProblemId(response.payload.problem_id);
//         } else {
//           setValidationError(
//             response?.message || "Invalid or expired attempt.",
//           );
//         }
//       } catch (err: any) {
//         setValidationError(
//           err.response?.data?.message || "Unable to validate the attempt.",
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     validateAttempt();
//   }, [slug, studentAttemptId]);

//   useEffect(() => {
//     const fetchProblem = async () => {
//       if (!problemId) return;

//       const res = await codingProblemService.getCodingProblemWithTestCases(problemId);

//       if (res.success) {
//         setProblem(res.payload!.codingProblemWithTestCases);
//       } else {
//         console.error(res.message);
//       }

//       setLoading(false);
//     };

//     fetchProblem();
//   }, [problemId]);

//   // const handleFinishTest = useCallback(async () => {
//   //   if (!studentAttemptId || !problemId || !code || !language) return;

//   //   try {
//   //     const finishData: FinishData = {
//   //       student_attempt_id: studentAttemptId,
//   //       problem_id: problemId,
//   //       language: language,
//   //       source_code: code,
//   //       total_test_cases: testCases.length,
//   //       passed_test_cases: testCases.filter((tc) => tc.status === "Accepted")
//   //         .length,
//   //       status: "Finished",
//   //     };

//   //     const response = await testFlowService.finishTest(slug!, finishData);
//   //     const studentAttempt = response.payload?.studentAttempt;
//   //     const submission = response.payload?.submission;

//   //     navigate(`/test/${slug}/complete`, {state:{studentAttempt, submission} });
//   //   } catch (error) {
//   //     console.error("Error finishing test:", error);
//   //     alert("Failed to finish test. Please try again.");
//   //   }
//   // }, [studentAttemptId, problemId, code, language, testCases, slug, navigate]);
//   // Inside CodingTestLayout.tsx

// const handleFinishTest = useCallback(async () => {
//   const confirmFinish = window.confirm(
//     "Are you sure you want to finish the test? You cannot make changes after this."
//   );
//   if (!confirmFinish) return;
//   if (!studentAttemptId || !problemId) return;

//   setLoading(true);

//   try {
//     let finalStatus = "Finished";
//     let passedCount = 0;
//     let totalCases = 0;

//     // Case 1: No code written
//     if (!code.trim()) {
//       finalStatus = "NOT_ATTEMPTED";
//     } 
//     // Case 2: Code exists - submit and evaluate
//     else {
//       const submitRes = await submissionService.submitCodeService({
//         source_code: code,
//         language_id: language,
//         problem_id: problemId,
//       });

//       if (submitRes.success && submitRes.payload?.executionMappingList) {
//         const executionList = submitRes.payload.executionMappingList;
//         totalCases = executionList.length;
        
//         // Poll for all submission results
//         const finalResults = await pollMultipleSubmissions(executionList.map(e => e.submissionId));
        
//         // Check for compilation error (status ID 6) - for compiled languages like C++, Java
//         const compileError = finalResults.find(res => 
//           res?.status?.id === 6 || // Compilation Error
//           res?.compile_output      // Has compilation output
//         );

//         if (compileError) {
//           finalStatus = "COMPILATION_ERROR";
//         } 
//         // Check for runtime error / syntax error (status ID 11) - for interpreted languages like JS
//         else {
//           const runtimeError = finalResults.find(res => 
//             res?.status?.id === 11 || // Runtime Error
//             res?.stderr                // Has stderr output
//           );

//           if (runtimeError) {
//             // Check if it's a syntax error (common in JS)
//             const stderr = runtimeError.stderr || "";
//             if (stderr.includes("SyntaxError") || stderr.includes("ReferenceError")) {
//               finalStatus = "SYNTAX_ERROR";
//             } else {
//               finalStatus = "RUNTIME_ERROR";
//             }
//           }
//           // No errors - calculate pass/fail
//           else {
//             passedCount = finalResults.filter(
//               res => res?.status?.description === "Accepted"
//             ).length;

//             if (passedCount === totalCases && totalCases > 0) {
//               finalStatus = "ACCEPTED";
//             } else if (passedCount > 0) {
//               finalStatus = "PARTIALLY_ACCEPTED";
//             } else {
//               finalStatus = "FAILED";
//             }
//           }
//         }
//       }
//     }

//     // Prepare finish data with error message if any
//     const finishData: FinishData = {
//       student_attempt_id: studentAttemptId,
//       problem_id: problemId,
//       language: language,
//       source_code: code,
//       total_test_cases: totalCases,
//       passed_test_cases: passedCount,
//       status: finalStatus
//     };

//     const response = await testFlowService.finishTest(slug!, finishData);
    
//     if (response.success) {
//       // Navigate with state including error info
//       navigate(`/test/${slug}/complete`, { 
//         state: { 
//           studentAttempt: response.payload?.studentAttempt, 
//           submission: response.payload?.submission,
//           result: {
//             status: finalStatus,
//             passedCount,
//             totalCases,
//           }
//         } 
//       });
//     }
//   } catch (error) {
//     console.error("Error during finish flow:", error);
//     alert("An error occurred. Please try again.");
//   } finally {
//     setLoading(false);
//   }
// }, [studentAttemptId, problemId, code, language, slug, navigate]);

// // Enhanced polling function with better error handling
// const pollMultipleSubmissions = async (ids: string[]) => {
//   const maxAttempts = 15; // Increased for reliability
//   const pollInterval = 1500; // 1.5 seconds
//   let results: any[] = [];
  
//   for (let attempt = 0; attempt < maxAttempts; attempt++) {
//     try {
//       // Fetch all statuses in parallel
//       const responses = await Promise.all(
//         ids.map(id => 
//           submissionService.getSubmissionService(id)
//             .then(r => r.payload?.data)
//             .catch(err => {
//               console.error(`Error polling submission ${id}:`, err);
//               return null;
//             })
//         )
//       );

//       results = responses.filter(Boolean); // Remove nulls

//       // Define final status IDs (anything > 2 is finished)
//       // Status IDs: 1=In Queue, 2=Processing, 3=Accepted, 4=Wrong Answer, 
//       // 5=Time Limit Exceeded, 6=Compilation Error, 11=Runtime Error
//       const allFinished = results.length === ids.length && 
//         results.every(res => res && res.status?.id > 2);
      
//       if (allFinished) {
//         return results;
//       }
      
//       // If not all finished, wait before next poll
//       await new Promise(resolve => setTimeout(resolve, pollInterval));
//     } catch (error) {
//       console.error("Polling error:", error);
//       await new Promise(resolve => setTimeout(resolve, pollInterval));
//     }
//   }
  
//   // Return whatever results we have after max attempts
//   return results;
// };
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-gray-500">Loading problem...</div>
//       </div>
//     );
//   }

//   if (validationError) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
//         <div className="bg-white max-w-xl w-full p-8 rounded-2xl shadow">
//           <h2 className="text-xl font-semibold mb-2">
//             Cannot load this attempt
//           </h2>
//           <p className="text-sm text-gray-600 mb-6">{validationError}</p>
//           <div className="flex gap-3 justify-center">
//             <button
//               onClick={() => navigate(`/test/${slug}/instruction`)}
//               className="px-4 py-2 rounded-lg bg-[#1DA077] text-white hover:bg-[#148562]"
//             >
//               Go to instructions
//             </button>
//             <button
//               onClick={() => navigate("/")}
//               className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
//             >
//               Back to home
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!problem) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-gray-500">Problem not found</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Header */}
//       <header className="w-full bg-white border-b px-6 py-4 flex justify-between items-center">
//         <div>
//           <h1 className="text-lg font-bold text-gray-900">
//             {state.test?.title || "Coding Test"}
//           </h1>
//           <p className="text-xs text-gray-500">
//             Problem: <span className="font-mono">{problem.title}</span>
//           </p>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="text-xs text-gray-500">
//             Student ID:{" "}
//             <span className="font-mono">{state.studentId || "-"}</span>
//           </div>

//           {studentAttemptId && (
//             <ExamTimer
//               studentAttemptId={studentAttemptId!}
//               onTimeUp={handleFinishTest}
//             />
//           )}
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4">
//         {/* Problem Description Section */}
//         <div className="lg:w-1/2">
//           <ProblemDescriptionSection problem={problem} />
//         </div>

//         {/* Code Editor and Test Cases Section */}
//         <div className="lg:w-1/2 flex flex-col gap-4">
//           <CodeEditor
//             problem={problem}
//             code={code}
//             setCode={setCode}
//             language={language}
//             testCases={testCases}
//             setLanguage={setLanguage}
//             setTestCases={setTestCases}
//             setIsSubmitted={setIsSubmitted}
//             studentAttemptId={studentAttemptId}
//           />

//           {problem !== undefined && (
//             <TestCaseOutputSection
//               testCases={testCases}
//               setTestCases={setTestCases}
//               sampleInput={problem.sample_input}
//               sampleOutput={problem.sample_output}
//               isSubmission={isSubmitted}
//             />
//           )}
//           {/* Finish Button */}
//           {(
//             <div className="flex justify-end">
//               <button
//                 onClick={handleFinishTest}
//                 className="px-6 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
//               >
//                 Finish Test
//               </button>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default CodingTestLayout;


import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ProblemDescriptionSection from "./ProblemDescription";
import TestCaseOutputSection from "./TestCaseOutput";
import testFlowService from "../../../../services/testFlow.services";
import type { FinishData, TestData } from "../../../../types/testFlow.types";
import type { CodingProblemData } from "../../../../types/codingProblem.types";
import type { TestCaseResult } from "../../../../types/editor.types";
import codingProblemService from "../../../../services/codingProblem.services";
import ExamTimer from "../../../../components/ExamTimer";
import CodeEditor from "./CodeEditor";
import submissionService from "../../../../services/submission.services";

interface LocationState {
  test?: TestData;
  studentId?: string;
}

const CodingTestLayout: React.FC = () => {
  const { slug, studentAttemptId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  // Core state
  const [problem, setProblem] = useState<CodingProblemData | null>(null);
  const [problemId, setProblemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Test case state
  const [testCases, setTestCases] = useState<TestCaseResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Code editor state
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("63");

  // Polling refs
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Validate attempt on mount
  useEffect(() => {
    const validateAttempt = async () => {
      if (!slug || !studentAttemptId) {
        setValidationError("Invalid attempt");
        setLoading(false);
        return;
      }

      try {
        const response = await testFlowService.validateStudentAttempt(studentAttemptId);
        if (response?.success && response.payload?.problem_id) {
          setProblemId(response.payload.problem_id);
        } else {
          setValidationError(response?.message || "Invalid or expired attempt.");
        }
      } catch (err: any) {
        setValidationError(err.response?.data?.message || "Unable to validate the attempt.");
      } finally {
        setLoading(false);
      }
    };

    validateAttempt();
  }, [slug, studentAttemptId]);

  // Fetch problem
  useEffect(() => {
    const fetchProblem = async () => {
      if (!problemId) return;
      const res = await codingProblemService.getCodingProblemWithTestCases(problemId);
      if (res.success) {
        setProblem(res.payload!.codingProblemWithTestCases);
      }
    };
    fetchProblem();
  }, [problemId]);

  // POLLING LOGIC - Centralized in parent
  const pollSubmissions = useCallback(async (submissionIds: string[]) => {
    const hasPending = testCases.some(tc => 
      ["In Queue", "Processing"].includes(tc.status)
    );
    
    if (!hasPending) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    const updatedCases = [...testCases];
    let hasUpdates = false;

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
            hasUpdates = true;
          }
        }
      } catch (error) {
        console.error(`Error polling ${tc.submissionId}:`, error);
      }
    }

    if (hasUpdates) {
      setTestCases(updatedCases);
    }
  }, [testCases]);

  // Start/stop polling based on pending cases
  useEffect(() => {
    const hasPending = testCases.some(tc => 
      ["In Queue", "Processing"].includes(tc.status)
    );

    if (hasPending && !pollingIntervalRef.current) {
      pollingIntervalRef.current = setInterval(() => pollSubmissions([]), 2000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [testCases, pollSubmissions]);

  // Poll until complete (for finish test)
  const pollUntilComplete = useCallback(async (ids: string[], maxAttempts = 15) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const responses = await Promise.all(
        ids.map(id => 
          submissionService.getSubmissionService(id)
            .then(r => r.payload?.data)
            .catch(() => null)
        )
      );

      const results = responses.filter(Boolean);
      const allFinished = results.length === ids.length && 
        results.every(res => res?.status?.id! > 2);

      if (allFinished) return results;
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    return [];
  }, []);

  // HANDLERS - All business logic in parent

  const handleRunCode = useCallback(async () => {
    if (!problem) return;
    setIsRunning(true);
    
    try {
      const response = await submissionService.runCodeService({
        language_id: language,
        source_code: code,
        stdin: problem.sample_input || "",
        expected_output: problem.sample_output?.trimStart() || "",
      });

      if (response.success && response.payload) {
        setTestCases([{
          testCaseId: "",
          submissionId: response.payload.token,
          status: response.payload.status?.description || "Completed",
          input: problem.sample_input || "",
          output: response.payload.stdout || "",
          expected_output: problem.sample_output || "",
          apiRes: response.payload,
        }]);
      } else {
        alert(response.message || "Failed to run code");
      }
    } catch (error) {
      console.error("Run code error:", error);
      alert("Failed to run code. Please try again.");
    } finally {
      setIsRunning(false);
    }
  }, [problem, code, language]);

  const handleSubmitCode = useCallback(async () => {
    if (!problem?.id) return;
    setIsSubmitting(true);

    try {
      // First check for syntax errors via run
      const runRes = await submissionService.runCodeService({
        language_id: language,
        source_code: code,
        stdin: problem.sample_input || "",
        expected_output: problem.sample_output?.trimStart() || "",
      });

      if (runRes.payload?.compile_output || runRes.payload?.stderr) {
        setTestCases([{
          testCaseId: "",
          submissionId: runRes.payload.token,
          status: runRes.payload.compile_output ? "Compilation Error" : "Runtime Error",
          input: problem.sample_input || "",
          output: "",
          expected_output: problem.sample_output || "",
          apiRes: runRes.payload,
        }]);
        return;
      }

      // Submit for all test cases
      const response = await submissionService.submitCodeService({
        source_code: code,
        language_id: language,
        problem_id: problem.id,
      });

      if (response.success && response.payload?.executionMappingList) {
        const initialTestCases = response.payload.executionMappingList.map(item => ({
          submissionId: item.submissionId,
          testCaseId: item.testCaseId,
          status: "In Queue",
          input: "",
          expected_output: "",
          output: "",
          apiRes: undefined,
        }));
        setTestCases(initialTestCases);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit code");
    } finally {
      setIsSubmitting(false);
    }
  }, [problem, code, language]);

  // const handleFinishTest = useCallback(async () => {
  //   const confirmFinish = window.confirm(
  //     "Are you sure you want to finish the test? You cannot make changes after this."
  //   );
  //   if (!confirmFinish || !studentAttemptId || !problemId || isFinishing) return;

  //   setIsFinishing(true);

  //   try {
  //     let finalStatus = "NOT_ATTEMPTED";
  //     let passedCount = 0;
  //     let totalCases = 0;

  //     if (code.trim()) {
  //       const submitRes = await submissionService.submitCodeService({
  //         source_code: code,
  //         language_id: language,
  //         problem_id: problemId,
  //       });

  //       if (submitRes.success && submitRes.payload?.executionMappingList) {
  //         const executionList = submitRes.payload.executionMappingList;
  //         totalCases = executionList.length;
          
  //         const finalResults = await pollUntilComplete(executionList.map(e => e.submissionId));
          
  //         // Determine final status
  //         const compileError = finalResults.find(r => r?.status?.id === 6);
  //         if (compileError) {
  //           finalStatus = "COMPILATION_ERROR";
  //         } else {
  //           const runtimeError = finalResults.find(r => r?.status?.id === 11);
  //           if (runtimeError) {
  //             finalStatus = runtimeError.stderr?.includes("RuntimeError") 
  //               ? "RUNTIME_ERROR" 
  //               : "SYNTAX_ERROR";
  //           } else {
  //             passedCount = finalResults.filter(r => r?.status?.description === "Accepted").length;
  //             if (passedCount === totalCases) finalStatus = "ACCEPTED";
  //             else if (passedCount > 0) finalStatus = "PARTIALLY_ACCEPTED";
  //             else finalStatus = "FAILED";
  //           }
  //         }
  //       }
  //     }

  //     const finishData: FinishData = {
  //       student_attempt_id: studentAttemptId,
  //       problem_id: problemId,
  //       language: language,
  //       source_code: code,
  //       total_test_cases: totalCases,
  //       passed_test_cases: passedCount,
  //       status: finalStatus,
  //     };

  //     const response = await testFlowService.finishTest(slug!, finishData);
      
  //     if (response.success) {
  //       navigate(`/test/${slug}/complete`, { 
  //         state: { 
  //           studentAttempt: response.payload?.studentAttempt, 
  //           submission: response.payload?.submission,
  //           result: { status: finalStatus, passedCount, totalCases }
  //         } 
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Finish error:", error);
  //     alert("Failed to finish test");
  //     setIsFinishing(false);
  //   }
  // }, [studentAttemptId, problemId, code, language, slug, navigate, isFinishing, pollUntilComplete]);

  const handleFinishTest = useCallback(async () => {
  const confirmFinish = window.confirm(
    "Are you sure you want to finish the test? You cannot make changes after this."
  );
  if (!confirmFinish || !studentAttemptId || !problemId || isFinishing) return;

  setIsFinishing(true);

  try {
    let finalStatus = "NOT_ATTEMPTED";
    let passedCount = 0;
    let totalCases = 0;

    if (code.trim()) {
      const submitRes = await submissionService.submitCodeService({
        source_code: code,
        language_id: language,
        problem_id: problemId,
      });

      if (submitRes.success && submitRes.payload?.executionMappingList) {
        const executionList = submitRes.payload.executionMappingList;
        totalCases = executionList.length;
        
        const finalResults = await pollUntilComplete(executionList.map(e => e.submissionId));
        
        // ⬇️ ONLY THIS PART CHANGED - Status detection logic
        // Determine final status based on what Run button would show
        const compileError = finalResults.find(r => r?.compile_output);
        if (compileError) {
          finalStatus = "COMPILATION_ERROR";
        } else {
          const runtimeError = finalResults.find(r => r?.stderr);
          if (runtimeError) {
            const stderr = runtimeError.stderr || "";
            if (stderr.includes("SyntaxError") || stderr.includes("Unexpected token")) {
              finalStatus = "SYNTAX_ERROR";
            } else {
              finalStatus = "RUNTIME_ERROR";
            }
          } else {
            passedCount = finalResults.filter(r => r?.status?.description === "Accepted").length;
            if (passedCount === totalCases && totalCases > 0) {
              finalStatus = "ACCEPTED";
            } else if (passedCount > 0) {
              finalStatus = "PARTIALLY_ACCEPTED";
            } else {
              finalStatus = "NOT_ACCEPTED";
            }
          }
        }
      }
    }

    const finishData: FinishData = {
      student_attempt_id: studentAttemptId,
      problem_id: problemId,
      language: language,
      source_code: code,
      total_test_cases: totalCases,
      passed_test_cases: passedCount,
      status: finalStatus,
    };

    const response = await testFlowService.finishTest(slug!, finishData);
    
    if (response.success) {
      navigate(`/test/${slug}/complete`, { 
        state: { 
          studentAttempt: response.payload?.studentAttempt, 
          submission: response.payload?.submission,
          result: { status: finalStatus, passedCount, totalCases }
        } 
      });
    }
  } catch (error) {
    console.error("Finish error:", error);
    alert("Failed to finish test");
    setIsFinishing(false);
  }
}, [studentAttemptId, problemId, code, language, slug, navigate, isFinishing, pollUntilComplete]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading problem...</div>;
  }

  if (validationError || !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="bg-white max-w-xl w-full p-8 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">
            {validationError ? "Cannot load this attempt" : "Problem not found"}
          </h2>
          <p className="text-sm text-gray-600 mb-6">{validationError || "Unable to load the problem."}</p>
          <button onClick={() => navigate(`/test/${slug}/instruction`)} className="px-4 py-2 rounded-lg bg-[#1DA077] text-white">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="w-full bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-gray-900">{state.test?.title || "Coding Test"}</h1>
          <p className="text-xs text-gray-500">Problem: {problem.title}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-gray-500">
            Student ID: {state.studentId || "-"}
          </div>

          {studentAttemptId && (
            <ExamTimer studentAttemptId={studentAttemptId} onTimeUp={handleFinishTest} />
          )}

          {/* Finish Button in Header */}
          <button
            onClick={handleFinishTest}
            disabled={isFinishing}
            className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition disabled:opacity-50"
          >
            {isFinishing ? "Finishing..." : "Finish Test"}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4">
        <div className="lg:w-1/2">
          <ProblemDescriptionSection problem={problem} />
        </div>

        <div className="lg:w-1/2 flex flex-col gap-4">
          {/* CodeEditor - Now just a UI component */}
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
            onRun={handleRunCode}
            onSubmit={handleSubmitCode}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
          />

          {/* TestCaseOutput - Pure UI component */}
          <TestCaseOutputSection
            testCases={testCases}
            sampleInput={problem.sample_input}
            sampleOutput={problem.sample_output}
          />
        </div>
      </main>
    </div>
  );
};

export default CodingTestLayout;