import Product from "../database/models/Product";
import {IProductRepository} from "./interfaces/product.repository.interface";
import {BaseRepository} from "./base.repository";
import {FindOptions} from "sequelize";


export class ProductRepository extends BaseRepository<Product> implements IProductRepository{

    constructor() {
        super(Product);
    }

    async findByName(name: string): Promise<Product | null> {
        try {
            const options: FindOptions = {where: { name }};
            return await Product.findOne(options) ;
        } catch (error) {
            throw error
        }
    }
}
