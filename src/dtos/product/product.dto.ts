import { IProduct } from "../../interfaces/product/product.interface";
import CategoryDto from "./category.dto";
import {ICategory} from "../../interfaces/product/category.interface";

class ProductDto implements IProduct {
    name: string;
    uuid: string;
    description: string;
    price: number;
    category: ICategory;

    constructor(productModel: any) {
        this.name = productModel.name;
        this.uuid = productModel.uuid;
        this.description = productModel.description;
        this.price = productModel.price;
        this.category = CategoryDto.make(productModel.category);
    }

    static make(productModel: any): IProduct {
        const productDto = new ProductDto(productModel);
        return {
            name: productDto.name,
            uuid: productDto.uuid,
            description: productDto.description,
            price: productDto.price,
            category: productDto.category,
        };
    }

    static collection(productModels: any[]): IProduct[] {
        if (!productModels || !Array.isArray(productModels)) {
            return [];
        }

        return productModels.map(productModel => ProductDto.make(productModel));
    }
}

export default ProductDto;
