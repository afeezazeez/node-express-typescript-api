import {Model, CreationAttributes,FindOptions, CreateOptions, UpdateOptions, DestroyOptions} from 'sequelize';
import {PaginationOptions} from "../../interfaces/request/pagination";
export interface IBaseRepository<T extends Model<T>> {
    create(data: CreationAttributes<T>, options?: CreateOptions): Promise<T>;
    findAll(options?: FindOptions,paginationOptions?: PaginationOptions): Promise<{ rows: T[]; count: number }>;
    findById(id:number, options?: FindOptions): Promise<T | null>;
    findByUuid(uuid:string, options?: FindOptions): Promise<T | null>;
    update(id:number, data: Partial<T>, options?: UpdateOptions): Promise<number>;
    delete(id:number, options?: DestroyOptions): Promise<number>;
}
