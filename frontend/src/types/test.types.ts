export interface Test {
    id?: string;
    title: string;
    unique_token? : string;
    expiration_at: string;
    duration_minutes: number;
    is_active?: boolean;
}

export interface TestList {
    testList: Test[];
}

export interface TestDetails {
    test: Test;
}

