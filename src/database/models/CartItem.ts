import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Cart from './Cart';
import Product from './Product';

@Table({
    tableName: 'cart_items',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class CartItem extends Model<CartItem> {
    @Column({
        autoIncrement: true,
        primaryKey: true,
        type: DataType.INTEGER,
    })
    id!: number;

    @Column({
        primaryKey:true,
        type: DataType.UUIDV4,
        defaultValue: DataType.UUIDV4,
    })
    uuid!: string;

    @ForeignKey(() => Cart)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    cart_id!: number;

    @BelongsTo(() => Cart)
    cart!: Cart;

    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    product_id!: number;

    @BelongsTo(() => Product)
    product!: Product;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    quantity!: number;
}

export default CartItem;
