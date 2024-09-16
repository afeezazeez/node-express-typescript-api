import {IBaseRepository} from "./base.repository.interface";
import Product from "../../database/models/Product";

export interface IProductRepository extends IBaseRepository<Product> {

}
