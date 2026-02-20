// ========== REQUEST BODY INTERFACES ==========

export interface CreateTestCase {
    problem_id: string;
    input: string;
    expected_output: string;
    is_hidden: boolean;
}

export interface UpdateTestCase {
    problem_id: string;
    input: string;
    expected_output: string;
    is_hidden: boolean;
}


// ========== DATABASE OBJECT INTERFACES ==========

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

// Simplified test case for list views (without metadata)
export interface TestCaseListItem {
    input: string;
    expected_output: string;
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

export interface CreateTestCaseResponse {
    success: boolean;
    message: string;
    payload: {
        testCase: TestCaseObject;
    }
}

export interface GetAllTestCasesResponse {
    success: boolean;
    message: string;
    payload: {
        data: TestCaseListItem[];
    }
}

export interface UpdateTestCaseResponse {
    success: boolean;
    message: string;
    payload: {
        updateTestCase: MongoUpdateResult;
    }
}

export interface DeleteTestCaseResponse {
    success: boolean;
    message: string;
    payload: {
        testCase: MongoUpdateResult;
    }
}
