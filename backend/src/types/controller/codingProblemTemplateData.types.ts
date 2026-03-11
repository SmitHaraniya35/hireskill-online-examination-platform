export const Languages = {
    CPP: 'C++',
    C: 'C',
    PYTHON: 'Python',
    JAVASCRIPT: 'JavaScript',
};

export type Language = typeof Languages[keyof typeof Languages];

export interface CodingProblemTemplateData {
    id?: string;
    problem_id: string;
    language: Language;
    basic_code_layout: string;
};