import { ERROR_MESSAGES, HttpStatusCode } from "../constants/index.ts";
import { Test } from "../models/test.model.ts";
import { User } from "../models/user.model.ts";
import type { SubmissionData } from "../types/controller/submissionData.types.ts";
import type { CodingProblemDocument } from "../types/model/coding_problem.document.ts";
import type { TestDocument } from "../types/model/test.document.ts";
import { generateUniqueTestToken } from "../utils/helper.utils.ts";
import { HttpError } from "../utils/httpError.utils.ts";
import { selectRandomProblemService } from "./codingProblem.service.ts";
import { createStudentAttemptService, submitStudentAttemptService } from "./student_attempt.service.ts";
import { createSubmissionService } from "./submission.service.ts";

export const createTestService = async (
  title: string,
  duration_minutes: number,
  expiration_at: Date,
  adminId: string,
) => {
  const admin = await User.findByIdActive(adminId);
  if (!admin) {
    throw new HttpError(
      ERROR_MESSAGES.ADMIN_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  const unique_token = generateUniqueTestToken();

  const test: TestDocument = await Test.create({
    title,
    unique_token,
    expiration_at,
    duration_minutes,
    is_active: true,
    created_by: admin.id,
  });

  if (!test) {
    throw new HttpError(
      ERROR_MESSAGES.TEST_CREATION_FAILED,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }

  await test.save();
  return { test };
};

export const getTestByIdService = async (testId: string) => {
  const test: TestDocument | null = await Test.findByIdActive(testId, {
    id: 1,
    title: 1,
    expiration_at: 1,
    duration_minutes: 1,
    unique_token: 1,
    _id: 0,
  });

  if (!test) {
    throw new HttpError(
      ERROR_MESSAGES.TEST_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  return { test };
};

export const getAllTestService = async () => {
  const testList: TestDocument[] = await Test.findActive(
    {},
    {
      id: 1,
      title: 1,
      expiration_at: 1,
      duration_minutes: 1,
      unique_token: 1,
      is_active: 1,
      _id: 0,
    },
  );

  if (!testList) {
    throw new HttpError(
      ERROR_MESSAGES.TESTS_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  return { testList };
};

export const updateTestService = async (
  id: string,
  title: string,
  duration_minutes: number,
  expiration_at: Date,
) => {
  const test = await Test.updateOneByFilter(
    { id },
    {
      title,
      duration_minutes,
      expiration_at,
    },
  );

  if (!test) {
    throw new HttpError(
      ERROR_MESSAGES.TEST_UPDATE_FAILED,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }

  return { test };
};

export const deleteTestService = async (id: string) => {
  const test = await Test.updateOneByFilter({ id }, { $set: { isDeleted: true, is_active: false } });

  if (!test) {
    throw new HttpError(
      ERROR_MESSAGES.TEST_CASE_DELETION_FAILED,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }

  return { test };
};

export const startTestService = async (test_id: string, student_id: string) => {
  const problem: CodingProblemDocument | undefined = await selectRandomProblemService();
  if (!problem) {
    throw new HttpError(
      ERROR_MESSAGES.CODING_PROBLEM_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  const { studentAttempt } = await createStudentAttemptService(test_id, problem!.id, student_id);
  return { problemId: problem!.id, studentAttemptId: studentAttempt.id };
};

export const finishTestService = async (input: SubmissionData) => {
  const { studentAttempt } = await submitStudentAttemptService(input.student_attempt_id);
  if (!studentAttempt) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ATTEMPT_NOT_FOUND,
      HttpStatusCode.BAD_REQUEST,
    );
  }

  const { submission } = await createSubmissionService(input);
  if (!submission) {
    throw new HttpError(
      ERROR_MESSAGES.SUBMISSION_CREATION_FAILED,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }

  return { studentAttempt, submission };
};

export const toggleTestActivationService = async (id: string) => {
  const test = await Test.findByIdActive(id);

  if (!test) {
    throw new HttpError(
      ERROR_MESSAGES.TEST_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  test.is_active = !test.is_active;
  await test.save();

  return { test };
};
