import {BaseRepository} from "./base.repository";
import Order from "../database/models/Order";
import {OrderRepositoryInterface} from "./interfaces/order.repository.interface";

export class OrderRepository extends BaseRepository<Order> implements OrderRepositoryInterface{

    constructor() {
        super(Order);
    }

}
