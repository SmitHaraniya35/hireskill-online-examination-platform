import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";
import { 
    createStudentService, 
    deleteStudentService, 
    getAllStudentService, 
    getStudentByIdService,
    updateStudentService
} from "../services/student.service.ts";
import type { AuthRequest } from "../types/controller/index.ts";
import type { Response } from "express";
import type { StudentData } from "../types/controller/studentData.types.ts";

export const createStudent = async (req: AuthRequest, res: Response) => {
    try {
        const input = req.allParams as StudentData;

        if(!input){
            res.notFound(ERROR_MESSAGES.INPUT_MISSING);
        }

        const data = await createStudentService(input);

        res.cookie("studentToken", data.studentToken, {
            maxAge: 2 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });

        return res.created(data, SUCCESS_MESSAGES.STUDENT_CREATED);

    } catch (err: any) {
        res.badRequest(err.message);
    }
};

export const getStudentById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.allParams;

        if(!id){
            res.notFound(ERROR_MESSAGES.STUDENT_ID_MISSING)
        }

        const data = await getStudentByIdService(id);
        res.ok(data, SUCCESS_MESSAGES.STUDENT_FIND);

    } catch (err: any) {
        res.badRequest(err.message);
    }
};

export const getAllStudent = async (req: AuthRequest, res: Response) => {
    try {
        const admin = req.user;

        if(!admin){
            res.unauthorized(ERROR_MESSAGES.USER_UNAUTHORIZED)
        }

        const data = await getAllStudentService();
        res.ok(data, SUCCESS_MESSAGES.STUDENT_LIST_FETCHED);

    } catch (err: any) {
        res.badRequest(err.message);
    }
};

export const updateStudent = async (req: AuthRequest, res: Response) => {
    try {
        const input = req.allParams as StudentData;
        const id = input.id;
        if(!id){
            res.notFound(ERROR_MESSAGES.STUDENT_ID_MISSING)
        }

        const data = await updateStudentService(id!, input);
        res.ok(data, SUCCESS_MESSAGES.STUDENT_UPDATED);

    } catch (err: any) {
        res.badRequest(err.message);
    }
};

export const deleteStudent = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.allParams;

        if(!id){
            res.notFound(ERROR_MESSAGES.STUDENT_ID_MISSING)
        }

        const data = await deleteStudentService(id);
        res.ok(data, SUCCESS_MESSAGES.STUDENT_DELETED);

    } catch (err: any) {
        res.badRequest(err.message);
    }
};