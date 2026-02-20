// ========== REQUEST BODY INTERFACES ==========

export interface CreateCodingProblem {
    title: string;
    duration_minutes: number;
    expiration_at: string;
}

export interface UpdateCodingProblem {
    title: string;
    difficulty: string;
    topic: string[];
    problem_description: string;
    problem_description_image: string;
    constraint: string;
    input_format: string;
    output_format: string;
    sample_input: string;
    sample_output: string;
    basic_code_layout: string;
}

export interface GetAllCodingProblems {
    title: string;
    duration_minutes: number;
    expiration_at: string;
}

export interface CreateCodingProblemWithTestCases {
    title: string;
    difficulty: string;
    topic: string[];
    problem_description: string;
    problem_description_image: string;
    constraint: string;
    input_format: string;
    output_format: string;
    basic_code_layout: string;
    testCases: {
        input: string;
        expected_output: string;
        is_hidden: boolean;
    }[];
}

export interface UpdateCodingProblemWithTestCases {
    id: string;
    title: string;
    difficulty: string;
    topic: string[];
    problem_description: string;
    problem_description_image: string;
    constraint: string;
    input_format: string;
    output_format: string;
    basic_code_layout: string;
    testCases: {
        id?: string;           // Present for existing test cases
        input: string;
        expected_output: string;
        is_hidden: boolean;
    }[];
}

// ========== DATABASE OBJECT INTERFACES ==========

export interface CodingProblemObject {
    _id: string;
    id: string;
    title: string;
    difficulty: string;
    topic: string[];
    problem_description: string;
    problem_description_image: string;
    constraint: string;
    input_format: string;
    output_format: string;
    sample_input: string;
    sample_output: string;
    basic_code_layout: string;
    created_by: string;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface TestCaseObject {
    _id: string;
    id: string;
    problem_id: string;
    input: string;
    expected_output: string;
    is_hidden: boolean;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CodingProblemWithTestCasesObject {
    title: string;
    difficulty: string;
    topic: string[];
    problem_description: string;
    problem_description_image: string;
    constraint: string;
    input_format: string;
    output_format: string;
    sample_input: string;
    sample_output: string;
    basic_code_layout: string;
    created_by: string;
    id: string;
    testcases: TestCaseObject[];
}

// ========== MONGO UPDATE RESULT INTERFACE ==========

export interface MongoUpdateResult {
    acknowledged: boolean;
    modifiedCount: number;
    upsertedId: string | null;
    upsertedCount: number;
    matchedCount: number;
}

// ========== RESPONSE INTERFACES ==========

export interface CreateCodingProblemResponse {
    success: boolean;
    message: string;
    payload: {
        test: MongoUpdateResult;
    }
}

export interface GetCodingProblemResponse {
    success: boolean;
    message: string;
    payload: {
        codingProblem: CodingProblemObject;
    }
}

export interface UpdateCodingProblemResponse {
    success: boolean;
    message: string;
    payload: {
        codingProblem: MongoUpdateResult;
    }
}

export interface GetAllCodingProblemsResponse {
    success: boolean;
    message: string;
    payload: {
        codingProblemList: CodingProblemObject[];
    }
}

export interface DeleteCodingProblemResponse {
    success: boolean;
    message: string;
    payload: {
        codingProblem: MongoUpdateResult;
    }
}

export interface CreateCodingProblemWithTestCasesResponse {
    success: boolean;
    message: string;
    payload: {
        codingProblem: CodingProblemObject;
        data: {
            testCases: TestCaseObject[];
        }
    }
}

export interface GetCodingProblemWithTestCasesResponse {
    success: boolean;
    message: string;
    payload: {
        codingProblemWithTestCases: CodingProblemWithTestCasesObject;
    }
}

export interface UpdateCodingProblemWithTestCasesResponse {
    success: boolean;
    message: string;
    payload: {
        updatedCodingProblem: {
            codingProblemWithTestCases: CodingProblemWithTestCasesObject;
        }
    }
}
