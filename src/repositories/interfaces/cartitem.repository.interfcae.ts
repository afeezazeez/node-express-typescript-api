import {IBaseRepository} from "./base.repository.interface";
import CartItem from "../../database/models/CartItem";


export interface ICartItemRepository extends IBaseRepository<CartItem>{

}
