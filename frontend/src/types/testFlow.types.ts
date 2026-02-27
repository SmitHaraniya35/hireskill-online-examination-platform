export interface TestData {
    id: string;
    title: string;
    unique_token: string;
    expiration_at: string;
    duration_minutes: number;
}
export interface TestDataResponse {
    test: TestData;
}

export interface CreateStudentData{
    name: string;
    email: string;
    phone: string;
}

export interface CreateStudentResponse{
    studentId: string;
    studentToken: string;
}

export interface ValidateStudentAttemptResponse{
    problem_id: string;
}

export interface StartResponse {
    problemId: string;
    studentAttemptId: string;
}

export interface FinishData {
    student_attempt_id: string;
    problem_id: string;
    language: string;
    source_code: string;
    total_test_cases: number;
    passed_test_cases: number;
    status: string;
}

export interface ValidateStudentAttemptByEmailData {
    email: string;
}

export interface ValidateStudentAttemptByEmailAndTestIdResponse {
    studentId: string;
}
