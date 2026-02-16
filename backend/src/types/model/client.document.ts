import type { BaseDocument, BaseModel } from "./index.ts";

export interface ClientDocument extends BaseDocument{
    client_id: string;
    api_key: string;
    is_active: boolean;
};

export interface ClientModel extends BaseModel<ClientDocument> {}