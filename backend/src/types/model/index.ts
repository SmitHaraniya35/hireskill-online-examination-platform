import { Document, Model, Schema } from "mongoose";
import type {
  SchemaDefinition,
  ProjectionType,
  QueryFilter,
  UpdateQuery,
  Query,
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
  findActive(filter?: QueryFilter<T>, filterOptions?: ProjectionType<T>,): Query<T[], T>;
  findOneActive(filter: QueryFilter<T>): Query<T | null, T>;
  findByIdActive(id: string): Query<T | null, T>;
  updateOneByFilter(filter: QueryFilter<T>, update: UpdateQuery<T>): any;
  updateManyByFilter(filter: QueryFilter<T>, update: UpdateQuery<T>): any;
  softDelete(filter: QueryFilter<T>): any;
  restore(filter: QueryFilter<T>): any;
  hardDelete(filter: QueryFilter<T>): any;
}
