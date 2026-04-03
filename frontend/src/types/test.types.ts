export interface Test {
    id?: string;
    title: string;
    created_by?: string;
    start_at?: string;
    unique_token? : string;
    expiration_at: string;
    duration_minutes: number;
    is_active?: boolean;
    is_public?: boolean;
    count_of_total_problem?: number;
    count_of_easy_problem?: number;
    count_of_medium_problem?: number;
    count_of_hard_problem?: number;
    coding_problem_ids?: string[];
    use_all_available_problems?: boolean;
    codingProblem?: CodingProblem[]
}

export interface TestList {
    testList: Test[];
}

export interface TestDetails {
    test: Test;
    testAndProblems?: TestAndProblems[];
}
export interface CodingProblem {
    id: string;
    title: string;
    difficulty: string;
}

export interface TestAndProblems {
    id: string;
    test_id: string;
    coding_problem_id: string;
}

