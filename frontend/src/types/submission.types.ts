export interface Submission {
    id: string;
    assigned_problem_id: string;
    total_test_cases: number;
    passed_test_cases: number;
    language: string;
    source_code: string;
    submitted_at: string;
    status: string;
    execution_time: string;
    memory_used: string;
}

export interface Problem {
    id: string;
    title: string;
    difficulty: string;
    problem_description: string;
    topic: string[];
}

export interface GetSubmissionResponse {
    problem: Problem;
    submission: Submission;
}