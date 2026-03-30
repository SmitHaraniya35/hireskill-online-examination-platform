import React, { useEffect, useState } from "react";
import StatusBadge from "../Shared/StatusBadge";
import { useAssessment } from "../../context/AssessmentContext";

const DescriptionPanel: React.FC = () => {
  const {
    currentProblemId,
    currentProblem,
    loadProblemDetails,
    currentAssignedProblemId,
  } = useAssessment();
  const [, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadProblemDetails(currentProblemId!, currentAssignedProblemId!);
    setLoading(false);
  }, [currentAssignedProblemId, currentProblemId]);

  if (!currentProblem) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <p className="text-gray-500">Select a problem to view description</p>
      </div>
    );
  }

  const renderHTML = (htmlString: string) => (
    <div dangerouslySetInnerHTML={{ __html: htmlString }} />
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentProblem.title}
          </h2>
          <StatusBadge
            type="difficulty"
            value={currentProblem.difficulty as "Easy" | "Medium" | "Hard"}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Description
          </h3>
          <div className="text-gray-600">
            {currentProblem.problem_description ? (
              renderHTML(currentProblem.problem_description)
            ) : (
              <p>No description available.</p>
            )}
          </div>
        </div>

        {/* Input Format */}
        {currentProblem.input_format && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Input Format
            </h3>
            <div className="text-gray-600">
              {renderHTML(currentProblem.input_format)}
            </div>
          </div>
        )}

        {/* Output Format */}
        {currentProblem.output_format && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Output Format
            </h3>
            <div className="text-gray-600">
              {renderHTML(currentProblem.output_format)}
            </div>
          </div>
        )}

        {/* Examples */}
        {currentProblem.testCases && currentProblem.testCases.length > 0 && (
          <div className="mb-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              Examples
            </h3>
            <div className="space-y-4">
              {currentProblem.testCases
                .filter((tc) => !tc.is_hidden)
                .slice(0, 3)
                .map((tc, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-700">
                        Example {index + 1}
                      </p>
                    </div>

                    {/* Input */}
                    <div className="mb-5">
                      <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Input
                      </span>
                      <div className=" text-sm text-blue-700 bg-blue-50/50 border border-blue-200 rounded-lg p-2">
                        <pre className="whitespace-pre-wrap leading-relaxed">
                          {tc.input}
                        </pre>
                      </div>
                    </div>

                    {/* Output */}
                    <div>
                      <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Output
                      </span>
                      <div className=" text-sm text-green-700 bg-green-50/50 border border-green-200 rounded-lg p-2 ">
                        <pre className="whitespace-pre-wrap leading-relaxed">
                          {tc.expected_output}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Constraints */}
        {currentProblem.constraint && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Constraints
            </h3>
            <div className="text-gray-600">
              {renderHTML(currentProblem.constraint)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(DescriptionPanel);
