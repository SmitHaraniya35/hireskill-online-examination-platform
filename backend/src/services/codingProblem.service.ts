import { ERROR_MESSAGES, HttpStatusCode } from "../constants/index.ts";
import { CodingProblem } from "../models/coding_problem.model.ts";
import { User } from "../models/user.model.ts";
import type {
  CodingProblemData,
  CodingProblemWithTestCasesAndTemplateData,
} from "../types/controller/codingProblemData.types.ts";
import type { TestCaseData } from "../types/controller/testCaseData.types.ts";
import type { CodingProblemDocument } from "../types/model/coding_problem.document.ts";
import type { UserDocument } from "../types/model/user.document.ts";
import { HttpError } from "../utils/httpError.utils.ts";
import {
  createManyTestCasesService,
  createTestCaseService,
  updateTestCaseService,
} from "./testCase.service.ts";
import { createManyCodingProblemTemplateService, updateCodingProblemTemplateService } from "./codingProblemTemplate.service.ts";
import { Languages } from "../types/controller/codingProblemTemplateData.types.ts";

export const createCodingProblemService = async (
  input: CodingProblemData,
  adminId: string,
) => {
  const codingProblem: CodingProblemDocument = await CodingProblem.create({
    ...input,
    created_by: adminId,
  });

  if (!codingProblem) {
    throw new HttpError(
      ERROR_MESSAGES.CODING_PROBLEM_CREATION_FAILED,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }

  return { codingProblem };
};

export const getCodingProblemByIdService = async (id: string) => {
  const codingProblem: CodingProblemData | null = await CodingProblem.findByIdActive(
    id,
    {
      _id: 0, 
      created_by: 0, 
      createdAt: 0, 
      updatedAt: 0, 
      deletedAt: 0, 
      isDeleted: 0
    }
  );

  if (!codingProblem) {
    throw new HttpError(
      ERROR_MESSAGES.CODING_PROBLEM_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  return { codingProblem };
};

export const getAllCodingProblemsService = async () => {
  const codingProblemList: CodingProblemData[] = await CodingProblem.findActive({},
    { 
      _id: 0, 
      created_by: 0, 
      createdAt: 0, 
      updatedAt: 0, 
      deletedAt: 0, 
      isDeleted: 0
    }
  );
  if (!codingProblemList.length) {
    throw new HttpError(
      ERROR_MESSAGES.CODING_PROBLEMS_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  return { codingProblemList };
};

export const updateCodingProblemService = async (
  id: string,
  updatedInput: CodingProblemData,
) => {
  const { id: _omit, ...fieldsToUpdate } = updatedInput as CodingProblemData & {
    id?: string;
  };

  const result = await CodingProblem.updateOne(
    { id, isDeleted: false },
    { $set: fieldsToUpdate },
  );
  if (!result.acknowledged) {
    throw new HttpError(
      ERROR_MESSAGES.CODING_PROBLEM_UPDATE_FAILED,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }

  const codingProblem: CodingProblemDocument | null =
    await CodingProblem.findByIdActive(id);
  if (!codingProblem) {
    throw new HttpError(
      ERROR_MESSAGES.CODING_PROBLEM_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  return { codingProblem };
};

export const deleteCodingProblemService = async (id: string) => {
  const codingProblem = await CodingProblem.softDelete({ id });
  if (!codingProblem) {
    throw new HttpError(
      ERROR_MESSAGES.CODING_PROBLEM_DELETION_FAILED,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }

  return { codingProblem };
};

export const createCodingProblemWithTestCasesAndTemplateCodesService = async (
  input: CodingProblemWithTestCasesAndTemplateData,
  adminId: string,
) => {
  const admin: UserDocument | null = await User.findOneActive({ id: adminId });
  if (!admin) {
    throw new HttpError(
      ERROR_MESSAGES.ADMIN_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  const { testCases, templateCodes, ...codingProblemDetails } = input;

  const codingProblemInput = {
    ...codingProblemDetails,
    created_by: adminId,
  };

  const codingProblem: CodingProblemDocument = await CodingProblem.create({
    ...codingProblemInput,
  });
  
  if (!codingProblem) {
    throw new HttpError(
      ERROR_MESSAGES.CODING_PROBLEM_CREATION_FAILED,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }
  await codingProblem.save();

  const { id: problem_id } = codingProblem;

  const inputTestCases: TestCaseData[] = testCases.map((item) => {
    return { problem_id, ...item };
  });
  const testCasesData = await createManyTestCasesService(inputTestCases);

  const inputTemplateCodes = templateCodes.map((item) => {
    return { problem_id, ...item };
  });
  const templateCodesData = await createManyCodingProblemTemplateService(inputTemplateCodes);

  return { codingProblem, testCases: testCasesData.testCases, templateCodes: templateCodesData.codingProblemTemplates };
};

export const selectRandomProblemService = async () => {
  const problems: CodingProblemDocument[] = await CodingProblem.findActive();
  if (!problems.length) {
    throw new HttpError(
      ERROR_MESSAGES.CODING_PROBLEM_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  const len = problems.length;
  const index = Math.floor(Math.random() * len);

  return problems[index];
};

export const getCodingProblemWithTestCasesAndTemplateCodesService = async (id: string) => {
  const codingProblemWithTestCases = await CodingProblem.findByIdActive(id, {
    _id: 0,
    createdAt: 0,
    deletedAt: 0,
    updatedAt: 0,
    isDeleted: 0,
  }).populate({
    path: "testCases",
    match: { isDeleted: false },
    select: "id input expected_output is_hidden image_url -_id -problem_id",
  }).populate({
    path: "templateCodes",
    match: { isDeleted: false },
    select: "id language basic_code_layout -_id -problem_id",
  });

  if (!codingProblemWithTestCases) {
    throw new HttpError(
      ERROR_MESSAGES.CODING_PROBLEM_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  return { codingProblemWithTestCases };
};

export const updateCodingProblemWithTestCasesAndTemplateCodesService = async (
  input: CodingProblemWithTestCasesAndTemplateData,
  adminId: string,
) => {
  const admin: UserDocument | null = await User.findOneActive({ id: adminId });
  if (!admin) {
    throw new HttpError(
      ERROR_MESSAGES.ADMIN_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  const problem_id = input.id;
  if (!problem_id) {
    throw new HttpError(
      ERROR_MESSAGES.CODING_PROBLEM_ID_REQUIRED,
      HttpStatusCode.BAD_REQUEST,
    );
  }

  const { testCases, templateCodes, ...codeWithoutTestCase } = input;

  const codingProblemInput = {
    ...codeWithoutTestCase,
    created_by: adminId,
  };

  const codingProblem = await CodingProblem.findOneAndUpdate(
    { id: problem_id },
    { ...codingProblemInput },
  );
  if (!codingProblem) {
    throw new HttpError(
      ERROR_MESSAGES.CODING_PROBLEM_UPDATE_FAILED,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }
  await codingProblem.save();

  testCases.map(async (testcase) => {
    if (testcase.id) {
      await updateTestCaseService(testcase.id, { problem_id, ...testcase });
    } else {
      await createTestCaseService({ problem_id, ...testcase });
    }
  });

  templateCodes.map(async (templateCode) => {
    if(templateCode.id) {
      await updateCodingProblemTemplateService({ problem_id, ...templateCode });
    } else {
      await createManyCodingProblemTemplateService([{ problem_id, ...templateCode}]);
    }
  });

  const updatedCodingProblem =
    await getCodingProblemWithTestCasesAndTemplateCodesService(problem_id);

  return { updatedCodingProblem };
};

export const getAllSupportedLanguagesService = async () => {
  return { Languages };
};