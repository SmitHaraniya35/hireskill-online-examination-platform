export interface CodingProblemData {
    id?: string;
    title: string;
    difficulty: string;
    topic: string[];
    problem_description: string;
    problem_description_image: string;
    constraint: string;
    input_format: string;
    output_format: string;
    sample_input: string;
    sample_output: string;
    basic_code_layout: string;
}

export interface CodingProblemWithTestCasesData {
    id?: string;
    title: string;
    difficulty: string;
    topic: string[];
    problem_description: string;
    problem_description_image: string;
    constraint: string;
    input_format: string;
    output_format: string;
    basic_code_layout: string;
    testCases: {
        input: string,
        expected_output: string,
        is_hidden: boolean,
        id?: string
    }[]
}