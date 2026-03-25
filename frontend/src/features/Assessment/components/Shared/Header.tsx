import React from "react";
import { useAssessment } from "../../context/AssessmentContext";
import { useNavigate, useParams } from "react-router-dom";
import ExamTimer from "../../../../components/ExamTimer";
import testFlowService from "../../../../services/testFlow.services";
import { STUDENT_ATTEMPT_STATUS } from "../../../../types/studentAttempts.types";

const Header: React.FC = () => {
  const {
    testTitle,
    testDuration,
    testExpiresAt,
    studentAttemptId,
    currentAssignedProblemId,
    currentCode,
    currentLanguage,
    saveDraft,
  } = useAssessment();
  const navigate = useNavigate();
  const { slug } = useParams();

  const handleFinishTest = async () => {
    // if (window.confirm("Are you sure you want to submit the test?")) {
    //   if (currentAssignedProblemId && currentCode && currentLanguage) {
    //     await saveDraft(currentAssignedProblemId!, {
    //       last_saved_code: currentCode,
    //       last_language: currentLanguage,
    //     });
    //   }

    //   await testFlowService.finishTestService(slug!, {
    //     student_attempt_id: studentAttemptId,
    //     status: STUDENT_ATTEMPT_STATUS.SUBMITTED,
    //   });
    //   navigate("/test/complete", { replace: true });
    // }
  };

  const handleTimeUp = async () => {
    if (currentAssignedProblemId && currentCode && currentLanguage) {
      await saveDraft(currentAssignedProblemId!, {
        last_saved_code: currentCode,
        last_language: currentLanguage,
      });
    }
    console.log("HandleTimeUp", currentCode, currentLanguage);
    await testFlowService.finishTestService(slug!, {
      student_attempt_id: studentAttemptId,
      status: STUDENT_ATTEMPT_STATUS.AUTO_SUBMITTED,
    });
    navigate("/test/complete", { replace: true });
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-x-4">
          <h1 className="text-xl font-semibold text-gray-800">{testTitle}</h1>
          <span className="font-bold font-extralight">
            Duration: {testDuration} min
          </span>
        </div>

        <div className="flex items-center space-x-90">
          <ExamTimer expiresAt={testExpiresAt} onTimeUp={handleTimeUp} />
          <button
            onClick={handleFinishTest}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm shadow-sm"
          >
            Finish Test
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
