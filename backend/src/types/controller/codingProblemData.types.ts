import type { Language } from "./codingProblemTemplateData.types.ts";

export interface CodingProblemData {
    id?: string;
    title: string;
    difficulty: string;
    topic: string[];
    problem_description: string;
    constraint: string;
    input_format: string;
    output_format: string;
    created_by?: string;
}

export interface CodingProblemWithTestCasesAndTemplateData extends CodingProblemData {
    testCases: {
        input: string,
        expected_output: string,
        is_hidden: boolean,
        id?: string
        image_url?: string
    }[];
    templateCodes: {
        id?: string;
        language: Language;
        basic_code_layout: string;
    }[];
}