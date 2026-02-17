import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import codingProblemService from "../../services/codingProblemService";
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import apiService from "../../services/submissionService";
import ShowTestCase from "./ShowTestCase";
import {useStopwatch} from 'react-timer-hook';

interface LocationState {
  test?: any;
  studentId?: string;
}
const languageMap: { [key: string]: string } = {
  "63": "javascript",
  "54": "cpp",
};

interface CodingProblemWithTestCases {
  id: string;
  title: string;
  difficulty: string;
  topic: string[];
  problem_description: string;
  problem_description_image?: string;
  constraint: string;
  input_format: string;
  output_format: string;
  sample_input: string;
  sample_output: string;
  basic_code_layout: string;
  testcases: {
    id?: string;
    input: string;
    expected_output: string;
    is_hidden: boolean;
  }[];
}


const CodeEditor: React.FC = () => {
  const { slug, problemId } = useParams();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const [problem, setProblem] = useState<CodingProblemWithTestCases | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("63");
  const [output, setOutput] = useState(" ");
  const [executingMappingList, setExecutingMappingList] = useState<any[]>([]);
  const [testCases, setTestCases] = useState<any[]>([]);

  // const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setCode(event.target.value);
  // }
  // const {
  //   seconds,
  //   minutes,
  //   hours,
  // } = useStopwatch({ autoStart: true});
      const getInitialOffset = () => {
        const savedStart = localStorage.getItem("test_start_time");

        if (!savedStart) return 0;

        const startTime = new Date(savedStart).getTime();
        const now = Date.now();

        // elapsed seconds
        return Math.floor((now - startTime) / 1000);
      };
      const {
      seconds,
      minutes,
      hours,
    } = useStopwatch({
      autoStart: true,
      offsetTimestamp: new Date(Date.now() - getInitialOffset() * 1000),
    });

  const runCode = async () => {
    const inputData = {
      language_id: parseInt(language),
      source_code: code,
      stdin: problem!.sample_input,
      expected_output: problem!.sample_output
    };

    // Set to "Processing" immediately so the UI shows activity
    setTestCases([{ 
      status: "Processing", 
      input: problem!.sample_input, 
      expected_output: problem!.sample_output 
    }]);

    const { payload } = await apiService.runCodeService(inputData);
    
    // Update the testCases state with the actual result from the 'run' API
    // Usually, 'run' API payload contains stdout and status
    setTestCases([{
      status: payload.status?.description || (payload.stdout === problem!.sample_output ? "Accepted" : "Wrong Answer"),
      input: problem!.sample_input,
      output: payload.stdout,
      expected_output: problem!.sample_output
    }]);
    
    setOutput(payload.stdout);
  };

  const submitCode = async () => {
    const inputData = {
      source_code: code,
      language_id: language,     
      problem_id: problemId!,
    };
    
    const res = await apiService.submitCodeService(inputData);
    
    if (res.success) {
      // Map the backend response and initialize status as "In Queue"
      const initialMapping = res.payload.executionMappingList.map((item: any) => ({
        submissionId: item.submissionId,
        testCaseId: item.testCaseId,
        status: "In Queue",
        // We don't have input/output for hidden test cases yet
      }));
      
      setTestCases(initialMapping);
    }
    localStorage.removeItem("test_start_time");

  };

  useEffect(() => {
    const pendingCases = testCases.filter(tc => 
      ["In Queue", "Processing"].includes(tc.status)
    );

    if (testCases.length === 0 || pendingCases.length === 0) return;

    const interval = setInterval(() => {
      // Loop through each test case and fetch status if it's pending
      testCases.forEach(async (tc, index) => {
        if (!["In Queue", "Processing"].includes(tc.status)) return;

        try {
          const res = await apiService.fetchTestCaseOutput(tc.submissionId);
          const newStatus = res.payload.status || "Processing";

          // Only update state if the status has actually changed (e.g., In Queue -> Accepted)
          if (newStatus !== tc.status) {
            setTestCases(prev => {
              const newState = [...prev];
              newState[index] = { ...newState[index], status: newStatus };
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

      const res = await codingProblemService.getCodingProblemWithTestCases(problemId);

      if (res.success) {
        setProblem(res.payload);
      } else {
        console.error(res.message);
      }

      setLoading(false);
    };

    fetchProblem();
  }, [problemId]);

  if (loading) return <div className="p-6">Loading problem...</div>;

  if (!problem) return <div className="p-6">Problem not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
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
          Student ID: <span className="font-mono">{state.studentId || "-"}</span>
        </div>
        
        <div className="p-3 flex border-inherit rounded-md items-center bg-gray-100">
          <div>
            <span className="font-semibold font-mono text-2xl">Timer: </span>
          </div>
          <div className="mt-0.4 flex font-mono text-red-500 text-2xl">
            <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
          </div>
        </div>
        <div>

        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4">
        <section className="md:w-1/2 w-full bg-white rounded-2xl shadow p-5 overflow-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">{problem.title}</h1>

          <p className="text-sm mb-3">
            <span className="font-semibold">Difficulty:</span> {problem.difficulty}
          </p>

          <div
            className="text-gray-700 text-sm space-y-3"
            dangerouslySetInnerHTML={{ __html: problem.problem_description }}
          />

          {problem.problem_description_image && (
            <img
              src={problem.problem_description_image}
              alt="Problem visual"
              className="mt-3 rounded-lg border"
            />
          )}

          <h3 className="mt-5 font-semibold">Constraints</h3>
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: problem.constraint }}
          />

          <h3 className="mt-5 font-semibold">Input Format</h3>
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: problem.input_format }}
          />

          <h3 className="mt-5 font-semibold">Output Format</h3>
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: problem.output_format }}
          />

          <h3 className="mt-5 font-semibold">Sample Input</h3>
          <pre className="bg-gray-100 p-3 rounded-lg text-sm">{problem.sample_input}</pre>

          <h3 className="mt-5 font-semibold">Sample Output</h3>
          <pre className="bg-gray-100 p-3 rounded-lg text-sm">{problem.sample_output}</pre>

          <h3 className="mt-5 font-semibold">Visible Testcases</h3>
          <div className="space-y-2">
            {problem.testcases
              .filter((tc) => !tc.is_hidden)
              .map((tc, index) => (
                <div key={tc.id} className="border rounded-lg p-3 text-sm bg-gray-50">
                  <p className="font-semibold">Testcase {index + 1}</p>
                  <p>
                    <span className="font-medium">Input:</span> {tc.input}
                  </p>
                  <p>
                    <span className="font-medium">Expected Output:</span> {tc.expected_output}
                  </p>
                </div>
              ))}
          </div>
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
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false }, 
              fontSize: 16,
              scrollBeyondLastLine: false,
            }}
            className="flex-1 w-full border border-gray-300 rounded-xl overflow-hidden font-mono text-sm outline-none focus:ring-2 focus:ring-[#1DA077]"
          />
          {/* <div>
            <p>{output}</p>
          </div> */}
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={runCode} className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              Run Code
            </button>
            <button onClick={submitCode} className="px-4 py-2 text-sm rounded-lg bg-[#1DA077] text-white font-semibold hover:bg-[#148562]">
              Submit
            </button>
            <button onClick={submitCode} className="px-4 py-2 text-sm rounded-lg bg-red-400 text-white font-semibold hover:bg-red-500">
              Finish
            </button>
          </div>
          <ShowTestCase
            sampleInput = {problem.sample_input}
            sampleOutput = {problem.sample_output}
            testResults={testCases}
          />
        </section>
      </main>
    </div>
  );
};

export default CodeEditor;