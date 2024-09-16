import { Request, Response, NextFunction } from 'express';
import { sendSuccessResponse } from "../../utils/http/response-handlers";
import {ProductCategoryStoreDto} from "../../dtos/product/product.category.store.dto";
import {ProductService} from "../../services/product.service";

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


}
