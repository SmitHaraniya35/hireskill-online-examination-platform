import { StudentAssignedProblem } from "../models/student_assigned_problem.model.ts";
import { ERROR_MESSAGES } from "../constants/index.ts";
import { HttpStatusCode } from "../constants/index.ts";
import { HttpError } from "../utils/httpError.utils.ts";
import type { StudentAssingProblemDraftData } from "../types/controller/studentAssignedProblemData.types.ts";

export const createStudentAssignedProblemService = async (codingProblemList: string[], student_attempt_id: string) => {
    const studentAssignedProblems = await StudentAssignedProblem.insertMany(
      codingProblemList.map((problem_id) => ({
        problem_id,
        student_attempt_id,
      }))
    );

    if(!studentAssignedProblems) {
        throw new HttpError(
            ERROR_MESSAGES.STUDENT_ASSIGNED_PROBLEM_CREATION_FAILED,
            HttpStatusCode.INTERNAL_SERVER_ERROR,
        )
    }

    return { studentAssignedProblems };
};

export const getStudentAssignedProblemsByStudentAttemptIdService = async (student_attempt_id: string) => {
  const studentAssignedProblems = await StudentAssignedProblem.findActive({ student_attempt_id }, {
    _id: 0,
    id: 1,
    problem_id: 1,
    is_submitted: 1,
    last_saved_code: 1,
    last_language: 1,
    last_saved_at: 1,
    status: 1,
  }).populate({
    path: "codingProblem",
    select: "id title difficulty -_id"
  });

  if(!studentAssignedProblems) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ASSIGNED_PROBLEMS_NOT_FOUND,
      HttpStatusCode.NOT_FOUND
    );
  }
  return { studentAssignedProblems };
};

export const getStudentAssignedProblemsWithSubmissionDetailsByStudentAttemptIdService = async (student_attempt_id: string) => {
  const studentAssignedProblems = await StudentAssignedProblem.findActive({ student_attempt_id })
    .populate({
      path: "submission",
      select: "id total_test_cases passed_test_cases -_id"
    })
    .populate({
      path: "codingProblem",
      select: "id title difficulty -_id"
    })
    .select('id problem_id status is_submitted');

  if(!studentAssignedProblems) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ASSIGNED_PROBLEMS_NOT_FOUND,
      HttpStatusCode.NOT_FOUND
    );
  }

  return { studentAssignedProblems };
};

export const saveStudentAssignedProblemDraftService = async (input: StudentAssingProblemDraftData) => {
  const { id, last_saved_code, last_language } = input;

  const studentAssignedProblem = await StudentAssignedProblem.updateOneByFilter(
    { id },
    {
      last_saved_code,
      last_language,
      last_saved_at: new Date(),
    }
  );

  if(studentAssignedProblem.matchedCount === 0) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ASSIGNED_PROBLEM_SAVE_DRAFT_FAILED,
      HttpStatusCode.NOT_FOUND
    );
  }

  return { studentAssignedProblem };
};

export const submittedStudentAssignedProblemService = async (id: string) => {
  const studentAssignedProblem = await StudentAssignedProblem.updateOneByFilter(
    { id },
    { 
      status: "Submitted",
      is_submitted: true
    }
  );

  if(studentAssignedProblem.matchedCount === 0) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ASSIGNED_PROBLEMS_NOT_FOUND,
      HttpStatusCode.NOT_FOUND
    );
  }

  return { studentAssignedProblem };
};

export const attemptedStudentAssignedProblemService = async (id: string) => {
  const studentAssignedProblem = await StudentAssignedProblem.updateOneByFilter(
    { id },
    { status: "Attempted" }
  );
  if(studentAssignedProblem.matchedCount === 0) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ASSIGNED_PROBLEMS_NOT_FOUND,
      HttpStatusCode.NOT_FOUND
    );
  }

  return { studentAssignedProblem };
};