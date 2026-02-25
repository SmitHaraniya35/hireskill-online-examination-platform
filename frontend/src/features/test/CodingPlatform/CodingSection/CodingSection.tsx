import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";
import ProblemDescriptionSection from './ProblemDescriptionSection';
import CodeEditorSection from "./CodeEditorSection";
import TestCaseOutputSection from "./TestCaseOutputSection";
import testFlowService from "../../../../services/testFlow.services";
import type { TestData } from "../../../../types/testFlow.types";
import type { CodingProblemData } from "../../../../types/codingProblem.types";
import type { TestCaseResult } from "../../../../types/editor.types";
import codingProblemService from "../../../../services/codingProblem.services";

interface LocationState {
  test?: TestData;
  studentId?: string;
}

const CodingSection: React.FC = () => {
  const { slug, studentAttemptId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const [problem, setProblem] = useState<CodingProblemData | null>(null);
  const [problemId, setProblemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [testCases, setTestCases] = useState<TestCaseResult[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get initial timer offset from localStorage
  const getInitialOffset = () => {
    const savedStart = localStorage.getItem("test_start_time");
    if (!savedStart) return 0;
    const startTime = new Date(savedStart).getTime();
    const now = Date.now();
    return Math.floor((now - startTime) / 1000);
  };

  const { seconds, minutes, hours, pause } = useStopwatch({
    autoStart: true,
    offsetTimestamp: new Date(Date.now() - getInitialOffset() * 1000),
  });


  const handleFinishTest = async () => {
    if (!studentAttemptId || !problemId || !code || !language) return;
    
    try {
      const finishData = {
        student_attempt_id: studentAttemptId,
        problem_id: problemId,
        language: language,
        source_code: code,
        total_test_cases: testCases.length,
        passed_test_cases: testCases.filter((tc) => tc.status === "Accepted").length,
        status: "Finished",
      };

      const response = await testFlowService.finishTest(slug!, finishData);
      
      if (response.success) {
        localStorage.removeItem("test_start_time");
        navigate(`/test/${slug}/complete`, {
          state: { result: response.payload }
        });
      }
    } catch (error) {
      console.error("Error finishing test:", error);
      alert("Failed to finish test. Please try again.");
    }
  };

  // Validate student attempt on mount
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

  useEffect(() => {
    const fetchProblem = async () => {
      if (!problemId) return;

      const res =
        await codingProblemService.getCodingProblemWithTestCases(problemId);

      if (res.success) {
        setProblem(res.payload!.codingProblemWithTestCases);
      } else {
        console.error(res.message);
      }

      setLoading(false);
    };

    fetchProblem();
  }, [problemId]);

  // Shared state for code editor
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("63");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading problem...</div>
      </div>
    );
  }

  if (validationError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="bg-white max-w-xl w-full p-8 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Cannot load this attempt</h2>
          <p className="text-sm text-gray-600 mb-6">{validationError}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(`/test/${slug}/instruction`)}
              className="px-4 py-2 rounded-lg bg-[#1DA077] text-white hover:bg-[#148562]"
            >
              Go to instructions
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Problem not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {state.test?.title || "Coding Test"}
          </h1>
          <p className="text-xs text-gray-500">
            Problem: <span className="font-mono">{problem.title}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-xs text-gray-500">
            Student ID: <span className="font-mono">{state.studentId || "-"}</span>
          </div>
          
          <div className="p-3 rounded-md bg-gray-100">
            <span className="font-semibold font-mono text-2xl">Timer: </span>
            <span className="font-mono text-red-500 text-2xl">
              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4">
        {/* Problem Description Section */}
        <div className="lg:w-1/2">
          <ProblemDescriptionSection problem={problem} />
        </div>

        {/* Code Editor and Test Cases Section */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <CodeEditorSection
            problem={problem}
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
            setTestCases={setTestCases}
            setIsSubmitted={setIsSubmitted}
            studentAttemptId={studentAttemptId}
          />
          
          {problem!==undefined &&
            <TestCaseOutputSection
            testCases={testCases}
            setTestCases={setTestCases}
            sampleInput={problem.sample_input}
            sampleOutput={problem.sample_output}
          />
          }
          {/* Finish Button */}
          {isSubmitted && (
            <div className="flex justify-end">
              <button
                onClick={handleFinishTest}
                className="px-6 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                Finish Test
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CodingSection;