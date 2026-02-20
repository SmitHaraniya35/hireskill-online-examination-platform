// ========== REQUEST BODY INTERFACES ==========

export interface CreateStudent {
    name: string;
    email: string;
    phone: string;
}

export interface FinishTest {
    student_attempt_id: string;
    problem_id: string;
    language: string;           // "js", "cpp", etc.
    source_code: string;
    total_test_cases: number;
    passed_test_cases: number;
    status: string;              // "Failed", "Passed", "Finished", etc.
}

// Note: Get test by slug doesn't need a body (uses URL parameter)
// Note: Start test doesn't need a body (uses query params or headers)
// Note: Validate student attempt doesn't need a body (uses query params)

// ========== DATABASE OBJECT INTERFACES ==========

export interface TestObject {
    title: string;
    unique_token: string;        // Unique identifier for the test
    expiration_at: string;       // When the test expires (ISO date)
    duration_minutes: number;    // Test duration in minutes
    id: string;                  // Test ID
}

export interface StudentObject {
    _id: string;
    id: string;
    name: string;
    email: string;
    phone: number;               // Note: In response it's number
    college: string | null;
    degree: string | null;
    branch: string | null;
    graduation_year: string | null;
    skills: string | null;
    resume_url: string | null;
    linkedin_url: string | null;
    github_url: string | null;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface StartTestResult {
    problemId: string;           // ID of the first problem to solve
}

export interface ValidateAttemptResult {
    problem_id: string;          // ID of the problem to load
}

// ========== RESPONSE INTERFACES ==========

export interface GetTestBySlugResponse {
    success: boolean;
    message: string;
    payload: {
        test: TestObject;
    }
}

export interface CreateStudentResponse {
    success: boolean;
    message: string;
    payload: {
        student: StudentObject;
        studentToken: string;    // JWT token for authentication
    }
}

export interface StartTestResponse {
    success: boolean;
    message: string;
    payload: StartTestResult;
}

export interface FinishTestResponse {
    success: boolean;
    message: string;
    payload: {
        // Based on your example, finish might not return payload
        // But keeping it flexible
        [key: string]: any;
    }
}

export interface ValidateStudentAttemptResponse {
    success: boolean;
    message: string;
    payload: ValidateAttemptResult;
}
