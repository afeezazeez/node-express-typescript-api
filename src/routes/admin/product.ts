
import {WinstonLogger} from "../../utils/logger/wintson.logger";
import {RedisService} from "../../utils/redis/redis.service";
import {Router} from "express";

import {JwtService} from "../../utils/jwt/jwt.service";
import {AuthMiddleware} from "../../middlewares/auth.middleware";
import {TokenBlacklistService} from "../../utils/token-blacklist/token.blacklist.service";
import {AdminRepository} from "../../repositories/admin.repository";
import {AdminService} from "../../services/admin.service";
import {ProductController} from "../../controllers/admin/product.controller";
import {ProductService} from "../../services/product.service";
import {ProductRepository} from "../../repositories/product.repository";
import {CategoryRepository} from "../../repositories/category.repository";
import {validateBody} from "../../middlewares/request-validator";
import {ProductCategoryStoreDto} from "../../dtos/product/product.category.store.dto";


const  router =  Router();

const adminRepository = new AdminRepository();
const redisService = new RedisService();
const jwtService = new JwtService();
const adminService = new AdminService(adminRepository,new WinstonLogger('Admin Service'));
const tokenBlacklistService = new TokenBlacklistService(redisService)
const authMiddleware = new AuthMiddleware(jwtService,adminService,tokenBlacklistService);

const productRepository = new ProductRepository();
const categoryRepository = new CategoryRepository();

const productService = new ProductService(productRepository,categoryRepository,new WinstonLogger('Product Service'));

const productController = new ProductController(productService);




//router.post('', validateBody(LoginRequestDto), authController.login);
//router.get('', validateBody(LoginRequestDto), authController.login);
router.post('/categories',authMiddleware.authenticate,validateBody(ProductCategoryStoreDto), productController.storeCategory);
router.get('/categories',authMiddleware.authenticate, productController.getCategories);



export default router;
