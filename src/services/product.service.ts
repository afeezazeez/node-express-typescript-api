import {WinstonLogger} from "../utils/logger/wintson.logger";
import {ILogger} from "../utils/logger/logger.interface";
import {ClientErrorException} from "../exceptions/client.error.exception";
import {CategoryRepository} from "../repositories/category.repository";
import {ProductRepository} from "../repositories/product.repository";
import {ProductCategoryStoreDto} from "../dtos/product/product.category.store.dto";
import CategoryDto from "../dtos/product/category.dto";
import {ICategory} from "../interfaces/product/category.interface";


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
     * store product category
     * @param data {ProductCategoryStoreDto}
     * @returns {ICategory}
     * @throws {ClientErrorException}
     */
    async storeCategory(data: ProductCategoryStoreDto): Promise<ICategory> {
        const isNameExist = await this.categoryRepository.findByName(data.name)

        if (isNameExist){
            throw  new ClientErrorException("Category name exists");
        }

        try {
            const category = await this.categoryRepository.create(data)
            return CategoryDto.make(category)
        } catch (e) {
            this.logger.error(`[ProductService] Failed to create product category  with error: ${e}`);
            throw new ClientErrorException("Failed to create product");
        }
    }


}
