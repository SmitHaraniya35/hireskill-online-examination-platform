import { ERROR_MESSAGES } from "../constants/index.ts";
import { Student } from "../models/student.model.ts";
import type { StudentData } from "../types/controller/student.types.ts";
import type { StudentDocument } from "../types/model/student.document.ts";

export const createStudentService = async (input: StudentData) => {
    const { email } = input;
    const studentExists: StudentDocument | null = await Student.findOneActive({ email });
    if (studentExists){
        throw new Error(ERROR_MESSAGES.STUDENT_EXIST_WITH_EMAIL);
    }

    const student: StudentDocument = await Student.create({
        ...input
    });

    await student.save();

    return { student };
};

export const getStudentByIdService = async (id: string) => {
    const student = await Student.findByIdActive(id);

    if(!student){
        throw new Error(ERROR_MESSAGES.STUDENT_NOT_FOUND);
    }

    return { student };
};

export const getAllStudentService = async () => {
    const student = await Student.findActive();

    if(!student){
        throw new Error(ERROR_MESSAGES.STUDENT_LIST_NOT_FOUND);
    }

    return { student };
};

export const updateStudentService = async (id: string, input: StudentData) => {
    const student = await Student.updateOneByFilter({ id }, { ...input });

    if(!student){
        throw new Error(ERROR_MESSAGES.STUDENT_NOT_FOUND);
    }

    return { student };
};

export const deleteStudentService = async (id: string) => {
    const student = await Student.softDelete({ id });

    if(!student){
        throw new Error(ERROR_MESSAGES.STUDENT_NOT_FOUND);
    }

    return { student };
};