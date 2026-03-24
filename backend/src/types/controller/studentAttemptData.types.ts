import type { STUDENT_ATTEMPT_STATUS } from "../../constants/index.ts";

export interface ValidateStudentAttemptData {
    test_id: string;
    email: string;
}

export interface CreateStudentAttemptData {
    test_id: string,
    student_id: string,
}

export type StudentAttemptStatusType  = typeof STUDENT_ATTEMPT_STATUS[keyof typeof STUDENT_ATTEMPT_STATUS];