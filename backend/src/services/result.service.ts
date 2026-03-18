import { ERROR_MESSAGES, HttpStatusCode } from "../constants/index.ts";
import { Result } from "../models/result.model.ts";
import type { ResultData } from "../types/controller/resultData.types.ts";
import type { ResultDocument } from "../types/model/result.document.ts";
import { HttpError } from "../utils/httpError.utils.ts";

export const createResultService = async (input: ResultData) => {
    const result = await Result.create(input);

    if(!result) {
        throw new HttpError(
            ERROR_MESSAGES.RESULT_CREATION_FAILED,
            HttpStatusCode.INTERNAL_SERVER_ERROR
        )
    }

    return { result };
};

export const getResultByStudentAttemptIdService = async (student_attempt_id: string) => {
    const result: ResultDocument | null = await Result.findOneActive({ student_attempt_id }, {
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
        deletedAt: 0,
        isDeleted: 0,
    });

    if(!result) {
        throw new HttpError(
            ERROR_MESSAGES.RESULT_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
        )
    }

    return { result };
};