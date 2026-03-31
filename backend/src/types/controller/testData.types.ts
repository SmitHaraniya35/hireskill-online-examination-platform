export interface TestData {
    id?: string;
    title: string;
    duration_minutes: number;
    start_at: Date;
    expiration_at: Date;
    count_of_total_problem : number;
    count_of_easy_problem : number;
    count_of_medium_problem : number;
    count_of_hard_problem : number;
    coding_problem_ids: string[];
}