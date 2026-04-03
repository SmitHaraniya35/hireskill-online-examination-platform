import React, { useCallback, useState } from "react";
import { AssessmentProvider, useAssessment } from "./context/AssessmentContext";
import Header from "./components/Shared/Header";
import ProblemGrid from "./components/Dashboard/ProblemGrid";
import Sidebar from "./components/IDE/Sidebar";
import DescriptionPanel from "./components/IDE/DescriptionPanel";
import EditorPanel from "./components/IDE/EditorPanel";
import { useNavigate, useParams } from "react-router-dom";
import { useProctoring } from "../../hooks/useProctoring";
import testFlowService from "@/services/testFlow.services";
import { STUDENT_ATTEMPT_STATUS } from "@/types/studentAttempts.types";

const AssessmentContent: React.FC = () => {
  const {
    isDashboardView,
    saveDraft,
    currentCode,
    currentLanguage,
    currentAssignedProblemId,
    studentAttemptId,
  } = useAssessment();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { slug } = useParams();
  const [hasStarted, setHasStarted] = useState(false);

  const handleAutoFinish = useCallback(async () => {
    if (currentAssignedProblemId && currentCode.trim() !== "") {
      try {
        await saveDraft(currentAssignedProblemId, {
          last_saved_code: currentCode,
          last_language: currentLanguage,
        });
      } catch (err) {
        console.error("Draft save failed during auto-submit:", err);
      }
    }

    try {
      await testFlowService.finishTestService(slug!, {
        student_attempt_id: studentAttemptId,
        status: STUDENT_ATTEMPT_STATUS.VIOLATION_DETECTED,
      });
    } catch (err) {
      console.error("Final submission failed:", err);
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
    }

    navigate("/test/complete", { replace: true });
  }, [
    currentAssignedProblemId,
    currentCode,
    currentLanguage,
    studentAttemptId,
    slug,
    saveDraft,
    navigate,
  ]);

  const { isViolation, countdown, enterFullscreen } = useProctoring(
    handleAutoFinish,
    hasStarted,
  );
  

  // const handleStart = () => {
  //   enterFullscreen();
  //   setHasStarted(true);
  // };

  const handleStart = async () => {
  try {
    // 1. Request Camera and Microphone access
    // This creates the "Allow/Block" browser popup
    await navigator.mediaDevices.getUserMedia({ 
      video: true, 
      audio: true 
    });

    // 2. If successful, proceed to Fullscreen and start Proctoring
    enterFullscreen();
    setHasStarted(true);
  } catch (err) {
    // 3. If user denies or hardware is missing, show an alert
    console.error("Permissions denied or hardware missing:", err);
    alert(
      "Camera and Microphone access are required to start this assessment. Please allow permissions in your browser settings and try again."
    );
  }
};

  if (!hasStarted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Ready to start the assessment?
          </h1>
          <p className="mb-6 text-gray-400">
            The test will open in Fullscreen mode. Exiting will end your
            session.
          </p>
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
          >
            Enter Fullscreen & Start
          </button>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  if (isDashboardView) {
    return (
      <div className="min-h-screen bg-gray-50">
        {isViolation && (
          <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/80 backdrop-blur-sm text-white">
            <div className="text-center p-8 border-2 border-red-500 rounded-xl bg-gray-900 shadow-2xl max-w-md w-full mx-4">
              <h2 className="text-3xl font-bold text-red-500 mb-4 tracking-tight">
                PROCTORING VIOLATION!
              </h2>
              <p className="text-xl mb-2 font-semibold">
                You have left the exam environment.
              </p>
              <p className="text-lg text-gray-400 mb-6">
                Test will auto-submit in:{" "}
                <span className="text-red-500  text-3xl ml-2">
                  {countdown}s
                </span>
              </p>
              <button
                onClick={enterFullscreen}
                className="w-full px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg uppercase tracking-wider transition-all animate-pulse shadow-lg shadow-red-500/20"
              >
                RE-ENTER FULLSCREEN NOW
              </button>
            </div>
          </div>
        )}
        <Header />
        <main>
          <ProblemGrid />
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* RESTRICTED AREA OVERLAY */}
      {isViolation && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/80 backdrop-blur-sm text-white">
          <div className="text-center p-8 border-2 border-red-500 rounded-xl bg-gray-900 shadow-2xl max-w-md w-full mx-4">
            <h2 className="text-3xl font-bold text-red-500 mb-4 tracking-tight">
              PROCTORING VIOLATION!
            </h2>
            <p className="text-xl mb-2 font-semibold">
              You have left the exam environment.
            </p>
            <p className="text-lg text-gray-400 mb-6">
              Test will auto-submit in:{" "}
              <span className="text-red-500  text-3xl ml-2">{countdown}s</span>
            </p>
            <button
              onClick={enterFullscreen}
              className="w-full px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg uppercase tracking-wider transition-all animate-pulse shadow-lg shadow-red-500/20"
            >
              RE-ENTER FULLSCREEN NOW
            </button>
          </div>
        </div>
      )}
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <div
          className={`flex-1 flex transition-all duration-300 ${
            isSidebarOpen ? "ml-0" : "ml-0"
          }`}
        >
          <div
            className={`${isSidebarOpen ? "w-2/5" : "w-1/3"} border-r border-gray-200 transition-all duration-300`}
          >
            <DescriptionPanel />
          </div>
          <div
            className={`${isSidebarOpen ? "w-3/5" : "w-2/3"} transition-all duration-300`}
          >
            <EditorPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

const AssessmentPage: React.FC = () => {
  return (
    <AssessmentProvider>
      <AssessmentContent />
    </AssessmentProvider>
  );
};

export default AssessmentPage;
