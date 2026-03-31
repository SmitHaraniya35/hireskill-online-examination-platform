import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";
import { getSubmissionByIdService } from "../services/submission.service.ts";

export const getSubmissionById = async (
    req:AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.allParams;
        if(!id) {
            return res.badRequest(ERROR_MESSAGES.SUBMISSION_ID_REQUIRED);
        }

        const { submission } = await getSubmissionByIdService(id);

        const data = {
            problem: {
                id: submission.studentAssignedProblem.codingProblem.id,
                title: submission.studentAssignedProblem.codingProblem.title,
                difficulty: submission.studentAssignedProblem.codingProblem.difficulty,
                problem_description: submission.studentAssignedProblem.codingProblem.problem_description,
                topic: submission.studentAssignedProblem.codingProblem.topic,
            },
            submission: {
                id: submission.id,
                assigned_problem_id: submission.assigned_problem_id,
                total_test_cases: submission.total_test_cases,
                passed_test_cases: submission.passed_test_cases,
                language: submission.language,
                source_code: submission.source_code,
                submitted_at: submission.submitted_at,
                status: submission.status,
                execution_time: submission.execution_time,
                memory_used: submission.memory_used,
            }
        }

        res.ok(data, SUCCESS_MESSAGES.SUBMISSION_RETRIEVED);
    } catch (err: any) {
        next(err);
    }
};