import Product from "../database/models/Product";
import {IProductRepository} from "./interfaces/product.repository.interface";
import {BaseRepository} from "./base.repository";


export class ProductRepository extends BaseRepository<Product> implements IProductRepository{
    constructor() {
        super(Product);
    }

}
