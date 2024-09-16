import { Table, Column, Model, DataType } from 'sequelize-typescript';


@Table({
    tableName: 'categories',
    paranoid: true,
    timestamps: true,
    underscored: true
})
export class Category extends Model<Category> {

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
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    enabled!: boolean;

}

export default Category;