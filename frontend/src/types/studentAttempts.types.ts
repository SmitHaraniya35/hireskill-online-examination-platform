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

export interface StudentAttemptResponse {
  studentAttempt: StudentAttempt;
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