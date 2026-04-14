import type { StudentAttemptStatusType } from "./studentAttempts.types";

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


export interface ValidateStudentAttemptResponse{
    problem_id: string;
}

export interface StartResponse {
    studentAttemptId: string;
}

export interface FinishData {
    student_attempt_id: string;
    status: StudentAttemptStatusType;
}

export interface ValidateStudentAttemptByEmailAndTestData {
    test_id: string;
    email: string;
}

export interface ValidateStudentAttemptByEmailAndTestIdResponse {
    studentId: string;
}

export interface StudentData {
    name: string;
    phone: string;
    college: string;
    degree: string;
    graduation_year: string;
    skills: string;
    branch: string;
}

export interface Test{
    id: string;
    title: string;
    duration_minutes: number;
    count_of_total_problem?: number;
    count_of_easy_problem?: number;
    count_of_medium_problem?: number;
    count_of_hard_problem?: number;
}

export interface AssignedProblems{
    id: string;
    problem_id: string;
    title: string;
    difficulty: string;
    is_submitted: boolean;
    status: string;
}
export interface StudentAttempt {
    id: string;
    started_at: string;
    expires_at: string;
}
export interface GetTestDataByStudentAttemptIdResponse{
    test: Test;
    studentAttempt: StudentAttempt;
    assignedProblems: AssignedProblems[];
}

export interface SaveDraftData {
    last_saved_code: string;
    last_language: string;
}

export interface TestCases{
    testCaseId: string;
    input: string;
    expected: string;
}

export interface RunCodeData {
    problemId?: string;
    language: string;
    code: string;
    testCases: TestCases[];
}

export interface SubmitCodeData {
    problemId: string;
    assignedProblemId: string;
    language: string;
    code: string;
}
export interface Results {
    index: number;
    testCaseId: string;
    status: string;
    time: number;
}

export interface SubmitCodeResponse {
    totalTestCases: number;
    passedTestCases: number;
    status: string;
    results: Results[];
    time:number;
    error?: string;
}

export type JudgeStatus =
  | "Completed"
  | "Failed";
 
export type TestCaseStatus =
  | "Accepted"
  | "Wrong Answer"
  | "Runtime Error"
  | "Time Limit Exceeded"
  | "Memory Limit Exceeded";

export interface TestCaseResult {
  index: number;
  testCaseId: string;
  status: TestCaseStatus;
  input?: string;
  output?: string;
  expected?: string;
  time: number;
}
 
export interface WorkerResponse {
  status: JudgeStatus;
  time?: number;
  error?: string;
  message?: string;
  results?: TestCaseResult[];
  totalTestCases?: number;
  passedTestCases?: number;
}

export interface ValidateStudentAttemptById{
    id: string;
    is_active: boolean;
    is_submitted: boolean;
}