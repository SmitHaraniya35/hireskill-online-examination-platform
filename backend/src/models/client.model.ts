import { model } from "mongoose";
import type { ClientDocument, ClientModel } from "../types/model/client.document.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";
import { generateSchema } from "./baseModel/Index.ts";

const ClientSchema = generateSchema<ClientDocument>({
    client_id: { type: String },
    api_key: { type: String },
    is_active: { type: Boolean }
});

export class ClientClass extends BaseClass<ClientDocument>{}

ClientSchema.loadClass(ClientClass);

export const Client = model<ClientDocument, ClientModel>('Client', ClientSchema);