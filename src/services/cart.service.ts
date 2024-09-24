import { RedisService } from "../utils/redis/redis.service";
import Order from "../database/models/Order";
import {ClientErrorException} from "../exceptions/client.error.exception";
import {CartRepository} from "../repositories/cart.repository";
import {WinstonLogger} from "../utils/logger/wintson.logger";
import {CartItemRepository} from "../repositories/cartitem.repository";
import {OrderRepository} from "../repositories/order.repository";
import {ProductRepository} from "../repositories/product.repository";
import {ResponseStatus} from "../enums/http-status-codes";
import {CartData} from "../dtos/product/cart.store.dto";

class CartService {
    private readonly redisService: RedisService;
    private readonly cartRepository:CartRepository;
    private readonly logger:WinstonLogger;
    private readonly cartItemRepository:CartItemRepository;
    private readonly orderRepository:OrderRepository;
    private readonly productRepository:ProductRepository;

    constructor(
        redisService: RedisService,
        cartRepository:CartRepository,
        cartItemRepository:CartItemRepository,
        orderRepository:OrderRepository,
        productRepository:ProductRepository,
        logger:WinstonLogger
    ) {
        this.redisService = redisService;
        this.cartRepository = cartRepository;
        this.logger = new WinstonLogger('Cart Service');
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    /**
     * Adds a product to the user's cart
     * @param {CartData} cartData - The data containing user ID, product UUID, and quantity.
     * @returns {Promise<void>}
     */
    public async addToCart(cartData: CartData): Promise<{ product_uuid: string, product_name: string, quantity: number }> {

        const cartKey = `cart:${cartData.user_id}`;
        const cartExists = await this.redisService.get(cartKey);

        const product = await this.productRepository.findByUuid(cartData.product_uuid);
        if (!product) {
            throw new ClientErrorException("Product not found", ResponseStatus.NOT_FOUND);
        }

        const cartItem = {
            product_id: product.id,
            quantity: cartData.quantity
        };

        if (!cartExists) {
            const cartDataObj = JSON.stringify({ [product.id]: cartItem });
            await this.redisService.set(cartKey, cartDataObj);
        } else {

            const cartItems = JSON.parse(cartExists);

            if (cartItems[product.id]) {

                cartItems[product.id].quantity += cartData.quantity;
            } else {

                cartItems[product.id] = cartItem;
            }

            await this.redisService.set(cartKey, JSON.stringify(cartItems));
        }
        return {
            product_uuid: cartData.product_uuid,
            product_name: product.name,
            quantity: cartData.quantity
        };
    }


    /**
     * Removes a product from the user's cart. If the cart becomes empty, the cart is deleted.
     * @param {number} userId - The ID of the user.
     * @param {number} productId - The ID of the product to remove.
     * @returns {Promise<void>}
     */
    // public async removeFromCart(userId: number, productId: number): Promise<void> {
    //     const cartKey = `cart:${userId}`;
    //     const cartExists = await this.redisService.get(cartKey);
    //
    //     if (cartExists) {
    //         const cartItems = JSON.parse(cartExists);
    //
    //         // Remove the product if it exists
    //         if (cartItems[productId]) {
    //             delete cartItems[productId];
    //
    //             // Save updated cart data back to Redis, or delete the cart if empty
    //             if (Object.keys(cartItems).length > 0) {
    //                 await this.redisService.set(cartKey, JSON.stringify(cartItems));
    //             } else {
    //                 await this.redisService.del(cartKey);
    //             }
    //         }
    //     }
    // }

    /**
     * Finalizes the checkout process: creates a cart in the DB, transfers items from Redis to DB, and creates an order.
     * Deletes the cart from Redis after successful checkout.
     * @param {number} userId - The ID of the user checking out.
     * @returns {Promise<Order>} - The created order.
     * @throws Will throw an error if the cart is empty.
     */
    // public async checkout(userId: number): Promise<Order> {
    //     const cartKey = `cart:${userId}`;
    //     const cartExists = await this.redisService.get(cartKey);
    //
    //     if (!cartExists) {
    //         throw new ClientErrorException('Cart is empty');
    //     }
    //
    //     const cartItems = JSON.parse(cartExists);
    //
    //     // Create a new cart in the database
    //     const cart = await this.cartRepository.create({ user_id:userId });
    //
    //     // Move cart items from Redis to the database
    //     for (const [productId, quantity] of Object.entries(cartItems)) {
    //         await this.cartItemRepository.create({
    //             cart_id: cart.id,
    //             product_id: parseInt(productId),
    //             quantity: parseInt(quantity)
    //         });
    //     }
    //
    //     // Create the order in the database, but no need for OrderItems
    //     const order = await this.orderRepository.create({ user_id:userId, cart_id: cart.id });
    //
    //     // Clear the Redis cart after checkout
    //     await this.redisService.del(cartKey);
    //
    //     return order;
    // }
}

export default CartService;
