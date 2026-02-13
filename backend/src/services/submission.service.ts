import { ERROR_MESSAGES, HttpStatusCode } from "../constants/index.ts";
import { Submission } from "../models/submission.model.ts";
import type { SubmissionData } from "../types/controller/submissionData.types.ts";
import { HttpError } from "../utils/httpError.utils.ts";

export const createSubmissionService = async (input: SubmissionData) => {
    const submission = await Submission.create({
        ...input,
        execution_time: "",
        memory_used: ""
    });
    
    if(!submission){
        throw new HttpError(
            ERROR_MESSAGES.SUBMISSION_CREATION_FAILED,
            HttpStatusCode.INTERNAL_SERVER_ERROR
        );
    }

    return { submission };
}