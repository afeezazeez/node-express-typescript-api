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
        type: DataType.STRING,   // This specifies the data type
        allowNull: false,        // This ensures the column cannot be null
        defaultValue: 'Pending', // Default value for the column
    })
    status!: string; // Example status: Pending, Shipped,


    @Column({
        type: DataType.DECIMAL(10, 2), // Specifies the data type for total_amount
        allowNull: false,               // Ensures the column cannot be null
        defaultValue: 0.00,             // Default value for total_amount
    })
    total_amount!: number; // Total amount of the order

    @Column({
        type: DataType.STRING, // Specifies the data type for the reference column
        allowNull: true,       // This column is nullable
    })
    reference?: string; // Reference for the order, can be nullable
}

export default Order;
