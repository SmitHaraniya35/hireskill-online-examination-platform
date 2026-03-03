import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type {
  StudentAttempt,
  Submission,
} from "../../../types/studentAttempts.types";

interface LocationState {
  studentAttempt: StudentAttempt;
  submission?: Submission;
}

const TestCompletePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState | undefined;

  // If user directly visits URL without state
  if (!state || !state.studentAttempt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
          <h2 className="text-lg font-semibold mb-4">
            Invalid Access
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-lg bg-[#1DA077] text-white hover:bg-[#148562]"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const {submission } = state;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-green-600 mb-6 text-center">
          Test Finished Successfully
        </h1>

        {/* Submission Details */}
        {submission && (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium">Status</span>
              <span className="font-semibold text-blue-600">
                {submission.status}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Test Cases</span>
              <span>
                {submission.passed_test_cases} /
                {submission.total_test_cases}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Execution Time</span>
              <span>{submission.execution_time || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Memory Used</span>
              <span>{submission.memory_used || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Submitted At</span>
              <span>
                {new Date(submission.submitted_at).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Footer Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-lg bg-[#1DA077] text-white font-semibold hover:bg-[#148562] transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestCompletePage;