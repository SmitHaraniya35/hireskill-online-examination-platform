export interface Student {
  id: string;
  name: string;
  email: string;
  phone: number;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: string;
}

export interface StudentAttempt {
  id: string;
  student_id: string;
  test_id: string;
  problem_id: string;
  started_at: string;
  expires_at: string;
  is_submitted: boolean;
  is_active: boolean;
}

export interface Submission {
  id: string;
  student_attempt_id: string;
  problem_id: string;
  language: string;
  source_code: string;
  total_test_cases: string;
  passed_test_cases: string;
  status: string;
  execution_time: string;
  memory_used: string;
  submitted_at: string;
}

export interface StudentAttemptResponse {
  studentAttempt: StudentAttempt;
  submission?: Submission;
}


export interface GetStudentAttempts {
  id: string;
  student_id: string;
  problem_id: string;
  started_at: string;
  expires_at: string;
  is_active: boolean;
  student: Student;
  problem: Problem;
  is_submitted?: string;
}

export interface StudentAttemptsDetailsResponse {
  students: GetStudentAttempts[];
}