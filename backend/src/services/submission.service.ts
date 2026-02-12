import { ERROR_MESSAGES } from "../constants/index.ts";
import { Submission } from "../models/submission.model.ts";
import type { SubmissionData } from "../types/controller/submissionData.types.ts";

export const createSubmissionService = async (input: SubmissionData) => {
    const submission = await Submission.create({
        ...input,
        execution_time: "",
        memory_used: ""
    });
    
    if(!submission){
        throw new Error(ERROR_MESSAGES.SUBMISSION_CREATE_FAILED);
    }

    return { submission };
}