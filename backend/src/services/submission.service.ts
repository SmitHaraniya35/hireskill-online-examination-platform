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

    const formatedData = {
        student_attempt_id: submission.student_attempt_id,
        problem_id: submission.problem_id,
        language: submission.language,
        source_code: submission.source_code,
        submitted_at: submission.submitted_at,
        total_test_cases: submission.total_test_cases,
        passed_test_cases: submission.passed_test_cases,
        status: submission.status,
        execution_time: submission.execution_time,
        memory_used: submission.memory_used,
    };

    if(!submission){
        throw new HttpError(
            ERROR_MESSAGES.SUBMISSION_CREATION_FAILED,
            HttpStatusCode.INTERNAL_SERVER_ERROR
        );
    }

    return { submission: formatedData };
}