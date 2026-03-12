import { ERROR_MESSAGES, HttpStatusCode } from "../constants/index.ts";
import { CodingProblem } from "../models/coding_problem.model.ts";
import { Student } from "../models/student.model.ts";
import { StudentAttempt } from "../models/student_attempt.model.ts";
import { Test } from "../models/test.model.ts";
import type { AuthJwtPayload } from "../types/controller/index.ts";
import type { CodingProblemDocument } from "../types/model/coding_problem.document.ts";
import type { StudentAttemptDocument } from "../types/model/student_attempt.document.ts";
import type { TestDocument } from "../types/model/test.document.ts";
import { HttpError } from "../utils/httpError.utils.ts";
import { generateAccessToken } from "../utils/jwt.utils.ts";
import { createStudentService } from "./student.service.ts";
import { getTestByIdService } from "./test.service.ts";

export const createStudentAttemptService = async (
  test_id: string,
  student_id: string,
) => {
  const test: TestDocument | null = await Test.findByIdActive(test_id);
  if (!test || !test.is_active) {
    throw new HttpError(
      ERROR_MESSAGES.INVALID_TEST_LINK,
      HttpStatusCode.NOT_FOUND,
    );
  }

  const started_at = new Date();
  const expires_at = new Date(
    started_at.getTime() + test.duration_minutes * 60 * 1000,
  );

  const studentAttempt: StudentAttemptDocument = await StudentAttempt.create({
    test_id,
    student_id,
    started_at,
    expires_at,
  });

  if (!studentAttempt) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ATTEMPT_CREATION_FAILED,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }

  return { studentAttempt };
};

export const deleteStudentAttemptService = async (id: string) => {
  const studentAttempt = await StudentAttempt.softDelete({ id });

  if (!studentAttempt) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ATTEMPT_DELETION_FAILED,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }

  return { studentAttempt };
};

export const getStudentAttemptsDetailsByTestIdService = async (
  test_id: string,
) => {
  const test = await getTestByIdService(test_id);
  if (!test) {
    throw new HttpError(
      ERROR_MESSAGES.TEST_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  const students = await StudentAttempt.findActive({ test_id })
    .populate({
      path: "student",
      select: "id name email phone -_id",
    })
    .select(
      "id started_at expires_at finished_at is_submitted is_active student_id -_id",
    );

  if (!students) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ATTEMPTS_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  return { students };
};

export const submitStudentAttemptService = async (id: string) => {
  const studentAttempt: StudentAttemptDocument | null =
    await StudentAttempt.findOneAndUpdate({id}, {
      is_active: false,
      is_submitted: true
    }).select("-_id -isDeleted -deletedAt -updatedAt -createdAt");

  if (!studentAttempt) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ATTEMPT_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  if (!studentAttempt.is_active && studentAttempt.is_submitted) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ATTEMPT_ALREADY_SUBMITTED,
      HttpStatusCode.BAD_REQUEST,
    );
  }

  return { studentAttempt };
};

export const validateStudentAttemptAndGetCodingProblemIdService = async (id: string, studenTokenData: AuthJwtPayload) => {
  const studentAttempt: any = await StudentAttempt.findOneActive({ id }).populate('student');
  if(!studentAttempt){
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ATTEMPT_NOT_FOUND,
      HttpStatusCode.NOT_FOUND
    );
  }

  if(studentAttempt.student.email !== studenTokenData.email || studentAttempt.student.id !== studenTokenData.userId){
    throw new HttpError(
      ERROR_MESSAGES.UNAUTHORIZED_USER,
      HttpStatusCode.UNAUTHORIZED
    );
  }

  const problem_id = studentAttempt.problem_id;
  return { problem_id };
};

export const getStudentAttemptByIdService = async (id: string) => {
  const studentAttempt = await StudentAttempt.findOneActive({ id },
    {
      _id: 0,
      createdAt: 0,
      updatedAt: 0,
      deletedAt: 0,
      isDeleted: 0
    }
  );

  if (!studentAttempt) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ATTEMPT_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  return { studentAttempt };
};

export const validateStudentAttemptByEmailAndTestIdService = async (email: string, test_id: string) => {
  const test = await Test.findByIdActive(test_id);

  if(!test) {
    throw new HttpError(
      ERROR_MESSAGES.TESTS_NOT_FOUND,
      HttpStatusCode.NOT_FOUND
    );
  }

  if(!test.is_active){
    throw new HttpError(
      ERROR_MESSAGES.TEST_CLOSED_BY_ADMIN,
      HttpStatusCode.FORBIDDEN
    );
  }

  if(test.is_public){
    const studentAttemptExist = await StudentAttempt.findOneActive({ test_id })
      .populate({
        path: 'student',
        match: { email },
        select: 'id email -_id'
      });

    if(studentAttemptExist) {
      throw new HttpError(
        ERROR_MESSAGES.STUDENT_ALREADY_ATTEMPTED_TEST,
        HttpStatusCode.CONFLICT
      );
    }

    const { student } = await createStudentService(email);
    return { studentId: student.id };
  } else {
    const student = await Student.findOneActive({ email });
    if(!student) {
      throw new HttpError(
        ERROR_MESSAGES.STUDENT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    return { studentId: student.id }
  }
}; 

