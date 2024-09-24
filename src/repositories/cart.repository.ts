import Cart from "../database/models/Cart";
import {ICartRepository} from "./interfaces/cart.repository.interface";
import {BaseRepository} from "./base.repository";



export class CartRepository extends BaseRepository<Cart> implements ICartRepository{

    constructor() {
        super(Cart);
    }

}
