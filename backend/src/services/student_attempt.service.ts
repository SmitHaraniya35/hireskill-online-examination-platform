import { ERROR_MESSAGES, HttpStatusCode } from "../constants/index.ts";
import { CodingProblem } from "../models/coding_problem.model.ts";
import { StudentAttempt } from "../models/student_attempt.model.ts";
import { Test } from "../models/test.model.ts";
import type { CodingProblemDocument } from "../types/model/coding_problem.document.ts";
import type { StudentAttemptDocument } from "../types/model/student_attempt.document.ts";
import type { TestDocument } from "../types/model/test.document.ts";
import { HttpError } from "../utils/httpError.utils.ts";
import { getTestByIdService } from "./test.service.ts";

export const createStudentAttemptService = async (
  test_id: string,
  problem_id: string,
  student_id: string,
) => {
  const existAttempt: StudentAttemptDocument | null =
    await StudentAttempt.findOneActive({ student_id });
  if (existAttempt && existAttempt.is_active) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ALREADY_ACTIVE,
      HttpStatusCode.CONFLICT,
    );
  }

  const problem: CodingProblemDocument | null =
    await CodingProblem.findByIdActive(problem_id);
  if (!problem) {
    throw new HttpError(
      ERROR_MESSAGES.CODING_PROBLEM_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

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

  const attempt: StudentAttemptDocument = await StudentAttempt.create({
    test_id,
    problem_id,
    student_id,
    started_at,
    expires_at,
    is_submitted: false,
    is_active: true,
  });

  if (!attempt) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ATTEMPT_CREATION_FAILED,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }

  return { attempt };
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
    .populate({
      path: "problem",
      select: "id title difficulty",
    })
    .select(
      "id started_at expires_at is_submitted is_active student_id problem_id -_id",
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
    await StudentAttempt.findOneActive({ id });
  if (!studentAttempt) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ATTEMPT_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  if (!studentAttempt.is_active || studentAttempt.is_submitted) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ATTEMPT_ALREADY_SUBMITTED_OR_INACTIVE,
      HttpStatusCode.BAD_REQUEST,
    );
  }

  studentAttempt!.is_active = false;
  studentAttempt!.is_submitted = true;

  await studentAttempt!.save();
  return { studentAttempt };
};
