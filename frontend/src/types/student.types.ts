// ========== REQUEST BODY INTERFACES ==========

export interface CreateStudent {
    name: string;
    email: string;
    phone: string;        // Note: In response it becomes number
}

export interface UpdateStudent {
    name: string;
    email: string;
    phone: string;
}

// // Note: Delete might use ID in URL, but based on your example it has a body
// export interface DeleteStudent {
//     name: string;
//     email: string;
//     phone: string;
// }

// ========== DATABASE OBJECT INTERFACES ==========

export interface StudentObject {
    _id: string;
    id: string;
    name: string;
    email: string;
    phone: number;        // Note: In response it's number, but in request it's string
    college: string | null;
    degree: string | null;
    branch: string | null;
    graduation_year: string | null;
    skills: string | null;
    resume_url: string | null;
    linkedin_url: string | null;
    github_url: string | null;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

// ========== MONGO UPDATE RESULT INTERFACE ==========

export interface MongoUpdateResult {
    acknowledged: boolean;
    modifiedCount: number;
    upsertedId: string | null;
    upsertedCount: number;
    matchedCount: number;
}

// ========== RESPONSE INTERFACES ==========

export interface CreateStudentResponse {
    success: boolean;
    message: string;
    payload: {
        student: StudentObject;
        studentToken: string;  // JWT token for the student
    }
}

export interface GetStudentResponse {
    success: boolean;
    message: string;
    payload: {
        student: StudentObject;
    }
}

export interface GetAllStudentsResponse {
    success: boolean;
    message: string;
    payload: {
        student: StudentObject[];  // Note: Array of students
    }
}

export interface UpdateStudentResponse {
    success: boolean;
    message: string;
    payload: {
        student: MongoUpdateResult;
    }
}

export interface DeleteStudentResponse {
    success: boolean;
    message: string;
    payload: {
        student: MongoUpdateResult;
    }
}
