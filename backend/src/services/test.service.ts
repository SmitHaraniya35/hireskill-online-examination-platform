import { ERROR_MESSAGES, HttpStatusCode } from "../constants/index.ts";
import { Test } from "../models/test.model.ts";
import { User } from "../models/user.model.ts";
import type { SubmissionData } from "../types/controller/submissionData.types.ts";
import type { TestData } from "../types/controller/testData.types.ts";
import type { CodingProblemDocument } from "../types/model/coding_problem.document.ts";
import type { TestDocument } from "../types/model/test.document.ts";
import { generateUniqueTestToken } from "../utils/helper.utils.ts";
import { HttpError } from "../utils/httpError.utils.ts";
import { selectRandomProblemService } from "./codingProblem.service.ts";
import { createStudentAttemptService, submitStudentAttemptService } from "./student_attempt.service.ts";
import { createSubmissionService } from "./submission.service.ts";
import { createTestAndProblemsByTestIdService, getCodingProblemsByTestIdService, deleteTestAndProblemsByTestIdService } from "./testAndProblem.service.ts";

export const createTestService = async (input: TestData, adminId: string) => {
  const admin = await User.findByIdActive(adminId);
  if (!admin) {
    throw new HttpError(
      ERROR_MESSAGES.ADMIN_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  const unique_token = generateUniqueTestToken();

  const test: TestDocument = await Test.create({
    ...input,
    unique_token,
    is_active: true,
    is_public: true,
    created_by: admin.id,
  });

  if (!test) {
    throw new HttpError(
      ERROR_MESSAGES.TEST_CREATION_FAILED,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }

  await test.save();
  
  const { testAndProblems } = await createTestAndProblemsByTestIdService(input.coding_problem_ids, test.id);

  const data = await getTestByIdService(test.id);
  
  return { test: data.test };
};

export const getTestByIdService = async (testId: string) => {
  const test = await Test.findOne({ id: testId })
  .populate({
    path: "testAndProblems",
    match: { isDeleted: false },
    select: "coding_problem_id -_id -test_id",
    populate: {
      path: "codingProblem",
      select: "id title difficulty -_id"
    }
  }).lean() as any;

  if (!test) {
    throw new HttpError(
      ERROR_MESSAGES.TEST_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  const formattedTest = {
    id: test.id,
    title: test.title,
    duration_minutes: test.duration_minutes,
    start_at: test.start_at,
    expiration_at: test.expiration_at,
    is_active: test.is_active,
    is_public: test.is_public,
    count_of_total_problem : test.count_of_total_problem,
    count_of_easy_problem : test.count_of_easy_problem,
    count_of_medium_problem : test.count_of_medium_problem,
    count_of_hard_problem : test.count_of_hard_problem,
    codingProblem: test.testAndProblems.map((tp: any) => tp.codingProblem)
  };

  return { test: formattedTest };
};

export const getAllTestService = async () => {
  const testList: TestDocument[] = await Test.findActive(
    {},
    {
      _id: 0, 
      created_by: 0, 
      createdAt: 0, 
      updatedAt: 0, 
      deletedAt: 0, 
      isDeleted: 0
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
  input: TestData
) => {
  const { id } = input;
  if(!id){
    throw new HttpError(
      ERROR_MESSAGES.TEST_ID_REQUIRED,
      HttpStatusCode.BAD_REQUEST
    )
  }

  const { coding_problem_ids, ...updatedInput } = input;

  const existTest = await Test.updateOneByFilter(
    { id },
    {
      ...updatedInput,
    },
  );

  if (!existTest) {
    throw new HttpError(
      ERROR_MESSAGES.TEST_UPDATE_FAILED,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }

  const { codingProblems } = await getCodingProblemsByTestIdService(id);
  const existingCodingProblemIds = codingProblems.map((cp: any) => cp.coding_problem_id);

  const codingProblemIdsToAdd = coding_problem_ids.filter((id) => !existingCodingProblemIds.includes(id));
  const codingProblemIdsToRemove = existingCodingProblemIds.filter((id: string) => !coding_problem_ids.includes(id));

  if(codingProblemIdsToAdd.length > 0) {
    await createTestAndProblemsByTestIdService(codingProblemIdsToAdd, id);
  }

  if(codingProblemIdsToRemove.length > 0) {
    await deleteTestAndProblemsByTestIdService(codingProblemIdsToRemove, id);
  }

  const { test } = await getTestByIdService(id);

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

export const toggleTestPublicStatusService = async (id: string) => {
  const test = await Test.findByIdActive(id);

  if (!test) {
    throw new HttpError(
      ERROR_MESSAGES.TEST_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  test.is_public = !test.is_public;
  await test.save();

  return { test };
};