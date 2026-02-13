import { ERROR_MESSAGES, HttpStatusCode } from "../constants/index.ts";
import { Student } from "../models/student.model.ts";
import type { StudentData } from "../types/controller/studentData.types.ts";
import type { StudentDocument } from "../types/model/student.document.ts";
import { HttpError } from "../utils/httpError.utils.ts";
import { generateAccessToken } from "../utils/jwt.utils.ts";

export const createStudentService = async (input: StudentData) => {
    const { email } = input;
    const studentExists: StudentDocument | null = await Student.findOneActive({ email });
    if (studentExists){
        throw new HttpError(
            ERROR_MESSAGES.STUDENT_ALREADY_EXISTS_WITH_EMAIL,
            HttpStatusCode.CONFLICT
        );
    }

    const student: StudentDocument = await Student.create({
        ...input
    });

    if(!student){
        throw new HttpError(
            ERROR_MESSAGES.STUDENT_CREATION_FAILED,
            HttpStatusCode.INTERNAL_SERVER_ERROR
        )
    }

    await student.save();

    const studentToken = generateAccessToken(student.id, student.email);
    return { student, studentToken };
};

export const getStudentByIdService = async (id: string) => {
    const student = await Student.findByIdActive(id);
    if(!student){
        throw new HttpError(
            ERROR_MESSAGES.STUDENT_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
        );
    }

    return { student };
};

export const getAllStudentService = async () => {
    const student = await Student.findActive();
    if(!student){
        throw new HttpError(
            ERROR_MESSAGES.STUDENTS_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
        );
    }

    return { student };
};

export const updateStudentService = async (id: string, input: StudentData) => {
    const student = await Student.updateOneByFilter({ id }, { ...input });
    if(!student){
        throw new HttpError(
            ERROR_MESSAGES.STUDENT_UPDATE_FAILED,
            HttpStatusCode.INTERNAL_SERVER_ERROR
        );
    }

    return { student };
};

export const deleteStudentService = async (id: string) => {
    const student = await Student.softDelete({ id });
    if(!student){
        throw new HttpError(
            ERROR_MESSAGES.STUDENT_DELETION_FAILED,
            HttpStatusCode.INTERNAL_SERVER_ERROR
        );
    }

    return { student };
};