import { Request, Response, NextFunction } from 'express';
import { sendSuccessResponse } from "../../utils/http/response-handlers";
import {ProductCategoryStoreDto} from "../../dtos/product/product.category.store.dto";
import {ProductService} from "../../services/product.service";
import {extractPaginationAndSorting} from "../../utils/helper";
import {FindOptions,Op} from "sequelize";
import {ProductStoreDto} from "../../dtos/product/product.store.dto";
import {ResponseStatus} from "../../enums/http-status-codes";
import CategoryDto from "../../dtos/product/category.dto";
import ProductDto from "../../dtos/product/product.dto";

export class ProductController {

    private readonly productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    /**
     * @swagger
     * /api/admins/products:
     *   post:
     *     summary: Create product
     *     tags: [Admin Shop Management]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateProductDto'
     *     responses:
     *       200:
     *         description: Product created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CreateProductSuccess'
     *       400:
     *         description: Bad request - Product name already exists
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: 'Product name exists'
     *       404:
     *         description: Not found - Product category does not exist
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: 'Product category does not exist'
     */
    storeProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const product = await this.productService.storeProduct(req.body as ProductStoreDto);
            return sendSuccessResponse(res, ProductDto.make(product), 'Product saved!');
        } catch (e) {
            next(e);
        }
    };

    /**
     * @swagger
     * /api/admins/products:
     *   get:
     *     summary: Fetch product categories
     *     tags: [Admin Shop Management]
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
    getProducts = async (req: Request, res: Response, next: NextFunction) => {

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
     * /api/admins/products/categories:
     *   post:
     *     summary: Create product category
     *     tags: [Admin Shop Management]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: 'Pizza'
     *             required:
     *               - name
     *     responses:
     *       200:
     *         description: Product saved
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: 'Product saved!'
     *                 data:
     *                   type: object
     *                   properties:
     *                     name:
     *                       type: string
     *                       example: 'Monitors'
     *                     uuid:
     *                       type: string
     *                       example: 'c05aa041-3f3c-4ca9-92df-9cbb3d66e3b7'
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: 'Category name exists'
     */
    storeCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const category = await this.productService.storeCategory(req.body as ProductCategoryStoreDto);
            return sendSuccessResponse(res, CategoryDto.make(category), 'Product category saved!',ResponseStatus.CREATED);
        } catch (e) {
            next(e);
        }
    };

    /**
     * @swagger
     * /api/admins/products/categories:
     *   get:
     *     summary: Fetch product categories
     *     tags: [Admin Shop Management]
     *     parameters:
     *       - in: query
     *         name: name
     *         schema:
     *           type: string
     *           example: 'Phones'
     *         description: The name of the product category
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
     *               $ref: '#/components/schemas/FetchProductCategorySuccess'
     */
    getCategories = async (req: Request, res: Response, next: NextFunction) => {

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
            const categories = await this.productService.getCategories(findOptions,paginationOptions);
            return sendSuccessResponse(res, {data:CategoryDto.collection(categories.data),meta:categories.meta});
        } catch (e) {
            next(e);
        }
    };


}
