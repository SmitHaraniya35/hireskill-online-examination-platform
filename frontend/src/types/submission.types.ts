export interface StatusData {
    id: number;
    description: string;
}

export interface RunData {
    language_id: string;
    source_code: string;
    stdin: string;
    expected_output: string;
}
 
export interface RunResponse {
    stdout: string | null;
    time: string;
    memory: number;
    stderr: string | null;
    token: string;
    compile_output: string | null;
    message: string | null;
    status: StatusData;
}

export interface SubmitData {
    language_id: string;
    source_code: string;
    problem_id: string;
}

export interface ExecutionMappingList {
    submissionId: string
    testCaseId: string
}

export interface SubmitResponse {
    executionMappingList: ExecutionMappingList[]
}

export interface GetSubmissionResponse {
    data: RunResponse;
}