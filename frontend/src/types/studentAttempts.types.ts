


export interface Submission {
  id?: string;
  student_attempt_id: string;
  problem_id: string;
  language: string;
  source_code: string;
  submitted_at: string;
  total_test_cases: string;
  passed_test_cases: string;
  status: string;
  execution_time: string;
  memory_used: string;
}

export interface SubmissionByStudentAttemptId{
  submission: Submission
}

export interface StudentAttemptResponse {
  studentAttempt: StudentAttempt;
  submission?: Submission;
}

export interface Result {
  id: string;
  student_attempt_id: string;
  total_score: number;
  achieved_score: number;
}

export interface GetStudentAttempts {
  id: string;
  student_id: string;
  started_at: string;
  expires_at: string;
  finished_at: string;
  status: StudentAttemptStatusType;
  is_submitted?: string;
  is_active: boolean;
  student: Student;
  result: Result | null;
}

export interface StudentAttemptsDetailsResponse {
  students: GetStudentAttempts[];
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: string;
}

export interface SubmissionData {
  id: string;
  assigned_problem_id: string;
  total_test_cases: string;
  passed_test_cases: number;
}


export interface GetStudentAttemptSubmissionDetailsAndResultResponse {
  student: Student
  test: Test
  studentAttempt: StudentAttempt
  result: Result;
  studentAssignedProblems: StudentAssignedProblems[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: number;
  college: string;
  degree: string;
  branch: string;
  graduation_year: number;
  skills: string;
  complete_profile: boolean;
}

export interface Test {
  id: string;
  title: string;
  duration_minutes: number;
}

export interface StudentAttempt {
  id: string;
  student_id: string;
  test_id: string;
  problem_id?: string;
  started_at: string;
  expires_at: string;
  finished_at: string;
  is_submitted: boolean;
  is_active: boolean;
}

export interface Result {
  id: string;
  student_attempt_id: string;
  total_score: number;
  achieved_score: number;
  total_problems: number;
  solved_problems: number;
}

export interface StudentAssignedProblems {
  id: string;
  problem_id: string;
  is_submitted: boolean;
  status: string;
  codingProblem: CodingProblem;
  submission: SubmissionData;
}

export const STUDENT_ATTEMPT_STATUS = {
    IN_PROGRESS: "In Progress",
    SUBMITTED: "Submitted",
    PROCESSING: "Processing",
    AUTO_SUBMITTED: "Auto Submitted",
    VIOLATION_DETECTED: "Violation Detected",
} as const; 
 
export type StudentAttemptStatusType  = typeof STUDENT_ATTEMPT_STATUS[keyof typeof STUDENT_ATTEMPT_STATUS];