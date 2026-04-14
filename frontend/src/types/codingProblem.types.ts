import type { SupportedLanguage } from "../constants/languages";

export interface CodingProblemData {
    id?: string;
    title: string;
    difficulty: string;
    topic: string[];
    problem_description: string;
    constraint: string;
    input_format: string;
    output_format: string;
    testCases?: TestCaseData[];
    templateCodes?: TemplateCodes[];
}

export interface TemplateCodes {
    id?: string;
    language: SupportedLanguage;
    basic_code_layout: string;
}

export interface CodingProblemResponse {
    codingProblem: CodingProblemData;
}

export interface GetAllCodingProblemsResponse{
    codingProblemList: CodingProblemData[];
}

export interface TestCaseData {
    id?: string;
    input: string;
    expected_output: string;
    is_hidden: boolean;
    image_url?: string;
}

export interface GelAllCodingProblemWithTestCases {
    codingProblemWithTestCases: CodingProblemData;
}

export interface LANGUAGES {
    Languages: Languages;
}

export interface Languages {
    CPP: string;
    C: string;
    PYTHON: string;
    JAVASCRIPT: string;
}
