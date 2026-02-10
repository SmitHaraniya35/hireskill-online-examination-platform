import React from "react";
import { useLocation, useParams } from "react-router-dom";

interface LocationState {
  test?: any;
  studentId?: string;
}

const CodeEditor: React.FC = () => {
  const params = useParams();
  const slug = params.slug;
  const problemId = params.problemId;
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

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
          Student ID: <span className="font-mono">{state.studentId || "-"}</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4">
        {/* Placeholder for problem description */}
        <section className="md:w-1/2 w-full bg-white rounded-xl shadow p-4 overflow-auto">
          <h2 className="font-semibold mb-2 text-gray-900">Problem Description</h2>
          <p className="text-gray-600 text-sm">
            Problem details and rich description will be loaded here using the
            problemId.
          </p>
        </section>

        {/* Placeholder for code editor */}
        <section className="md:w-1/2 w-full bg-white rounded-xl shadow p-4 flex flex-col">
          <h2 className="font-semibold mb-2 text-gray-900">Code Editor</h2>
          <textarea
            className="flex-1 w-full border border-gray-300 rounded-lg p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-[#1DA077] focus:border-[#1DA077]"
            placeholder="// Write your solution here..."
          />
          <div className="flex justify-end gap-2 mt-3">
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

