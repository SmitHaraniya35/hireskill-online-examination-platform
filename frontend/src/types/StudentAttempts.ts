// types/studentAttempts.ts

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: number;
}

export interface Problem {
  _id: string;
  id: string;
  title: string;
  difficulty: string;
}

export interface StudentAttempt {
  id: string;
  student_id: string;
  problem_id: string;
  started_at: string;
  expires_at: string;
  is_submitted: boolean;
  is_active: boolean;
  student: Student;
  problem: Problem;
}

export interface GetStudentAttemptsResponse {
  success: boolean;
  message: string;
  payload: {
    students: StudentAttempt[];
  };
}
