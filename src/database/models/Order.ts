import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Cart from './Cart';
import User from './User';

@Table({
    tableName: 'orders',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class Order extends Model<Order> {
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

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    user_id!: number;

    @BelongsTo(() => User)
    user!: User;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    status!: string; // Pending, Shipped, Completed, etc.
}

export default Order;
