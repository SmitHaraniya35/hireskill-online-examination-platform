import type { ProjectionType, QueryFilter, UpdateQuery, Query } from "mongoose";
import type { BaseModel } from "../../types/model/index.ts";

export class BaseClass<T> {

    static findActive<T>(
        this: BaseModel<T>,
        filter: QueryFilter<T> = {},
        filterOptions: ProjectionType<T> = {}
    ): Query<T[], T> {
        return this.find({ ...filter, isDeleted: false }, filterOptions);
    }

    static findOneActive<T>(
        this: BaseModel<T>,
        filter: QueryFilter<T>
    ): Query<T | null, T> {
        return this.findOne({ ...filter, isDeleted: false });
    }

    static findByIdActive<T>(
        this: BaseModel<T>,
        id: string
    ): Query<T | null, T> {
        return this.findOne({ id, isDeleted: false });
    }

    static updateOneByFilter<T>(
        this: BaseModel<T>,
        filter: QueryFilter<T>,
        update: UpdateQuery<T>
    ) {
        return this.updateOne(filter, update);
    }

    static updateManyByFilter<T>(
        this: BaseModel<T>,
        filter: QueryFilter<T>,
        update: UpdateQuery<T>
    ) {
        return this.updateMany(filter, update);
    }

    static softDelete<T>(
        this: BaseModel<T>,
        filter: QueryFilter<T>
    ) {
        return this.updateOne(filter, {
            isDeleted: true,
            deletedAt: new Date()
        });
    }

    static restore<T>(
        this: BaseModel<T>,
        filter: QueryFilter<T>
    ) {
        return this.updateOne(filter, {
            isDeleted: false,
            deletedAt: null
        });
    }

    static hardDelete<T>(
        this: BaseModel<T>,
        filter: QueryFilter<T>
    ) {
        return this.deleteMany(filter);
    }
}
