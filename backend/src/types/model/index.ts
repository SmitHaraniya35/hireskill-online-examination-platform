import { Document, Model, Schema } from "mongoose";
import type {
  SchemaDefinition,
  ProjectionType,
  QueryFilter,
  UpdateQuery,
  Query,
  UpdateWriteOpResult
} from "mongoose";

export interface GenerateSchemaFunction {
  <T>(
    definition: SchemaDefinition<T>,
    options?: Record<string, any>,
  ): Schema<T>;
}

export interface BaseDocument extends Document {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: Boolean;
  deletedAt?: Date;
}

export interface BaseModel<T> extends Model<T> {
  findActive(filter?: QueryFilter<T>, filterOptions?: ProjectionType<T>): Query<T[], T>;
  findOneActive(filter: QueryFilter<T>, filterOptions?: ProjectionType<T>): Query<T | null, T>;
  findByIdActive(id: string, filterOptions?: ProjectionType<T>): Query<T | null, T>;
  updateOneByFilter(filter: QueryFilter<T>, update: UpdateQuery<T>): Query<UpdateWriteOpResult, T>;
  updateManyByFilter(filter: QueryFilter<T>, update: UpdateQuery<T>): Query<UpdateWriteOpResult, T>;
  softDelete(filter: QueryFilter<T>): Query<UpdateWriteOpResult, T>;
  softDeleteMany(filter: QueryFilter<T>): Query<UpdateWriteOpResult, T>;
  restore(filter: QueryFilter<T>): Query<UpdateWriteOpResult, T>;
  hardDelete(filter: QueryFilter<T>): Query<any, T>;
}
