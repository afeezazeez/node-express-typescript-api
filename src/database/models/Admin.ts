import { Table, Column, Model, DataType } from 'sequelize-typescript';


@Table({
    tableName: 'admins',
    paranoid: true,
    timestamps: true,
    underscored: true
})
export class Admin extends Model<Admin> {

    @Column({
        primaryKey:true,
        type: DataType.UUIDV4,
        defaultValue: DataType.UUIDV4,
    })
    id!: string;

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
    displayName!: string;

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
}

export default Admin;