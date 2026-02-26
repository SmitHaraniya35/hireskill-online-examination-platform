import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import submissionService from "../../../../services/submission.services";
import type { CodingProblemData } from "../../../../types/codingProblem.types";
import type { TestCaseResult } from "../../../../types/editor.types";
import type { RunData, SubmitData } from "../../../../types/submission.types";

interface CodeEditorProps {
  problem: CodingProblemData;
  code: string;
  setCode: (code: string) => void;
  language: string;
  testCases: TestCaseResult[];
  setLanguage: (language: string) => void;
  setTestCases: (testCases: TestCaseResult[] | ((prev: TestCaseResult[]) => TestCaseResult[])) => void;
  setIsSubmitted: (submitted: boolean) => void;
  studentAttemptId?: string;
}

const languageMap: { [key: string]: string } = {
  "63": "javascript",
  "54": "cpp",
};

const languageOptions = [
  { id: "63", name: "JavaScript" },
  { id: "54", name: "C++" },
];

const CodeEditor: React.FC<CodeEditorProps> = ({
  problem,
  code,
  setCode,
  language,
  setLanguage,
  setTestCases,
  setIsSubmitted,
  studentAttemptId,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRunCode = async () => {
    if (!problem) return;
    // setTestCases([]);
    setIsRunning(true);
    try {
      const inputData: RunData = {
        language_id: language,
        source_code: code,
        stdin: problem.sample_input || "",
        expected_output: problem.sample_output?.trimStart() || "",
      };
      const response = await submissionService.runCodeService(inputData);
      
      if (response.success && response.payload) {
        // Create a single test case result for the sample
        const sampleResult = {
          testCaseId: "",
          submissionId: response.payload.token,
          status: response.payload.status?.description || "Completed",
          input: problem.sample_input || "",
          output: response.payload.stdout || "",
          expected_output: problem.sample_output || "",
          apiRes: response.payload,
        };
        setTestCases([sampleResult]);
        return sampleResult;
      } else {
        alert(response.message || "Failed to run code");
      }
    } catch (error) {
      console.error("Run code error:", error);
      alert("Failed to run code. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!problem.id) return;

    setIsSubmitting(true);
    try {
      const inputData:SubmitData = {
        source_code: code,
        language_id: language,
        problem_id: problem.id,
      };

     const res =  await handleRunCode();
      if(res && (res.apiRes?.compile_output || res.apiRes?.stderr )){
        return;
      }

      const response = await submissionService.submitCodeService(inputData);

      if (response.success && response.payload?.executionMappingList) {
        // Initialize test cases with "In Queue" status
        const initialTestCases = response.payload.executionMappingList.map((item) => ({
          submissionId: item.submissionId,
          testCaseId: item.testCaseId,
          status: "In Queue",
          input: "", // Will be populated when status is fetched
          expected_output: "", // Will be populated when status is fetched
          apiRes: undefined,
        }));

        setTestCases(initialTestCases);
        setIsSubmitted(true);
      } else {
        alert(response.message || "Failed to submit code");
      }
    } catch (error: any) {
      console.error("Submit code error:", error);
      alert("Failed to submit code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-5 flex flex-col h-[600px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-gray-900">Code Editor</h2>
        
        {/* Language Selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-max border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#1DA077] focus:border-[#1DA077]"
        >
          {languageOptions.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-[400px] border border-gray-300 rounded-xl overflow-hidden">
        <Editor
          height="100%"
          language={languageMap[language]}
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={handleRunCode}
          disabled={isRunning || !code.trim()}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? "Running..." : "Run Code"}
        </button>
        <button
          onClick={handleSubmitCode}
          disabled={isSubmitting || !code.trim()}
          className="px-4 py-2 text-sm rounded-lg bg-[#1DA077] text-white font-semibold hover:bg-[#148562] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      {/* Student Attempt ID (hidden, for debugging) */}
      {studentAttemptId && (
        <div className="mt-2 text-xs text-gray-400 text-right">
          Attempt ID: {studentAttemptId}
        </div>
      )}
    </div>
  );
};

export default React.memo(CodeEditor);