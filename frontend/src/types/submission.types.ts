// ========== REQUEST BODY INTERFACES ==========

export interface RunCode {
    language_id: string;        // "63" for JavaScript, "54" for C++
    source_code: string;         // The actual code to run
    stdin: string;               // Input to provide to the code
    expected_output: string;     // Expected output for comparison
}

export interface SubmitCode {
    language_id: string;
    source_code: string;
    problem_id: string;          // ID of the problem being solved
}

// Note: Get submission doesn't need a body interface (uses ID in URL)

// ========== DATABASE OBJECT INTERFACES ==========

export interface SubmissionStatus {
    id: number;                  // Status ID (3 = Accepted, etc.)
    description: string;         // "Accepted", "Wrong Answer", "Time Limit Exceeded", etc.
}

export interface RunCodeResult {
    stdout: string;              // Program output
    time: string;                // Execution time in seconds
    memory: number;              // Memory used in KB
    stderr: string | null;       // Error output (if any)
    token: string;               // Unique token for this execution
    compile_output: string | null; // Compilation output (if any)
    message: string | null;      // Additional message
    status: SubmissionStatus;    // Status of the execution
}

export interface SubmissionMapping {
    submissionId: string;        // ID for this specific submission
    testCaseId: string;          // ID of the test case being run
}

export interface SubmissionResult {
    executionMappingList: SubmissionMapping[];  // Array of all test case submissions
}

export interface SubmissionOutput {
    status: string;              // Status of the submission (e.g., "Accepted")
    // Note: The actual response might have more fields, but only status is shown in example
}

// ========== RESPONSE INTERFACES ==========

export interface RunCodeResponse {
    success: boolean;
    message: string;
    payload: RunCodeResult;
}

export interface SubmitCodeResponse {
    success: boolean;
    message: string;
    payload: SubmissionResult;
}

export interface GetSubmissionResponse {
    success: boolean;
    message: string;
    payload: SubmissionOutput;
}

export interface axiosResponse<T> {
    success: boolean;
    message: string;
    payload?: T
}