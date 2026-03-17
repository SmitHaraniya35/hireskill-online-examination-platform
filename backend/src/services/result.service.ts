import { ERROR_MESSAGES, HttpStatusCode } from "../constants/index.ts";
import { Result } from "../models/result.model.ts";
import type { ResultData } from "../types/controller/resultData.types.ts";
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

// export const getResultByStudentAttemptIdService = async (student_attempt_id: string) => {

// }