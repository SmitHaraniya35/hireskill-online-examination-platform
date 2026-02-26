import React, { useState, useEffect, useCallback } from "react";
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

interface LocationState {
  test?: TestData;
  studentId?: string;
}

const CodingTestLayout: React.FC = () => {
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

  // Shared state for code editor
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("63");

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
          setValidationError(
            response?.message || "Invalid or expired attempt.",
          );
        }
      } catch (err: any) {
        setValidationError(
          err.response?.data?.message || "Unable to validate the attempt.",
        );
      } finally {
        setLoading(false);
      }
    };

    validateAttempt();
  }, [slug, studentAttemptId]);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!problemId) return;

      const res = await codingProblemService.getCodingProblemWithTestCases(problemId);

      if (res.success) {
        setProblem(res.payload!.codingProblemWithTestCases);
      } else {
        console.error(res.message);
      }

      setLoading(false);
    };

    fetchProblem();
  }, [problemId]);

  const handleFinishTest = useCallback(async () => {
    if (!studentAttemptId || !problemId || !code || !language) return;

    try {
      const finishData: FinishData = {
        student_attempt_id: studentAttemptId,
        problem_id: problemId,
        language: language,
        source_code: code,
        total_test_cases: testCases.length,
        passed_test_cases: testCases.filter((tc) => tc.status === "Accepted")
          .length,
        status: "Finished",
      };

      const response = await testFlowService.finishTest(slug!, finishData);

      navigate(`/test/${slug}/complete`, {});
    } catch (error) {
      console.error("Error finishing test:", error);
      alert("Failed to finish test. Please try again.");
    }
  }, [studentAttemptId, problemId, code, language, testCases, slug, navigate]);

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
          <h2 className="text-xl font-semibold mb-2">
            Cannot load this attempt
          </h2>
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
            Student ID:{" "}
            <span className="font-mono">{state.studentId || "-"}</span>
          </div>

          {studentAttemptId && (
            <ExamTimer
              studentAttemptId={studentAttemptId!}
              onTimeUp={handleFinishTest}
            />
          )}
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
          <CodeEditor
            problem={problem}
            code={code}
            setCode={setCode}
            language={language}
            testCases={testCases}
            setLanguage={setLanguage}
            setTestCases={setTestCases}
            setIsSubmitted={setIsSubmitted}
            studentAttemptId={studentAttemptId}
          />

          {problem !== undefined && (
            <TestCaseOutputSection
              testCases={testCases}
              setTestCases={setTestCases}
              sampleInput={problem.sample_input}
              sampleOutput={problem.sample_output}
            />
          )}
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

export default CodingTestLayout;
