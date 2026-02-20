export interface CodingProblem {
  id: string;
  title: string;
  difficulty: string;
  topic: string[];
  problem_description: string;
  problem_description_image?: string;
  constraint: string;
  input_format: string;
  output_format: string;
  sample_input: string;
  sample_output: string;
  basic_code_layout: string;
  testcases: TestCase[];
}

export interface TestCase {
  id?: string;
  input: string;
  expected_output: string;
  is_hidden: boolean;
}

export interface TestCaseResult {
  testCaseId: string;
  submissionId: string;
  status: string;        // "In Queue", "Processing", "Accepted", "Wrong Answer", etc.
  input?: string;         // Actual input used
  output?: string;        // Actual output from code
  expected_output?: string;
  apiRes?: any;           // Full API response for debugging
  isSample?: boolean;     // mark run/sample results so polling can skip them
}

export interface SubmissionData {
  student_attempt_id: string;
  problem_id: string;
  language: string;
  source_code: string;
  total_test_cases: number;
  passed_test_cases: number;
  status: string;         // "Finished", "Failed", etc.
}

export interface LocationState {
  test?: {
    title: string;
    [key: string]: any;
  };
  studentId?: string;
}

// Language map for Monaco editor (backend ID -> editor language)
export const LANGUAGE_MAP: { [key: string]: string } = {
  "63": "javascript",
  "54": "cpp",
};