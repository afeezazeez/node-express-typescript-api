import { Table, Column, Model, DataType } from 'sequelize-typescript';


@Table({
    tableName: 'users',
    paranoid: true,
    timestamps: true,
    underscored: true
})
export class User extends Model<User> {

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

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    email_verified_at!: Date;
}

export default User;