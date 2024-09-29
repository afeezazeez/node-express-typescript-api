import { RedisService } from "../utils/redis/redis.service";
import {CartRepository} from "../repositories/cart.repository";
import {WinstonLogger} from "../utils/logger/wintson.logger";
import {CartItemRepository} from "../repositories/cartitem.repository";
import {OrderRepository} from "../repositories/order.repository";
import {ProductRepository} from "../repositories/product.repository";
import {CartItem,CartData} from "../dtos/product/cart.dto";
import {ClientErrorException} from "../exceptions/client.error.exception";
import {generateOrderReference} from "../utils/helper";


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
     * Retrieves the current cart for the user.
     * @param {number} user_id - The ID of the user whose cart is to be retrieved.
     * @returns {Promise<{ cartItems: CartItem[]; totalAmount: number }>} - The current cart items and total amount.
     */
    public async getCart(user_id: number): Promise<{ cartItems: CartItem[]; totalAmount: number }> {
        const cartKey = `cart:${user_id}`;
        const cartExists = await this.redisService.get(cartKey);

        if (!cartExists) {
            throw new ClientErrorException('Cart is empty');
        }

        const cartItemsData = JSON.parse(cartExists);
        const cartItems: CartItem[] = [];
        let totalAmount = 0; // Initialize total amount

        for (const [product_id, item] of Object.entries(cartItemsData)) {
            const { product_id: prodId, quantity } = item as { product_id: number; quantity: number };
            const product = await this.productRepository.findById(prodId);

            if (product) {
                const itemTotal = product.price * quantity; // Calculate item total
                totalAmount += itemTotal; // Accumulate total amount

                cartItems.push({
                    product_uuid: product.uuid,
                    product_name: product.name,
                    quantity: quantity,
                });
            }
        }

        return {
            cartItems,
            totalAmount, // Return the total amount along with cart items
        };
    }


    /**
     * Adds a product to the user's cart
     * @param {CartData} cartData - The data containing user ID, product, and quantity.
     * @returns {Promise<void>}
     */
    public async addToCart(cartData: CartData): Promise<CartItem> {

        const cartKey = `cart:${cartData.user_id}`;
        const existingCart = await this.redisService.get(cartKey);

        const cartItem = {
            product_id: cartData.product.id,
            quantity: cartData.quantity
        };

        if (!existingCart) {
            const cartDataObj = JSON.stringify({ [cartData.product.id]: cartItem });
            await this.redisService.set(cartKey, cartDataObj);
        } else {

            const cartItems = JSON.parse(existingCart);

            if (cartItems[cartData.product.id]) {
                cartItems[cartData.product.id].quantity += cartData.quantity;
            } else {
                cartItems[cartData.product.id] = cartItem;
            }

            await this.redisService.set(cartKey, JSON.stringify(cartItems));
        }
        return {
            product_uuid: cartData.product.uuid,
            product_name: cartData.product.name,
            quantity: cartData.quantity
        };
    }

    /**
     * Removes a product from the user's cart. If the cart becomes empty, the cart is deleted.
     * @param {number} user_id - The ID of the user.
     * @param {number} product_id - The ID of the product to remove.
     * @returns {Promise<void>}
     */
    public async removeFromCart(user_id: number,product_id: number): Promise<void> {
        const cartKey = `cart:${user_id}`;
        const cartExists = await this.redisService.get(cartKey);

        if (cartExists) {
            const cartItems = JSON.parse(cartExists);

            // Remove the product if it exists
            if (cartItems[product_id]) {
                delete cartItems[product_id];

                // Save updated cart data back to Redis, or delete the cart if empty
                if (Object.keys(cartItems).length > 0) {
                    await this.redisService.set(cartKey, JSON.stringify(cartItems));
                } else {
                    await this.redisService.del(cartKey);
                }
            }
        }
    }

    /**
     * Finalizes the checkout process: creates a cart in the DB, transfers items from Redis to DB, and creates an order.
     * Deletes the cart from Redis after successful checkout.
     * @param {number} user_id - The ID of the user checking out.
     */
    public async checkout(user_id: number): Promise<void> {
        const cartKey = `cart:${user_id}`;
        const cartExists = await this.redisService.get(cartKey);

        if (!cartExists) {
            throw new ClientErrorException('Cart is empty');
        }

        const cartItems = JSON.parse(cartExists);
        let totalAmount = 0; // Initialize total amount

        // Create a new cart in the database
        const cart = await this.cartRepository.create({ user_id });

        // Move cart items from Redis to the database and calculate total amount
        for (const [product_id, item] of Object.entries(cartItems)) {
            const { product_id: prodId, quantity } = item as { product_id: number, quantity: number };

            const product = await this.productRepository.findById(prodId); // Assuming you have a method to get the product

            if (product) {
                totalAmount += product.price * quantity; // Accumulate total amount based on price and quantity

                await this.cartItemRepository.create({
                    cart_id: cart.id,
                    product_id: prodId,
                    quantity: quantity
                });
            }
        }

        const order = await this.orderRepository.create({
            user_id,
            cart_id: cart.id,
            total_amount: totalAmount,
            reference: generateOrderReference()
        });

        await this.redisService.del(cartKey);

        return;
    }
}

export default CartService;
