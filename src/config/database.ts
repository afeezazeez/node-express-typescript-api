import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';

const sequelize = new Sequelize({
    database: process.env.DB_DATABASE_NAME,
    dialect: process.env.DB_DATABASE_DIALECT as Dialect || 'mysql',
    username: process.env.DB_DATABASE_USER || 'root',
    password: process.env.DB_DATABASE_PASSWORD || '',
    host: process.env.DB_DATABASE_HOST || 'localhost',
    models: [__dirname + "/database/models"],
});

export default sequelize;
