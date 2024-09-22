import { IsNotEmpty, IsNumber, IsPositive, IsInt, Min } from 'class-validator';

export class ProductStoreDto {

    @IsNotEmpty({ message: 'Name is required.' })
    name!: string;

    @IsNotEmpty({ message: 'Description is required.' })
    description!: string;

    @IsNumber({}, { message: 'Price must be a valid number.' })
    @IsPositive({ message: 'Price must be a positive number.' })
    price!: number;

    @IsInt({ message: 'Quantity must be an integer.' })
    @Min(1, { message: 'Quantity must be at least 1.' })
    quantity!: number;

    @IsNotEmpty({ message: 'Category UUID is required.' })
    category_uuid!: string;
}
