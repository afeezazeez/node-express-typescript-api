import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import Category from "./Category";

@Table({
    tableName: 'products',
    paranoid: true,
    timestamps: true,
    underscored: true
})
export class Product extends Model<Product> {

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


    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    name!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    description!: string;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    price!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    quantity!: number;


    @ForeignKey(() => Category)
    @Column({
        type: DataType.UUIDV4,
        allowNull: true,
    })
    category_id!: string;


    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    enabled!: boolean;

}

export default Product;
