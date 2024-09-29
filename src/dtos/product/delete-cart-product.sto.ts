import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteProductToCartDto {

    @IsNotEmpty({ message: 'Product UUID is required.' })
    @IsUUID('4', { message: 'Product UUID must be a valid UUID.' })
    product_uuid!: string;
}
