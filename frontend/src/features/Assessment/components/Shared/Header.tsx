import React, { useState } from "react";
import { useAssessment } from "../../context/AssessmentContext";
import { useNavigate, useParams } from "react-router-dom";
import ExamTimer from "../../../../components/ExamTimer";
import testFlowService from "../../../../services/testFlow.services";
import { STUDENT_ATTEMPT_STATUS } from "../../../../types/studentAttempts.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

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
  const [openFinishDialog, setOpenFinishDialog] = useState(false);
  const { slug } = useParams();

  const handleFinishTest = async () => {
    if (currentAssignedProblemId && currentCode && currentLanguage) {
      await saveDraft(currentAssignedProblemId!, {
        last_saved_code: currentCode,
        last_language: currentLanguage,
      });
    }

    await testFlowService.finishTestService(slug!, {
      student_attempt_id: studentAttemptId,
      status: STUDENT_ATTEMPT_STATUS.SUBMITTED,
    });
    navigate("/test/complete", { replace: true });
  };

  const handleTimeUp = async () => {
    if (currentAssignedProblemId && currentCode && currentLanguage) {
      await saveDraft(currentAssignedProblemId!, {
        last_saved_code: currentCode,
        last_language: currentLanguage,
      });
    }
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

        <div>
          <ExamTimer expiresAt={testExpiresAt} onTimeUp={handleTimeUp} />
        </div>

        <div className="flex items-center space-x-90">
          <button
            onClick={() => setOpenFinishDialog(true)}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm shadow-sm"
          >
            Finish Test
          </button>
        </div>
      </div>
      <AlertDialog open={openFinishDialog} onOpenChange={setOpenFinishDialog}>
        <AlertDialogContent
          size="sm"
          className="rounded-2xl border border-gray-100 shadow-lg"
        >
          <AlertDialogHeader className="space-y-1">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-rose-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M15 12h3.75M15 15h3.75M21 12V7.5a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 7.5v9.75a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 17.25V12z"
                  />
                </svg>
              </div>
              <AlertDialogTitle className="text-[15px] font-medium text-gray-900">
                Submit Test
              </AlertDialogTitle>
            </div>

            <AlertDialogDescription className="text-[13px] text-gray-500 leading-relaxed">
              Are you sure you want to finish the test? You won't be able to
              make changes after submission.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-1 sm:space-x-0 gap-2">
            <AlertDialogCancel className="h-8 px-4 text-[13px] font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-none m-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinishTest}
              className="h-8 px-4 text-[13px] font-medium rounded-lg bg-rose-700 hover:bg-rose-800 text-white shadow-none m-0 flex items-center gap-1.5"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Header;
