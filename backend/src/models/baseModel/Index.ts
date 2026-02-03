import { type SchemaDefinition, Schema } from "mongoose";
import type { GenerateSchemaFunction } from "../../types/model/index.ts";
import { generateUserId } from "../../utils/helper.utils.ts";

export const generateSchema: GenerateSchemaFunction = <T>(
  definition: SchemaDefinition<T>,
  options?: Record<string, any>,
): Schema<T> => {
  const baseSchemaFields: SchemaDefinition = {
    ...definition,
    id: { type: String, default: generateUserId },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  };

  const baseSchemaOptions = {
    timestamps: true,
    versionKey: false,
    ...options,
  } as const;

  const schema = new Schema<T>(baseSchemaFields, baseSchemaOptions);

  return schema;
};
