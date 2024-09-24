import { Request, Response, NextFunction } from 'express';
import {sendSuccessResponse} from "../utils/http/response-handlers";
import {ProductService} from "../services/product.service";
import {extractPaginationAndSorting} from "../utils/helper";
import {FindOptions,Op} from "sequelize";
import ProductDto from "../dtos/product/product.dto";
import CartService from "../services/cart.service";
import {IRequestWithUser} from "../interfaces/request/request-user";
import {CartData} from "../dtos/product/cart.store.dto";
import {UserService} from "../services/user.service";
import {ClientErrorException} from "../exceptions/client.error.exception";
import {ResponseStatus} from "../enums/http-status-codes";


export class ShopController {

    private readonly productService: ProductService;
    private readonly cartService: CartService;
    private readonly userService:UserService;

    constructor(productService: ProductService,cartService:CartService,userService:UserService) {
        this.productService = productService;
        this.cartService = cartService;
        this.userService = userService;
    }

    /**
     * @swagger
     * /api/users/products:
     *   get:
     *     summary: Fetch product categories
     *     tags: [Shop]
     *     parameters:
     *       - in: query
     *         name: name
     *         schema:
     *           type: string
     *           example: 'Makintosh Big Sur'
     *         description: The name of the product
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           example: 1
     *         description: The page number for pagination
     *       - in: query
     *         name: perPage
     *         schema:
     *           type: integer
     *           example: 20
     *         description: The number of items per page
     *       - in: query
     *         name: sortDirection
     *         schema:
     *           type: string
     *           enum: [asc, desc]
     *           example: 'asc'
     *         description: The sorting direction (ascending or descending)
     *     responses:
     *       200:
     *         description: Product categories fetched successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/FetchProductSuccess'
     */
    getShopProducts = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const name = req.query.name as string;
            const findOptions:FindOptions = {};
            if (name) {
                findOptions.where = {
                    name: {
                        [Op.like]: `%${name}%`
                    }
                };
            }
            const paginationOptions = extractPaginationAndSorting(req)
            const products = await this.productService.getProducts(findOptions,paginationOptions);
            return sendSuccessResponse(res, {data:ProductDto.collection(products.data),meta:products.meta});
        } catch (e) {
            next(e);
        }
    };

    /**
     * @swagger
     * /api/users/cart:
     *   get:
     *     summary: Add product to cart
     *     tags: [Shop]
     *     responses:
     *       200:
     *         description: Product categories fetched successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/FetchProductSuccess'
     */
    addProductToCart = async (req: IRequestWithUser, res: Response, next: NextFunction) => {

        if (!req.user?.email) {
            throw new ClientErrorException("Unauthenticated", ResponseStatus.UNAUTHORISED);
        }

        const user = await this.userService.getUserByEmail(req.user.email)
        console.log(user)

        try {
            const cartData: CartData = {
                user_id: Number(user.id),
                product_uuid: req.body.product_uuid,
                quantity: req.body.quantity,
            };
            const response = await this.cartService.addToCart(cartData);
            return sendSuccessResponse(res, response,"Product added to cart");
        } catch (e) {
            next(e);
        }
    };



}
