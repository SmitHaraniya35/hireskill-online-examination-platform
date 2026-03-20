import { ERROR_MESSAGES, HttpStatusCode, STUDENT_ATTEMPT_STATUS } from "../constants/index.ts";
import { Student } from "../models/student.model.ts";
import { StudentAttempt } from "../models/student_attempt.model.ts";
import { Test } from "../models/test.model.ts";
import type { StudentAttemptStatusType } from "../types/controller/studentAttemptData.types.ts";
import type { StudentAttemptDocument } from "../types/model/student_attempt.document.ts";
import type { TestDocument } from "../types/model/test.document.ts";
import { HttpError } from "../utils/httpError.utils.ts";
import { getResultByStudentAttemptIdService } from "./result.service.ts";
import { createStudentService, getStudentByIdService } from "./student.service.ts";
import { getStudentAssignedProblemsWithSubmissionDetailsByStudentAttemptIdService } from "./studentAssignedProblem.service.ts";
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
    status: STUDENT_ATTEMPT_STATUS.IN_PROGRESS
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
      "id started_at expires_at finished_at is_submitted status is_active student_id -_id",
    );

  if (!students) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ATTEMPTS_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  return { students };
};

export const getStudentAttemptSubmissionDetailsAndResultByIdService = async (id: string) => {
  const { studentAttempt } = await getStudentAttemptByIdService(id);

  const { student_id, test_id } = studentAttempt;

  const { student } = await getStudentByIdService(student_id);
  const formattedStudent = {
    id: student.id,
    name: student.name,
    email: student.email,
    phone: student.phone
  }

  const { test } = await getTestByIdService(test_id);
  const formattedTest = {
    id: test.id,
    title: test.title,
    duration_minutes: test.duration_minutes,
  }

  const { result } = await getResultByStudentAttemptIdService(id);
  const { studentAssignedProblems } = await getStudentAssignedProblemsWithSubmissionDetailsByStudentAttemptIdService(id);

  return {
    student: formattedStudent, 
    test: formattedTest,
    studentAttempt,
    result,
    studentAssignedProblems
  }
};

export const finishStudentAttemptService = async (id: string) => {
  const studentAttempt: StudentAttemptDocument | null =
    await StudentAttempt.updateOneByFilter({ id }, 
      { 
        is_active: false,
        is_submitted: true,
        finished_at: new Date(),
        status: STUDENT_ATTEMPT_STATUS.PROCESSING
      }
    );

  if(!studentAttempt) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ATTEMPT_FINISH_FAILED,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  }

  return { studentAttempt };
};

export const updateStudentAttemptStatusService = async (id: string, status: StudentAttemptStatusType) => {
  const studentAttempt: StudentAttemptDocument | null = await StudentAttempt.updateOneByFilter({ id },
    {
      status
    }
  );

  if(!studentAttempt) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ATTEMPT_STATUS_UPDATE_FAILED,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  }

  return { studentAttempt };
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
    const studentExist = await Student.findOneActive({ email });

    if(studentExist){
      const studentAttemptExist = await StudentAttempt.findOneActive({
        test_id,
        student_id: studentExist.id
      });

      if(studentAttemptExist){
        throw new HttpError(
          ERROR_MESSAGES.STUDENT_ALREADY_ATTEMPTED_TEST,
          HttpStatusCode.CONFLICT
        );
      }
    } else {
      const { student } = await createStudentService(email);
      return { studentId: student.id };
    }
    return { studentId: studentExist.id };
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

export const validateStudentAttemptByIdService = async (id: string) => {
  const studentAttempt = await StudentAttempt.findOneActive({ id });
  if(!studentAttempt) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ATTEMPTS_NOT_FOUND,
      HttpStatusCode.NOT_FOUND
    )
  }

  if(studentAttempt.is_submitted && !studentAttempt.is_active) {
    throw new HttpError(
      ERROR_MESSAGES.STUDENT_ATTEMPT_ALREADY_SUBMITTED,
      HttpStatusCode.FORBIDDEN
    );
  }

  return { studentAttempt };
};