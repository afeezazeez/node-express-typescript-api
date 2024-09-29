import { Request, Response, NextFunction } from 'express';
import {sendSuccessResponse} from "../utils/http/response-handlers";
import {ProductService} from "../services/product.service";
import {extractPaginationAndSorting} from "../utils/helper";
import {FindOptions,Op} from "sequelize";
import ProductDto from "../dtos/product/product.dto";
import CartService from "../services/cart.service";
import {IRequestWithUser} from "../interfaces/request/request-user";
import {CartData} from "../dtos/product/cart.dto";
import {UserService} from "../services/user.service";
import {ClientErrorException} from "../exceptions/client.error.exception";
import {ResponseStatus} from "../enums/http-status-codes";
import productDto from "../dtos/product/product.dto";


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
     *     summary: Fetch products
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
     *         description: Product fetched successfully
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
     * /api/users/products/{uuid}:
     *   get:
     *     summary: Fetch single product
     *     tags: [Shop]
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *         description: The unique identifier of the product
     *     responses:
     *       200:
     *         description: Product fetched successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/FetchSingleProductSuccess'
     */
    getShopProduct = async (req: Request, res: Response, next: NextFunction) => {
        const product = await this.productService.getProduct(req.params.uuid);
        if (!product) {
            return next(new ClientErrorException("Product not found", ResponseStatus.NOT_FOUND));
        }
        try {
            return sendSuccessResponse(res, productDto.make(product));
        } catch (e) {
            next(e);
        }
    };

    /**
     * @swagger
     * /api/users/cart:
     *   post:
     *     summary: Add product to cart
     *     tags: [Shop]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               product_uuid:
     *                 type: string
     *                 description: The UUID of the product to add to the cart
     *                 example: "fd9e3d1b-64ed-4bf0-91d9-ffae4a5f1520"
     *               quantity:
     *                 type: integer
     *                 description: The quantity of the product to add
     *                 example: 5
     *     responses:
     *       200:
     *         description: Product added to cart successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AddProductToCartSuccess'
     *       404:
     *         description: Product not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Whether the request was successful
     *                   example: false
     *                 message:
     *                   type: string
     *                   description: Error message
     *                   example: "Product not found"
     */
    addProductToCart = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
        if (!req.user?.email) {
            throw new ClientErrorException("Unauthenticated", ResponseStatus.UNAUTHORISED);
        }

        const user = await this.userService.getUserByEmail(req.user.email)

        const product = await this.productService.getProduct(req.body.product_uuid)

        if (!product) {
            return next(new ClientErrorException("Product not found", ResponseStatus.NOT_FOUND));
        }

        try {
            const cartData: CartData = {
                user_id: Number(user.id),
                product,
                quantity: req.body.quantity,
            };
            const response = await this.cartService.addToCart(cartData);
            return sendSuccessResponse(res, response,"Product added to cart");
        } catch (e) {
            next(e);
        }
    };

    /**
     * @swagger
     * /api/users/cart:
     *   get:
     *     summary: Fetch cart
     *     tags: [Shop]
     *     responses:
     *       200:
     *         description: Product added to cart successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/FetchCartSuccess'
     *       400:
     *         description: Cart is empty
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Whether the request was successful
     *                   example: false
     *                 message:
     *                   type: string
     *                   description: Error message
     *                   example: "Cart is empty"
     */

    getCart = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
        if (!req.user?.email) {
            throw new ClientErrorException("Unauthenticated", ResponseStatus.UNAUTHORISED);
        }

        const user = await this.userService.getUserByEmail(req.user.email)

        try {
            const response = await this.cartService.getCart(Number(user.id));
            return sendSuccessResponse(res, response,"Cart fetched successfully");
        } catch (e) {
            next(e);
        }
    };

    /**
     * @swagger
     * /api/users/cart:
     *   delete:
     *     summary: Remove product from cart
     *     tags: [Shop]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               product_uuid:
     *                 type: string
     *                 description: The UUID of the product to add to the cart
     *                 example: "fd9e3d1b-64ed-4bf0-91d9-ffae4a5f1520"
     *     responses:
     *       200:
     *         description: Product added to cart successfully
     *         content:
     *          application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Request was successful
     *                   example: true
     *                 message:
     *                   type: string
     *                   description: Success message
     *                   example: "Product removed from cart"
     *       404:
     *         description: Product not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Whether the request was successful
     *                   example: false
     *                 message:
     *                   type: string
     *                   description: Error message
     *                   example: "Product not found"
     */
    removeProductFromCart = async (req: IRequestWithUser, res: Response, next: NextFunction) => {

        if (!req.user?.email) {
            throw new ClientErrorException("Unauthenticated", ResponseStatus.UNAUTHORISED);
        }

        const user = await this.userService.getUserByEmail(req.user.email)

        const product = await this.productService.getProduct(req.body.product_uuid)

        if (!product) {
            return next(new ClientErrorException("Product not found", ResponseStatus.NOT_FOUND));
        }

        try {
            await this.cartService.removeFromCart(Number(user.id),product.id);
            return sendSuccessResponse(res, null,"Product removed from cart");
        } catch (e) {
            next(e);
        }
    };

    /**
     * @swagger
     * /api/users/cart/checkout:
     *   post:
     *     summary: Remove product from cart
     *     tags: [Shop]
     *     responses:
     *       200:
     *         description: Product added to cart successfully
     *         content:
     *          application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Request was successful
     *                   example: true
     *                 message:
     *                   type: string
     *                   description: Success message
     *                   example: "Checkout successful. Your order was created"
     *       400:
     *         description: Product not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Whether the request was successful
     *                   example: false
     *                 message:
     *                   type: string
     *                   description: Error message
     *                   example: "Cart is empty"
     */
    checkout = async (req: IRequestWithUser, res: Response, next: NextFunction) => {

        if (!req.user?.email) {
            throw new ClientErrorException("Unauthenticated", ResponseStatus.UNAUTHORISED);
        }

        const user = await this.userService.getUserByEmail(req.user.email)

        try {
            await this.cartService.checkout(Number(user.id));
            return sendSuccessResponse(res, null,"Checkout successful. Your order was created");
        } catch (e) {
            next(e);
        }
    };






}
