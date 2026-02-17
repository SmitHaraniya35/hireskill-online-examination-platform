// Define what we send to the server
export interface CreateTestInput {
    title: string;
    duration_minutes: number;
    expiration_at: string;
}

export interface UpdateTestInput {
    title: string;
    duration_minutes: number;
    expiration_at: string;
}

// Define the full object we get from the database
export interface TestObject {
    id: string;
    _id: string;
    title: string;
    unique_token: string;
    duration_minutes: number;
    expiration_at: string;
    created_by: string;
    is_active: boolean;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

// Individual response types for every action
export interface CreateResponse {
    success: boolean;
    message: string;
    payload: {
        data: {
            test: TestObject;
        };
    };
}

export interface GetAllResponse {
    success: boolean;
    message: string;
    payload: {
        testList: {
            title: string;
            unique_token: string;
            expiration_at: string;
            duration_minutes: number;
            id: string;
        }[];
    };
}

export interface GetDetailsResponse {
    success: boolean;
    message: string;
    payload: {
        test: {
            title: string;
            unique_token: string;
            expiration_at: string;
            duration_minutes: number;
            id: string;
        };
    };
}

export interface ActionSuccessResponse {
    success: boolean;
    message: string;
    payload: {
        test: {
            acknowledged: boolean;
            modifiedCount: number;
            upsertedId: string | null;
            upsertedCount: number;
            matchedCount: number;
        };
    };
}