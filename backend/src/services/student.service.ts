import { ERROR_MESSAGES, HttpStatusCode } from "../constants/index.ts";
import { Student } from "../models/student.model.ts";
import type { ImportStudentsData, StudentData, StudentProfileData } from "../types/controller/studentData.types.ts";
import type { StudentDocument } from "../types/model/student.document.ts";
import { HttpError } from "../utils/httpError.utils.ts";

export const createStudentService = async (email: string) => {
    const studentExists: StudentDocument | null = await Student.findOneActive({ email });

    if (studentExists){
        throw new HttpError(
            ERROR_MESSAGES.STUDENT_ALREADY_EXISTS_WITH_EMAIL,
            HttpStatusCode.CONFLICT
        );
    }

    const student: StudentDocument = await Student.create({ email });
    if(!student){
        throw new HttpError(
            ERROR_MESSAGES.STUDENT_CREATION_FAILED,
            HttpStatusCode.INTERNAL_SERVER_ERROR
        )
    }

    await student.save();
    return { student };
};

export const importStudentsService = async (input: ImportStudentsData) => {
    // Remove duplicate emails inside file
    const students = input.studentList;
    const uniqueStudents = [
        ...new Map(
        students.map(item => [item.email, item])
        ).values()
    ];

    const formattedStudents: StudentData[] = uniqueStudents.map(student => ({
        name: student.name,
        email: student.email,
        phone: student.phone,
        college: student.college
    }));

    const result = await Student.insertMany(formattedStudents, {
        ordered: false
    });

    return { insertedCount: result.length };
}

export const getStudentByIdService = async (id: string) => {
    const student = await Student.findByIdActive(id,{
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
        deletedAt: 0,
        isDeleted: 0, 
    });
    if(!student){
        throw new HttpError(
            ERROR_MESSAGES.STUDENT_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
        );
    }

    return { student };
};

export const getAllStudentService = async () => {
    const student = await Student.findActive({},{
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
        deletedAt: 0,
        isDeleted: 0, 
    });
    if(!student){
        throw new HttpError(
            ERROR_MESSAGES.STUDENTS_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
        );
    }

    return { student };
};

export const updateStudentService = async (studentId: string, input: StudentData) => {
    const { email, phone } = input;
    const studentExists = await Student.findOneActive({
        $or: [
            {email: input.email},
            {phone: input.phone}
        ],
        id: { $ne: studentId }
    });

    if (studentExists && studentExists.email === email){
        throw new HttpError(
            ERROR_MESSAGES.STUDENT_ALREADY_EXISTS_WITH_EMAIL,
            HttpStatusCode.CONFLICT
        );
    } else if(studentExists && studentExists.phone.toString() === phone.toString()){
        throw new HttpError(
            ERROR_MESSAGES.STUDENT_ALREADY_EXISTS_WITH_PHONE,
            HttpStatusCode.CONFLICT
        );
    }

    const student = await Student.updateOneByFilter({ id: studentId }, { ...input });
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

export const completeStudentProfileService = async (id: string, input: StudentProfileData) => {
    const student =  await Student.findOneActive({ id });
    if(!student) { 
        throw new HttpError(
            ERROR_MESSAGES.STUDENT_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
        );
    }

    student.name = input.name;
    student.phone = input.phone;
    student.college = input.college;
    student.degree = input.degree;
    student.skills = input.skills;
    student.branch = input.branch;
    student.graduation_year = input.graduation_year;
    student.complete_profile = true;

    await student.save();

    return { student }
};