import { Table, Column, Model, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import User from './User';
import CartItem from './CartItem';

@Table({
    tableName: 'carts',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class Cart extends Model<Cart> {
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

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    user_id!: number;

    @BelongsTo(() => User)
    user!: User;

    @HasMany(() => CartItem)
    cart_items!: CartItem[];

}

export default Cart;
