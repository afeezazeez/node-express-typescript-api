import { Sequelize } from 'sequelize-typescript';
import {User} from "../../database/models/User";

const sequelize = new Sequelize({
    database: 'node-api',
    dialect: 'mysql',
    username: 'root',
    password: '',
    storage: ':memory:',
    models: [User]
});