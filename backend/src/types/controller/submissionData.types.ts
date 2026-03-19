import type { StudentAssignedProblemDetailsData } from "./studentAssignedProblemData.types.ts";
import type { StudentAttemptStatusType } from "./studentAttemptData.types.ts";

export interface SubmissionData {
  id?: string;
  assigned_problem_id: string;
  language: string;
  source_code: string;
  submitted_at: Date;
  total_test_cases: number;
  passed_test_cases: number;
  status: string;
  execution_time?: string;
  memory_used?: string;
}

export interface FinishTestData {
  slug: string;
  student_attempt_id: string;
  status: StudentAttemptStatusType;
}

export interface SubmissionDetailsData extends SubmissionData {
  studentAssignedProblem: StudentAssignedProblemDetailsData;
}