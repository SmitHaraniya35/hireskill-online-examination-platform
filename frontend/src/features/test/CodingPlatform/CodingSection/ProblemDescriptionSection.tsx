import React from "react";
import type { CodingProblemData } from "../../../../types/codingProblem.types";

interface ProblemDescriptionSectionProps {
  problem: CodingProblemData;
}

const ProblemDescriptionSection: React.FC<ProblemDescriptionSectionProps> = ({ problem }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-6 overflow-auto h-full">
      <h1 className="text-3xl font-semibold text-gray-900 mb-3">
        {problem.title}
      </h1>

      <div className="mb-4">
        <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full 
          {problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
           problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
           'bg-red-100 text-red-700'}">
          {problem.difficulty}
        </span>
      </div>

      <div className="space-y-6">
        {/* Problem Description */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Problem Description</h2>
          <div
            className="text-[15px] leading-7 text-gray-700 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: problem.problem_description }}
          />
        </div>

        {/* Constraints */}
        <div>
          <h3 className="font-semibold text-lg">Constraints</h3>
          <div
            className="text-[15px] leading-7 bg-gray-50 p-4 rounded-lg"
            dangerouslySetInnerHTML={{ __html: problem.constraint }}
          />
        </div>

        {/* Input Format */}
        <div>
          <h3 className="font-semibold text-lg">Input Format</h3>
          <div
            className="text-[15px] leading-7"
            dangerouslySetInnerHTML={{ __html: problem.input_format }}
          />
        </div>

        {/* Output Format */}
        <div>
          <h3 className="font-semibold text-lg">Output Format</h3>
          <div
            className="text-[15px] leading-7"
            dangerouslySetInnerHTML={{ __html: problem.output_format }}
          />
        </div>

        {/* Sample Input */}
        <div>
          <h3 className="font-semibold text-lg">Sample Input</h3>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
            {problem.sample_input}
          </pre>
        </div>

        {/* Sample Output */}
        <div>
          <h3 className="font-semibold text-lg">Sample Output</h3>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
            {problem.sample_output}
          </pre>
        </div>

        {/* Additional Image if exists */}
        {problem.problem_description_image && (
          <div>
            <h3 className="font-semibold text-lg">Visual Reference</h3>
            <img
              src={problem.problem_description_image}
              alt="Problem visual"
              className="mt-2 rounded-lg border max-w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDescriptionSection;