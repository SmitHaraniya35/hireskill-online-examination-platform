import { useEffect, useState } from "react";

interface ShowTestCaseProps {
  sampleInput: string;
  sampleOutput: string;
  testResults: any[]; // Array of { submissionId, testCaseId, status }
}

const ShowTestCase: React.FC<ShowTestCaseProps> = ({
  sampleInput,
  sampleOutput,
  testResults
}) => {
  const [activeCase, setActiveCase] = useState(0);

  // If no run/submit has happened, show the default sample view
  const displayCases =
    testResults.length > 0
      ? testResults
      : [
          {
            input: sampleInput,
            expected_output: sampleOutput,
            status: "Ready",
            data: null
          },
        ];

  const [isError, setIsError] = useState(false);  
  const currentCase = displayCases[activeCase] || displayCases[0];

  useEffect(()=>{
    console.log(currentCase)
    // if(currentCase.data.stderr || currentCase.data.compile_output){
    //   console.log("code error")
    //   setIsError(true);
    // }
  },[])

  return (
    <div className="mt-4 w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex-col scroll-auto items-center justify-center gap-2 px-4 py-2 bg-gray-50 border-b overflow-x-auto">
        {!isError && displayCases.map((tc, index) => (
          <button
            key={index}
            onClick={() => setActiveCase(index)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition ${
              activeCase === index
                ? "bg-white border-gray-300 shadow-sm"
                : "border-transparent text-gray-500"
            }`}
          >
            Case {index + 1}
            <span
              className={`ml-2 ${
                tc.status === "Accepted"
                  ? "text-green-500"
                  : tc.status === "Wrong Answer"
                    ? "text-red-500"
                    : "text-amber-500 animate-pulse"
              }`}
            >
              ●
            </span>
          </button>
        ))}
      </div>

      { <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Result:</span>
          <span
            className={`text-sm font-bold px-2 py-0.5 rounded ${
              currentCase.status === "Accepted"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {currentCase.status}
          </span>
          
        </div>

        {isError && <div>{currentCase.data.stderr !== null ? currentCase.data.stderr : currentCase.data.compile_output }</div>}

        {/* Input & Output (Mostly visible for Run Code or Sample) */}
        {!isError &&  currentCase.input && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Input</p>
              <pre className="mt-1 bg-gray-50 p-2 rounded border font-mono text-sm">
                {currentCase.input}
              </pre>
            </div>
            {currentCase.output && (
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">
                  Your Output
                </p>
                <pre className="mt-1 bg-gray-50 p-2 rounded border font-mono text-sm">
                  {currentCase.output}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>}
    </div>
  );
};

export default ShowTestCase;
