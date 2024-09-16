import {IsNotEmpty} from 'class-validator';

export class ProductCategoryStoreDto {

    @IsNotEmpty({ message: 'Name is required.' })
    name!: string;
}


