import {CreateOptions,WhereOptions, DestroyOptions, FindOptions, Model, ModelStatic, UpdateOptions} from 'sequelize';
import {IBaseRepository} from './interfaces/base.repository.interface';
import configService from "../utils/config/config.service";
import {PaginationOptions} from "../interfaces/request/pagination";


export class BaseRepository<T extends Model<T>> implements IBaseRepository<T> {
    protected model: ModelStatic<T>;

    constructor(model: ModelStatic<T>) {
        this.model = model;
    }

    async create(data: any, options?: CreateOptions): Promise<T> {
        try {
            return await this.model.create(data, options);
        } catch (error) {
            throw error;
        }
    }
    async findAll(options: FindOptions = {}, paginationOptions?: PaginationOptions): Promise<{ rows: T[]; count: number }> {

        try {
            const { page= 1 , order= 'DESC',limit = 25 } = paginationOptions || {};

            const offset = (page - 1) * limit;

            const finalOptions: FindOptions = {
                ...options,
                limit,
                offset,
                order: [['created_at', order]],
            };

            const result = await this.model.findAndCountAll(finalOptions);

            return {
                rows: result.rows,
                count: result.count,
            };
        } catch (error) {
            throw error;
        }
    }
    async findById(id:number, options?: FindOptions): Promise<T | null> {
        try {
            return await this.model.findByPk(id, options);
        } catch (error) {
            throw error;
        }
    }
    async update(id: number, data: Partial<T>, options?: UpdateOptions<T>): Promise<number> {
        try {
            const [affectedCount] = await this.model.update(data, {
                where: { id } as unknown as WhereOptions<T>,
                ...options
            });

            return affectedCount;
        } catch (error) {
            throw error;
        }
    }
    async delete(id:number, options?: DestroyOptions): Promise<number> {
        try {
            return await this.model.destroy({ where: { id }, ...options });
        } catch (error) {
            throw error;
        }
    }
}
