import { Request, Response, NextFunction } from 'express';
import { sendSuccessResponse } from "../../utils/http/response-handlers";
import {ProductCategoryStoreDto} from "../../dtos/product/product.category.store.dto";
import {ProductService} from "../../services/product.service";
import {extractPaginationAndSorting} from "../../utils/helper";
import {FindOptions,Op} from "sequelize";

export class ProductController {

    private readonly productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }


    /**
     * @swagger
     * /api/admins/products/categories:
     *   post:
     *     summary: Create product category
     *     tags: [Product Category]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateProductCategory'
     *     responses:
     *       200:
     *         description: Product saved
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CreateProductCategorySuccess'
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CreateProductCategoryError'
     *
     */
    storeCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.productService.storeCategory(req.body as ProductCategoryStoreDto);
            return sendSuccessResponse(res, response, 'Product saved!');
        } catch (e) {
            next(e);
        }
    };

    /**
     * @swagger
     * /api/admins/products/categories:
     *   get:
     *     summary: Fetch product categories
     *     tags: [Product Category]
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
            return sendSuccessResponse(res, categories);
        } catch (e) {
            next(e);
        }
    };


}
