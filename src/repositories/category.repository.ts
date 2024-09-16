import Category from "../database/models/Category";
import {ICategoryRepository} from "./interfaces/category.repository.interface";
import {BaseRepository} from "./base.repository";
import {FindOptions} from "sequelize";



export class  CategoryRepository extends BaseRepository<Category> implements ICategoryRepository{
    constructor() {
        super(Category);
    }
    async findByName(name: string): Promise<Category | null> {
        try {
            const options: FindOptions = {where: { name }};
            return await Category.findOne(options) ;
        } catch (error) {
            throw error
        }
    }
}
