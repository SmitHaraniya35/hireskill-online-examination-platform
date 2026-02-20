import React, { useState } from 'react';
import type { TestCaseResult } from './types'

interface ShowTestCaseProps {
  sampleInput: string;
  sampleOutput: string;
  testResults: TestCaseResult[];  // Results from code submission
}

// Display case when no submission has been made yet
const createSampleCase = (input: string, output: string): TestCaseResult => ({
  testCaseId: 'sample',
  submissionId: 'sample',
  status: 'Ready',
  input,
  output: '', // No actual output yet
  expected_output: output,
  apiRes: undefined,
});

const ShowTestCase: React.FC<ShowTestCaseProps> = ({
  sampleInput,
  sampleOutput,
  testResults
}) => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Determine what to display:
  // - If we have results, show those
  // - Otherwise show the sample input/output as a "ready" state
  const displayCases = testResults.length > 0 
    ? testResults 
    : [createSampleCase(sampleInput, sampleOutput)];

  const currentCase = displayCases[activeTab] || displayCases[0];

  // Get status color for the dot indicator
  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'Accepted': return 'text-green-500';
      case 'Wrong Answer': return 'text-red-500';
      case 'In Queue':
      case 'Processing': return 'text-amber-500 animate-pulse';
      default: return 'text-gray-500';
    }
  };

  // Get background color for status badge
  const getStatusBadgeClass = (status: string): string => {
    switch(status) {
      case 'Accepted': return 'bg-green-100 text-green-700';
      case 'Wrong Answer': return 'bg-red-100 text-red-700';
      case 'In Queue':
      case 'Processing': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="mt-4 w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Tab navigation - only show if we have results */}
      {displayCases.length > 1 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b overflow-x-auto">
          {displayCases.map((tc, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-2 ${
                activeTab === index
                  ? "bg-white border-gray-300 shadow-sm"
                  : "border-transparent text-gray-500 hover:bg-gray-100"
              }`}
            >
              Case {index + 1}
              <span className={getStatusColor(tc.status)}>●</span>
            </button>
          ))}
        </div>
      )}

      {/* Results content */}
      <div className="p-4 space-y-4">
        {/* Status badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Status:</span>
          <span className={`text-sm font-bold px-2 py-0.5 rounded ${getStatusBadgeClass(currentCase.status)}`}>
            {currentCase.status}
          </span>
        </div>

        {/* Show error if present (compile error, runtime error, etc.) */}
        {currentCase.apiRes?.stderr && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-xs font-bold text-red-600 uppercase mb-1">Error</p>
            <pre className="text-sm text-red-700 font-mono whitespace-pre-wrap">
              {currentCase.apiRes.stderr}
            </pre>
          </div>
        )}

        {currentCase.apiRes?.compile_output && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-xs font-bold text-red-600 uppercase mb-1">Compilation Error</p>
            <pre className="text-sm text-red-700 font-mono whitespace-pre-wrap">
              {currentCase.apiRes.compile_output}
            </pre>
          </div>
        )}

        {/* Show input and output (for non-error cases) */}
        {!currentCase.apiRes?.stderr && !currentCase.apiRes?.compile_output && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Input</p>
              <pre className="bg-gray-50 p-3 rounded border font-mono text-sm whitespace-pre-wrap">
                {currentCase.input || sampleInput}
              </pre>
            </div>

            {/* Expected Output (always show for reference) */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Expected Output</p>
              <pre className="bg-gray-50 p-3 rounded border font-mono text-sm whitespace-pre-wrap">
                {currentCase.expected_output || sampleOutput}
              </pre>
            </div>

            {/* Your Output (only show if we have actual output) */}
            {currentCase.output && (
              <div className="md:col-span-2">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Your Output</p>
                <pre className={`p-3 rounded border font-mono text-sm whitespace-pre-wrap ${
                  currentCase.output === (currentCase.expected_output || sampleOutput)
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  {currentCase.output}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowTestCase;