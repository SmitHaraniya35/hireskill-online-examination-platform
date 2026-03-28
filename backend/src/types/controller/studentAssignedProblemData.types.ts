import type { CodingProblemData } from "./codingProblemData.types.ts";

export interface StudentAssingProblemDraftData {
    id: string;
    last_saved_code: string;
    last_language: string;
};

export interface StudentAssignedProblemData {
    id?: string;
    student_attempt_id: string;
    problem_id: string;
    assigned_at: Date;
    status: string;
    last_saved_code?: string;
    last_language?: string;
    last_saved_at?: Date;
}

export interface StudentAssignedProblemDetailsData extends StudentAssignedProblemData {
    codingProblem: CodingProblemData;
}