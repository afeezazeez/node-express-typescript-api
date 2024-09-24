import {BaseRepository} from "./base.repository";
import CartItem from "../database/models/CartItem";
import {ICartItemRepository} from "./interfaces/cartitem.repository.interfcae";



export class CartItemRepository extends BaseRepository<CartItem> implements ICartItemRepository{

    constructor() {
        super(CartItem);
    }

}
