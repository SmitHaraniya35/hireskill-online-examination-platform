export type JudgeStatus =
  | "Pending"
  | "Running"
  | "Completed"
  | "Failed";

export type TestCaseStatus =
  | "Accepted"
  | "Wrong Answer"
  | "Runtime Error"
  | "Time Limit Exceeded"
  | "Memory Limit Exceeded";

export type ResultStatus = 
  | "Accepted"
  | "Partially Accepted"
  | "Failed";

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
  resultStatus?: ResultStatus;
  results?: TestCaseResult[];
}

export interface SubmissionJob {
  jobId: string;
  language: string;
  code: string;
  testCases: {
    testCaseId: string;
    input: string;
    expected: string;
  }[];
}

export interface CodeExecutionData {
  assignedProblemId?: string;
  problemId?: string;
  language: string;
  code: string;
  testCases?: {
    testCaseId: string;
    input: string;
    expected: string;
  }[];
}

export const LanguageExtensions: { [key: string]: string } = {
  "C++": "cpp",
  "C": "c",
  "Python": "py",
  "JavaScript": "javascript"
};