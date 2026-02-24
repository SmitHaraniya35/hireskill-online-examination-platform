import type { RunResponse } from "./submission.types";

export interface TestCaseResult {
  testCaseId: string;
  submissionId: string;
  status: string;
  input?: string;
  output?: string;
  expected_output?: string;
  apiRes?: RunResponse;
}