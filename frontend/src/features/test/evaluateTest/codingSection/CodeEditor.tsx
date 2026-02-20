import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import codingProblemService from "../../../../services/codingProblemService";
import Editor from "@monaco-editor/react";
import apiService from "../../../../services/submissionService";
import type{ SubmissionData } from "./types";
import ShowTestCase from "./ShowTestCase";
import { useStopwatch } from "react-timer-hook";
import testService from "../../../../services/testFlowService";
import StudentAttemptService from "../../../../services/studentAttemptService";
import type{ CodingProblemWithTestCasesObject } from "../../../../types/codingProblem.types";
import type { RunCodeResponse, RunCodeResult } from "../../../../types/submission.types";

interface LocationState {
  test?: any;
  studentId?: string;
}
const languageMap: { [key: string]: string } = {
  "63": "javascript",
  "54": "cpp",
};

// interface CodingProblemWithTestCases {
//   id: string;
//   title: string;
//   difficulty: string;
//   topic: string[];
//   problem_description: string;
//   problem_description_image?: string;
//   constraint: string;
//   input_format: string;
//   output_format: string;
//   sample_input: string;
//   sample_output: string;
//   basic_code_layout: string;
//   testcases: {
//     id?: string;
//     input: string;
//     expected_output: string;
//     is_hidden: boolean;
//   }[];
// }

interface TestCaseAndSubmission{
  testCaseId: string;
  submissionId: string;
  status: string;
  apiRes: RunCodeResult;
}

const CodeEditor: React.FC = () => {
  const { slug, studentAttemptId } = useParams();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const [problem, setProblem] = useState<CodingProblemWithTestCasesObject | null>(
    null,
  );
  const [problemId, setProblemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("63");
  const navigate = useNavigate();
  const [testCases, setTestCases] = useState<TestCaseAndSubmission[]>([]);
  const [isFirstSubmit, setIsFirstSubmit] = useState(false);
  const getInitialOffset = () => {
    const savedStart = localStorage.getItem("test_start_time");

    if (!savedStart) return 0;

    const startTime = new Date(savedStart).getTime();
    const now = Date.now();

    // elapsed seconds
    return Math.floor((now - startTime) / 1000);
  };

  const { seconds, minutes, hours } = useStopwatch({
    autoStart: true,
    offsetTimestamp: new Date(Date.now() - getInitialOffset() * 1000),
  });

  const runCode = async () => {
    const inputData = {
      language_id: language,
      source_code: code,
      stdin: problem!.sample_input,
      expected_output: problem!.sample_output,
    };

    // Set to "Processing" immediately so the UI shows activity
    // setTestCases([
    //   {
    //     status: "Processing",
    //     input: problem!.sample_input,
    //     expected_output: problem!.sample_output,
    //     data: null
    //   },
    // ]);

    const res = await apiService.runCodeService(inputData) as RunCodeResponse; 
    if(!res.success){
      alert(res.message);
      return;
    }
    
    const code_output: RunCodeResult = res.payload;
    setTestCases([
    ])

  };

  const submitCode = async () => {
    const inputData = {
      source_code: code,
      language_id: language,
      problem_id: problemId!,
    };

    const res = await apiService.submitCodeService(inputData);

    if (res.success) {
      setIsFirstSubmit(true);
      // Map the backend response and initialize status as "In Queue"
      const initialMapping = res.payload.executionMappingList.map(
        (item: any) => ({
          submissionId: item.submissionId,
          testCaseId: item.testCaseId,
          status: "In Queue",
          data: {}
          // We don't have input/output for hidden test cases yet
        }),
      );

      setTestCases(initialMapping);
    }
    localStorage.removeItem("test_start_time");
  };

  const finishTest = () => {
    if (!window.confirm("Are you sure you want to finish the test?")) return;
    localStorage.removeItem("test_start_time");
    const input: SubmissionData = {
      student_attempt_id: studentAttemptId!,
      problem_id: problemId!,
      language: language,
      source_code: code,
      total_test_cases: testCases.length,
      passed_test_cases: testCases.filter((tc) => tc.status === "Accepted")
        .length,
      status: "Finished",
    };
    const res = testService.finishTest(input, slug!);
    console.log(res);
  };

  useEffect(() => {
    const pendingCases = testCases.filter((tc) =>
      ["In Queue", "Processing"].includes(tc.status),
    );

    if (testCases.length === 0 || pendingCases.length === 0) return;

    const interval = setInterval(() => {
      // Loop through each test case and fetch status if it's pending
      testCases.forEach(async (tc, index) => {
        if (!["In Queue", "Processing"].includes(tc.status)) return;

        try {
          console.log(tc.submissionId);
          const res = await apiService.fetchTestCaseOutput(tc.submissionId);
          console.log(res)
          const newStatus = res.payload.status.description || "Processing";

          // Only update state if the status has actually changed (e.g., In Queue -> Accepted)
          if (newStatus !== tc.status) {
            setTestCases((prev) => {
              const newState = [...prev];
              newState[index] = { ...newState[index], status: newStatus, apiRes: res.payload };
              return newState;
            });
          }
        } catch (error) {
          console.error(`Error polling ${tc.submissionId}:`, error);
        }
      });
    }, 1000); // Polling every 1 second

    return () => clearInterval(interval);
  }, [testCases]); // Reacting to state changes allows for staggered updates

  useEffect(() => {
    const fetchProblem = async () => {
      if (!problemId) return;

      const res =
        await codingProblemService.getCodingProblemWithTestCases(problemId);

      if (res.success) {
        setProblem(res.payload);
      } else {
        console.error(res.message);
      }

      setLoading(false);
    };

    fetchProblem();
  }, [problemId]);


  useEffect(() => {
    console.log("CodeEditor mounted with slug:", slug, "and studentAttemptId:", studentAttemptId);

    const validateStudentAttemptAndGetProblemId = async () => {
      console.log("Validating Student Attempt");
      if (!slug || !studentAttemptId) {
        setLoading(false);
        return;
      }

      try {
        const data = await StudentAttemptService.validateStudentAttempt(studentAttemptId);
        console.log("Validation Result:", data);

        if (!data || !data.success) {
          const msg = data?.message || "Invalid or expired attempt.";
          console.warn("Student attempt validation failed:", msg);
          setValidationError(msg);
          setLoading(false);
          return;
        }

        setProblemId(data.payload.problem_id);
      } catch (err: any) {
        console.error("Validation request failed:", err);
        const userMessage = err?.response?.data?.message || err?.message || "Unable to validate the attempt.";
        setValidationError(userMessage);
      } finally {
        setLoading(false);
      }
    };

    validateStudentAttemptAndGetProblemId();
  }, [slug, studentAttemptId]);

  if (loading) return <div className="p-6">Loading problem...</div>;

  if (validationError)
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="bg-white max-w-xl w-full p-8 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Cannot load this attempt</h2>
          <p className="text-sm text-gray-600 mb-6">{validationError}</p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(`/test/${slug || ""}/instruction`)}
              className="px-4 py-2 rounded-lg bg-[#1DA077] text-white"
            >
              Go to instructions
            </button>

            <button
              onClick={() => navigate("/landing-page")}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    );

  if (!problem) return <div className="p-6">Problem not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="w-full bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {state.test?.title || "Coding Test"}
          </h1>
          <p className="text-xs text-gray-500">
            Test slug: <span className="font-mono">{slug}</span> | Problem ID:{" "}
            <span className="font-mono">{problemId}</span>
          </p>
        </div>
        <div className="text-xs text-gray-500">
          Student ID:{" "}
          <span className="font-mono">{state.studentId || "-"}</span>
        </div>

        <div className="p-3 flex border-inherit rounded-md items-center bg-gray-100">
          <div>
            <span className="font-semibold font-mono text-2xl">Timer: </span>
          </div>
          <div className="mt-0.4 flex font-mono text-red-500 text-2xl">
            <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
          </div>
        </div>
        <div></div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4">
        <section className="flex flex-col justify-between md:w-1/2 w-full bg-white rounded-2xl shadow p-6 overflow-auto">
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">
            {problem.title}
          </h1>

          <p className="text-base mb-4">
            <span className="font-semibold">Difficulty:</span> {problem.difficulty}
          </p>

          <div
            className="text-[15px] leading-7 space-y-4 text-gray-700"
            dangerouslySetInnerHTML={{ __html: problem.problem_description }}
          />

          {/* {problem.problem_description_image && (
            <img
              src={problem.problem_description_image}
              alt="Problem visual"
              className="mt-4 rounded-lg border"
            />
          )} */}

          <h3 className="mt-6 font-semibold text-lg">Constraints</h3>
          <div
            className="text-[15px] leading-7"
            dangerouslySetInnerHTML={{ __html: problem.constraint }}
          />

          <h3 className="mt-6 font-semibold text-lg">Input Format</h3>
          <div
            className="text-[15px] leading-7"
            dangerouslySetInnerHTML={{ __html: problem.input_format }}
          />

          <h3 className="mt-6 font-semibold text-lg">Output Format</h3>
          <div
            className="text-[15px] leading-7"
            dangerouslySetInnerHTML={{ __html: problem.output_format }}
          />

          <h3 className="mt-6 font-semibold text-lg">Sample Input</h3>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm leading-6">
            {problem.sample_input}
          </pre>

          <h3 className="mt-6 font-semibold text-lg">Sample Output</h3>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm leading-6">
            {problem.sample_output}
          </pre>
        </section>


        <section className="md:w-1/2 w-full bg-white rounded-2xl shadow p-5 flex flex-col">
          <h2 className="font-semibold mb-3 text-gray-900">Code Editor</h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mb-3 w-max border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#1DA077] focus:border-[#1DA077]"
          >
            <option value="63">JavaScript</option>
            <option value="54">C++</option>
          </select>
          <Editor
            height="50%"
            language={languageMap[language]}
            value={code}
            // theme="vs-dark"
            onChange={(value?: string) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              scrollBeyondLastLine: false,
            }}
            className="flex-1 w-full border border-gray-300 rounded-xl overflow-hidden font-mono text-sm outline-none focus:ring-2 focus:ring-[#1DA077]"
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={runCode}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Run Code
            </button>
            <button
              onClick={submitCode}
              className="px-4 py-2 text-sm rounded-lg bg-[#1DA077] text-white font-semibold hover:bg-[#148562]"
            >
              Submit
            </button>
            <button
              disabled={!isFirstSubmit}
              onClick={finishTest}
              className="px-4 py-2 text-sm rounded-lg bg-red-400 text-white font-semibold hover:bg-red-500"
            >
              Finish
            </button>
          </div>
          <ShowTestCase
            sampleInput={problem.sample_input}
            sampleOutput={problem.sample_output}
            testResults={testCases}
          />
        </section>
      </main>
    </div>
  );
};

export default CodeEditor;