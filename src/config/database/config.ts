import {config} from 'dotenv';

config();
export const development = {
    username: process.env.DB_DATABASE_USER,
    password: process.env.DB_DATABASE_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_DATABASE_HOST,
    dialect: process.env.DB_DATABASE_DIALECT,
    port: process.env.DB_DATABASE_PORT
};
export const test = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT
};
export const production = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT
};
