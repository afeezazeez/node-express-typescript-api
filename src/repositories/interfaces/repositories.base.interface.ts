export interface IRepository<T> {
    create(entity: T): Promise<T>;
    getById(id: string): Promise<T | null>;
    update(entity: Partial<T>, id: string): Promise<[affectedCount: number]>;
    delete(id: string): Promise<void>;
}
