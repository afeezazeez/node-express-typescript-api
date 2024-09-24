import {WinstonLogger} from "../utils/logger/wintson.logger";
import {ILogger} from "../utils/logger/logger.interface";
import {ClientErrorException} from "../exceptions/client.error.exception";
import {CategoryRepository} from "../repositories/category.repository";
import {ProductRepository} from "../repositories/product.repository";
import {ProductCategoryStoreDto} from "../dtos/product/product.category.store.dto";
import {PaginationMeta, PaginationOptions} from "../interfaces/request/pagination";
import {generatePaginationMeta} from "../utils/helper";
import {ProductStoreDto} from "../dtos/product/product.store.dto";
import {ResponseStatus} from "../enums/http-status-codes";
import Product from "../database/models/Product";
import Category from "../database/models/Category";


/**
 * Product Service: contains all logic that's related to product and category model
 */
export class ProductService {
    private readonly productRepository: ProductRepository;
    private readonly categoryRepository: CategoryRepository;
    private readonly logger: ILogger;


    constructor(
        productRepository: ProductRepository,
        categoryRepository:CategoryRepository,
        logger: WinstonLogger,
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.logger = logger;
    }



    /**
     * store product
     * @param data {ProductStoreDto}
     * @returns {Product|null}
     * @throws {ClientErrorException}
     */
    async storeProduct(data: ProductStoreDto): Promise<Product|null> {

        const category = await this.categoryRepository.findByUuid(data.category_uuid)

        if (!category){
            throw  new ClientErrorException("Product category does not exists",ResponseStatus.NOT_FOUND);
        }

        const isNameExist = await this.productRepository.findByName(data.name)

        if (isNameExist){
            throw  new ClientErrorException("Product name exists");
        }

        try {
            const productData = {
                ...data,
                category_id: category.id
            };

            const product = await this.productRepository.create(productData);

            return await this.productRepository.findById(product.id, {
                include: [Category]
            });

        } catch (e) {
            this.logger.error(`[ProductService] Failed to create product with error: ${e}`);
            throw new ClientErrorException("Failed to create product");
        }
    }

    /**
     * fetch product
     * @returns {data: Product[]; meta: PaginationMeta }
     * @throws {ClientErrorException}
     */
    async getProducts(findOptions:any,paginationOptions:PaginationOptions): Promise<{ data: Product[]; meta: PaginationMeta }> {
        try {

            const options = {
                ...findOptions,
                include: [Category]
            };

            const { page = 1, limit = 25 } = paginationOptions;

            const { rows, count } = await this.productRepository.findAll(options, paginationOptions);

            const meta = generatePaginationMeta(count, page, limit);

            return {
                data: rows,
                meta,
            };
        } catch (e) {
            this.logger.error(`[ProductService] Failed to fetch products with error: ${e}`);
            throw new ClientErrorException("Failed to fetch products");
        }
    }


    /**
     * store product category
     * @param data {ProductCategoryStoreDto}
     * @returns {Category}
     * @throws {ClientErrorException}
     */
    async storeCategory(data: ProductCategoryStoreDto): Promise<Category> {
        const isNameExist = await this.categoryRepository.findByName(data.name)

        if (isNameExist){
            throw  new ClientErrorException("Category name exists");
        }

        try {
            return  await this.categoryRepository.create(data)
        } catch (e) {
            this.logger.error(`[ProductService] Failed to create product category  with error: ${e}`);
            throw new ClientErrorException("Failed to create product category");
        }
    }

    /**
     * fetch product categories
     * @returns {data: Category[]; meta: PaginationMeta }
     * @throws {ClientErrorException}
     */
    async getCategories(findOptions:any,paginationOptions:PaginationOptions): Promise<{ data: Category[]; meta: PaginationMeta }> {
        try {

            const { page = 1, limit = 25 } = paginationOptions;

            const { rows, count } = await this.categoryRepository.findAll(findOptions, paginationOptions);

            const meta = generatePaginationMeta(count, page, limit);

            return {
                data: rows,
                meta,
            };
        } catch (e) {
            this.logger.error(`[ProductService] Failed to fetch product categories with error: ${e}`);
            throw new ClientErrorException("Failed to fetch product categories");
        }
    }




}
