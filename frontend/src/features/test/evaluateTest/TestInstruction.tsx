import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import testService from "../../../services/testFlow.services";

interface LocationState {
  test: any;
  studentId: string;
}

const TestInstruction: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state || {}) as Partial<LocationState>;
  const test = state.test;
  const studentId = state.studentId;

const handleStartTest = async () => {
  if (!slug || !test?.id || !studentId) {
    alert("Missing required test information. Please reopen the test link.");
    // Save test start timestamp
    localStorage.setItem("test_start_time", new Date().toISOString());
    navigate(`/test/${slug}`);
    return;
  } 

  try {
    const res = await testService.startTest(slug,test.id,studentId);
    console.log("Start Test Response:", res);
    if (res?.success && res.payload?.problemId) {

      // Request fullscreen
      const elem = document.documentElement;

      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      }

      navigate(`/test/${slug}/editor/${res.payload.studentAttemptId}`, {
        state: { test, studentId },
      });

    } else {
      alert(res?.message || "Unable to start test. Please try again.");
    }
  } catch(err: any) {
    // console.log(err.response.data.message);
    alert("Unable to start test. Please try again later.");
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

        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm leading-relaxed">
          <li>
            You will have{" "}
            <span className="font-semibold">{test.duration_minutes} minutes</span>{" "}
            to complete the test.
          </li>
          <li>Do not refresh or close the browser window during the test.</li>
          <li>Your code will be auto-saved periodically (implementation pending).</li>
          <li>Make sure you have a stable internet connection.</li>
        </ul>

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={() => navigate(`/test/${slug}`)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
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

