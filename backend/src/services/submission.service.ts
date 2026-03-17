import { ERROR_MESSAGES, HttpStatusCode } from "../constants/index.ts";
import { Submission } from "../models/submission.model.ts";
import type { SubmissionData } from "../types/controller/submissionData.types.ts";
import { HttpError } from "../utils/httpError.utils.ts";

export const createSubmissionService = async (input: SubmissionData) => {

    if(!input){
        throw new HttpError(
            ERROR_MESSAGES.REQUIRED_FIELDS_MISSING,
            HttpStatusCode.BAD_REQUEST
        );
    }

    const { assigned_problem_id } = input;
    if(!assigned_problem_id) {
        throw new HttpError(
            ERROR_MESSAGES.CODING_PROBLEM_ID_REQUIRED,
            HttpStatusCode.BAD_REQUEST
        );
    }

    const existingSubmission = await Submission.findOneActive({ assigned_problem_id });
    if(!existingSubmission) {
        await Submission.create({
            ...input,
            memory_used: ""
        });
    } else {
        await Submission.updateOne({ id: existingSubmission.id }, {
            ...input,
            memory_used: ""
        });
    }

    const submission = await Submission.findOneActive({ assigned_problem_id }, {
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
        isDeleted: 0,
        deletedAt: 0,
    });

    if(!submission){
        throw new HttpError(
            ERROR_MESSAGES.SUBMISSION_CREATION_FAILED,
            HttpStatusCode.INTERNAL_SERVER_ERROR
        );
    }

    return { submission };
};

export const getSubmissionsByStudentAttemptIdService = async (assigned_problem_id: string[]) => {
    const submissions: SubmissionData[] = await Submission.findActive({ assigned_problem_id }, {
        createdAt: 0,
        updatedAt: 0,
        deletedAt: 0,
        isDeleted: 0,
        _id: 0
    });

    if(!submissions){
        throw new HttpError(
            ERROR_MESSAGES.SUBMISSION_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
        );
    }

    return { submissions };
};