import { StudentAssignedProblem } from "../models/student_assigned_problem.model.ts";
import { ERROR_MESSAGES } from "../constants/index.ts";
import { HttpStatusCode } from "../constants/index.ts";
import { HttpError } from "../utils/httpError.utils.ts";

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