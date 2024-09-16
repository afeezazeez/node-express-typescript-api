import {ICategory} from "../../interfaces/product/category.interface";

class CategoryDto implements ICategory{
    name: string;
    uuid:string;

    constructor(categoryModel: any) {
        this.name = categoryModel.name;
        this.uuid = categoryModel.uuid;
    }

    static make(categoryModel: any): ICategory {
        const categoryDto = new CategoryDto(categoryModel);
        return {
            name: categoryDto.name,
            uuid: categoryDto.uuid,
        };
    }

    static collection(categoryModels: any[]): ICategory[] {
        if (!categoryModels || !Array.isArray(categoryModels)) {
            return [];
        }

        return categoryModels.map(categoryModel => CategoryDto.make(categoryModel));
    }
}

export default CategoryDto;
