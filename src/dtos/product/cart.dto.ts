import Product from "../../database/models/Product";

export interface CartData {
    user_id: number;
    product: Product;
    quantity: number;
}

export interface CartItem {
    product_name: string;
    product_uuid: string;
    quantity: number;
}
