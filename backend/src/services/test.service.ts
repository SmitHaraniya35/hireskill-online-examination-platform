import { ERROR_MESSAGES, HttpStatusCode } from "../constants/index.ts";
import { Test } from "../models/test.model.ts";
import { User } from "../models/user.model.ts";
import type { FinishTestData, SubmissionData } from "../types/controller/submissionData.types.ts";
import type { TestData } from "../types/controller/testData.types.ts";
import type { CodingProblemDocument } from "../types/model/coding_problem.document.ts";
import type { TestDocument } from "../types/model/test.document.ts";
import { generateUniqueTestToken } from "../utils/helper.utils.ts";
import { HttpError } from "../utils/httpError.utils.ts";
// import { selectRandomProblemService } from "./codingProblem.service.ts";
import { createStudentAttemptService, finishStudentAttemptService, getStudentAttemptByIdService } from "./studentAttempt.service.ts";
import { createStudentAssignedProblemService, getStudentAssignedProblemsByStudentAttemptIdService } from "./studentAssignedProblem.service.ts";
import { getAllSubmissionByStudentAttemptIdService } from "./submission.service.ts";
import { createTestAndProblemsByTestIdService, getCodingProblemsByTestIdService, deleteTestAndProblemsByTestIdService } from "./testAndProblem.service.ts";
import { createResultService } from "./result.service.ts";
import { submitCodeService } from "./executor.service.ts";
import { LanguageExtensions } from "../types/controller/executorData.types.ts";

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

export const selectRandomProblemByTestDetailsService = async (test_id: string) => {
  const { test } = await getTestByIdService(test_id);

  const easyProblems = test.codingProblem.filter((problem: CodingProblemDocument) => problem.difficulty.toLowerCase() === "easy");
  const mediumProblems = test.codingProblem.filter((problem: CodingProblemDocument) => problem.difficulty.toLowerCase() === "medium");
  const hardProblems = test.codingProblem.filter((problem: CodingProblemDocument) => problem.difficulty.toLowerCase() === "hard");

  const codingProblemIdList: string[] = [];

  if(test.count_of_easy_problem != 0) {
    const randomProblems = getRandomSubset(easyProblems, test.count_of_easy_problem);
    codingProblemIdList.push(...randomProblems);
  }

  if(test.count_of_medium_problem != 0) {
    const randomProblems = getRandomSubset(mediumProblems, test.count_of_medium_problem);
    codingProblemIdList.push(...randomProblems);
  }

  if(test.count_of_hard_problem != 0) {
    const randomProblems = getRandomSubset(hardProblems, test.count_of_hard_problem);
    codingProblemIdList.push(...randomProblems);
  }

  return codingProblemIdList;
};

export const getRandomSubset = (problemList: any, count: number) => {
  const len = problemList.length;
  if (len === 0) {
    throw new HttpError(
      ERROR_MESSAGES.CODING_PROBLEMS_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  const selectedProblems = new Set<string>();

  while (selectedProblems.size < count && selectedProblems.size < len) {
    const randomIndex = Math.floor(Math.random() * len);
    selectedProblems.add(problemList[randomIndex].id);
  }

  return Array.from(selectedProblems);
};

export const startTestService = async (test_id: string, student_id: string) => {
  const { studentAttempt } = await createStudentAttemptService(test_id, student_id);

  const codingProblems: string[] = await selectRandomProblemByTestDetailsService(test_id);

  await createStudentAssignedProblemService(codingProblems, studentAttempt.id);

  return { studentAttemptId: studentAttempt.id };
};

export const getTestDataByStudentAttemptIdService = async (studentAttemptId: string) => {
  const { studentAttempt } = await getStudentAttemptByIdService(studentAttemptId);
  if(!studentAttempt){
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ATTEMPTS_NOT_FOUND,
      HttpStatusCode.NOT_FOUND
    );
  }

  const formattedStudentAttempt = {
    id: studentAttempt.id,
    started_at: studentAttempt.started_at,
    expires_at: studentAttempt.expires_at,
  }

  const test = await Test.findOneActive({ id: studentAttempt.test_id }, {
    _id: 0,
    id: 1,
    title: 1,
    duration_minutes: 1
  });
  if(!test) {
    throw new HttpError(
      ERROR_MESSAGES.TESTS_NOT_FOUND,
      HttpStatusCode.NOT_FOUND
    );
  }

  const { studentAssignedProblems } = await getStudentAssignedProblemsByStudentAttemptIdService(studentAttemptId);
  const formattedStudentAssignedProblems = studentAssignedProblems.map((sap: any) => ({
    id: sap.id,
    problem_id: sap.problem_id,
    title: sap.codingProblem.title,
    difficulty: sap.codingProblem.difficulty,
    is_submitted: sap.is_submitted,
    status: sap.status,
  }));

  return {
    test,
    studentAttempt: formattedStudentAttempt,
    assignedProblems: formattedStudentAssignedProblems
  }
};

export const finishTestService = async (input: FinishTestData) => {

  // const { student_attempt_id } = input;

  // const { studentAssignedProblems } =
  //   await getStudentAssignedProblemsByStudentAttemptIdService(student_attempt_id);

  // await Promise.all(studentAssignedProblems.map(async (sap) => {
  //   if(sap.status === "Attempted") {
  //     await submitCodeService({
  //       assignedProblemId: sap.id,
  //       problemId: sap.problem_id,
  //       language: LanguageExtensions[sap.last_language]!,
  //       code: sap.last_saved_code,
  //     })
  //   }
  // }));
 
  // const studentAssignedProblemIdToScore = studentAssignedProblems.map((sap: any) => ({
  //   id: sap.id,
  //   weight:
  //     sap.codingProblem.difficulty.toLowerCase() === "easy"
  //       ? 100
  //       : sap.codingProblem.difficulty.toLowerCase() === "medium"
  //       ? 200
  //       : 300,
  // }));

  // const total_score = studentAssignedProblemIdToScore.reduce(
  //   (acc: number, sap: any) => acc + sap.weight,
  //   0
  // );

  // const studentAssignedProblemIds = studentAssignedProblems.map(
  //   (sap: any) => sap.id
  // );

  // const { submissions } =
  //   await getAllSubmissionByStudentAttemptIdService(studentAssignedProblemIds);

  // let achieved_score = 0;
  // const total_problems = studentAssignedProblemIdToScore.length;
  // let solved_problems = 0;

  // for (const sap of studentAssignedProblemIdToScore) {

  //   const submission = submissions.find(
  //     (sub: SubmissionData) => sub.assigned_problem_id === sap.id
  //   );

  //   if (!submission) {
  //     // no submission → score 0
  //     continue;
  //   }

  //   solved_problems++;
  //   if (submission.status === "Accepted") {
  //     achieved_score += sap.weight;
  //   } 
  //   else if (submission.status === "Partially Accepted") {
  //     achieved_score +=
  //       submission.passed_test_cases *
  //       (sap.weight / submission.total_test_cases);
  //   }
  // }

  // achieved_score = Number(achieved_score.toFixed(2));

  // // update student attempt as finished
  // await finishStudentAttemptService(student_attempt_id);

  // const { result } = await createResultService({ 
  //   total_score,
  //   achieved_score,
  //   total_problems,
  //   solved_problems, 
  //   student_attempt_id 
  // });

  // return { result };


  const { student_attempt_id } = input;

  // mark attempt as finished immediately
  await finishStudentAttemptService(student_attempt_id);

  // trigger background processing (NO AWAIT)
  processAttemptInBackground(student_attempt_id);

  // return { message: "Test submitted successfully" };
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

export const processAttemptInBackground = async (student_attempt_id: string) => {

    const { studentAssignedProblems } =
      await getStudentAssignedProblemsByStudentAttemptIdService(student_attempt_id);

    // 1. Handle attempted but not submitted
    for (const sap of studentAssignedProblems) {

      if (sap.status === "Attempted") {
        console.log(LanguageExtensions[sap.last_language]!);
        await submitCodeService({
          assignedProblemId: sap.id,
          problemId: sap.problem_id,
          language: LanguageExtensions[sap.last_language]!,
          code: sap.last_saved_code,
        });

      }
    }

    // 2. Calculate result (same logic as yours)
    const studentAssignedProblemIdToScore = studentAssignedProblems.map((sap: any) => ({
      id: sap.id,
      weight:
        sap.codingProblem.difficulty.toLowerCase() === "easy"
          ? 100
          : sap.codingProblem.difficulty.toLowerCase() === "medium"
          ? 200
          : 300,
    }));

    const total_score = studentAssignedProblemIdToScore.reduce(
      (acc: number, sap: any) => acc + sap.weight,
      0
    );

    const studentAssignedProblemIds = studentAssignedProblems.map(
      (sap: any) => sap.id
    );

    const { submissions } =
      await getAllSubmissionByStudentAttemptIdService(studentAssignedProblemIds);

    let achieved_score = 0;
    const total_problems = studentAssignedProblemIdToScore.length;
    let solved_problems = 0;

    for (const sap of studentAssignedProblemIdToScore) {

      const submission = submissions.find(
        (sub: SubmissionData) => sub.assigned_problem_id === sap.id
      );

      if (!submission) continue;

      solved_problems++;

      if (submission.status === "Accepted") {
        achieved_score += sap.weight;
      } else if (submission.status === "Partially Accepted") {
        achieved_score +=
          submission.passed_test_cases *
          (sap.weight / submission.total_test_cases);
      }
    }

    achieved_score = Number(achieved_score.toFixed(2));

    // 3. Store result
    await createResultService({
      total_score,
      achieved_score,
      total_problems,
      solved_problems,
      student_attempt_id
    });
};