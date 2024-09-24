import { IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';

export class AddProductToCartDto {

    @IsNotEmpty({ message: 'Product UUID is required.' })
    @IsUUID('4', { message: 'Product UUID must be a valid UUID.' })
    product_uuid!: string;

    @IsNotEmpty({ message: 'Quantity is required.' })
    @IsInt({ message: 'Quantity must be an integer.' })
    @Min(1, { message: 'Quantity must be at least 1.' })
    quantity!: number;
}
