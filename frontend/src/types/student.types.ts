export interface Student{
    id?: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    degree?: string;
    branch?: string;
    graduation_year?: string;
    skills?: string;
    resume_url?: string;
    linkedin_url?: string;
    github_url?: string;
}

export interface StudentListData {
    studentList: Student[];
}

export interface GetAllStudentsListData {
    student: Student[];
}