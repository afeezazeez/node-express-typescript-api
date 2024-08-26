import { Table, Column, Model, DataType, DefaultScope } from 'sequelize-typescript';

@DefaultScope(() => ({
    attributes: { exclude: ['password'] }
}))
@Table({
    tableName: 'users',
    timestamps: true,
    paranoid: true,
})
export class User extends Model<User> {

    @Column({
        primaryKey:true,
        type: DataType.UUIDV4,
        defaultValue: DataType.UUIDV4,
    })
    id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    display_name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    avatar!: string;

    @Column({
        field: 'deleted_at',
        type: DataType.DATE,
        allowNull: true,
    })
    deleted_at!: Date;

    @Column({
        field: 'created_at',
        type: DataType.DATE,
        allowNull: false,
    })
    created_at!: Date;

    @Column({
        field: 'updated_at',
        type: DataType.DATE,
        allowNull: false,
    })
    updated_at!: Date;
}
