import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import codingProblemService from "../../services/codingProblemService";

interface LocationState {
  test?: any;
  studentId?: string;
}

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

          <textarea
            defaultValue={problem.basic_code_layout}
            className="flex-1 w-full border border-gray-300 rounded-xl p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-[#1DA077] focus:border-[#1DA077]"
          />

          <div className="flex justify-end gap-3 mt-4">
            <button className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              Run Code
            </button>
            <button className="px-4 py-2 text-sm rounded-lg bg-[#1DA077] text-white font-semibold hover:bg-[#148562]">
              Submit
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CodeEditor;