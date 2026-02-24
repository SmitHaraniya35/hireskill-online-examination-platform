import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import testFlowService from "../../../services/testFlow.services";
import type { TestData } from "../../../types/testFlow.types";

interface LocationState {
  test: TestData;
  studentId: string;
}

const TestInstruction: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const state = location.state as LocationState;
  const test = state?.test;
  const studentId = state?.studentId;

  const handleStartTest = async () => {
    if (!slug || !test?.id || !studentId) {
      alert("Missing required test information. Please reopen the test link.");
      navigate(`/test/${slug}`);
      return;
    }

    try {
      const response = await testFlowService.startTest(slug, test.id, studentId);
      
      if (response?.success && response.payload?.problemId && response.payload?.studentAttemptId) {
        // Request fullscreen
        try {
          const elem = document.documentElement;
          if (elem.requestFullscreen) {
            await elem.requestFullscreen();
          }
        } catch (fullscreenError) {
          console.warn("Fullscreen request failed:", fullscreenError);
          // Continue even if fullscreen fails
        }

        navigate(`/test/${slug}/editor/${response.payload.studentAttemptId}`, {
          state: { test, studentId },
        });
      } else {
        alert(response?.message || "Unable to start test. Please try again.");
      }
    } catch (err: any) {
      console.error("Start test error:", err);
      alert(err.response?.data?.message || "Unable to start test. Please try again later.");
    }
  };

  if (!test) {
    return (
      <div className="font-mono min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Session Lost</h1>
          <p className="text-gray-600 mb-4">
            We could not find your test session. Please go back to the test link
            and login again.
          </p>
          <button
            onClick={() => navigate(`/test/${slug}`)}
            className="w-full bg-[#1DA077] text-white py-2.5 rounded-lg font-semibold hover:bg-[#148562] transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-mono min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white max-w-2xl w-full p-10 rounded-2xl shadow space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {test.title} - Instructions
          </h1>
          <p className="text-gray-600">
            Please read all instructions carefully before starting the test.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Important Guidelines:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm leading-relaxed">
            <li>
              You will have{" "}
              <span className="font-semibold">{test.duration_minutes} minutes</span>{" "}
              to complete the test.
            </li>
            <li>The test will automatically submit when the timer expires.</li>
            <li>Do not refresh or close the browser window during the test.</li>
            <li>Your code will be auto-saved periodically.</li>
            <li>Make sure you have a stable internet connection.</li>
            <li>You can run your code against sample test cases before final submission.</li>
            <li>Only final submission will be considered for evaluation.</li>
            <li>The test will enter fullscreen mode when started.</li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <span className="font-bold">Note:</span> Once you start the test, the timer will begin and cannot be paused. 
            Please ensure you're in a distraction-free environment.
          </p>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={() => navigate(`/test/${slug}`)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition"
          >
            Back
          </button>
          <button
            onClick={handleStartTest}
            className="px-5 py-2 rounded-lg bg-[#1DA077] text-white text-sm font-semibold hover:bg-[#148562] transition"
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestInstruction;