import {UserRepository} from "../../repositories/user.repository";
import {WinstonLogger} from "../../utils/logger/wintson.logger";
import {RedisService} from "../../utils/redis/redis.service";
import {Router} from "express";
import {JwtService} from "../../utils/jwt/jwt.service";
import {AuthMiddleware} from "../../middlewares/auth.middleware";
import {UserService} from "../../services/user.service";
import {TokenBlacklistService} from "../../utils/token-blacklist/token.blacklist.service";
import {ProductRepository} from "../../repositories/product.repository";
import {CategoryRepository} from "../../repositories/category.repository";
import {ProductService} from "../../services/product.service";
import {ShopController} from "../../controllers/shop.controller";
import {AddProductToCartDto} from "../../dtos/product/add-to-cart.dto";
import {validateBody} from "../../middlewares/request-validator";
import CartService from "../../services/cart.service";
import {CartRepository} from "../../repositories/cart.repository";
import {CartItemRepository} from "../../repositories/cartitem.repository";
import {OrderRepository} from "../../repositories/order.repository";


const  router =  Router();

const categoryRepository = new CategoryRepository();
const userRepository = new UserRepository();
const cartRepository = new CartRepository();
const cartItemRepository = new CartItemRepository();
const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();
const redisService = new RedisService();
const jwtService = new JwtService();
const userService = new UserService(userRepository,new WinstonLogger('User Service'));
const cartService = new CartService(redisService,
    cartRepository,
    cartItemRepository,
    orderRepository,
    productRepository,
    new WinstonLogger('Cart Service')
);
const tokenBlacklistService = new TokenBlacklistService(redisService)
const authMiddleware = new AuthMiddleware(jwtService,userService,tokenBlacklistService);



const productService = new ProductService(productRepository,categoryRepository,new WinstonLogger('Product Service'));

const shopController = new ShopController(productService,cartService,userService);




router.get('/products',authMiddleware.authenticate, shopController.getShopProducts);
router.post('/cart', authMiddleware.authenticate,validateBody(AddProductToCartDto), shopController.addProductToCart);



export default router;
