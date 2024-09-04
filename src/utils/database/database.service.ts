import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';
import configService from "../config/config.service";
import {WinstonLogger} from "../logger/wintson.logger";
import { ILogger } from '../logger/logger.interface';
import {models} from "../../database/models";


 class DatabaseService {
    private readonly sequelize: Sequelize;
    private readonly logger: ILogger;
    private static instance: DatabaseService;

    constructor() {
        this.logger = new WinstonLogger('Database Service');

        this.sequelize = new Sequelize({
            database: configService.get<string>('DB_DATABASE_NAME') || 'homestead',
            dialect: (configService.get<string>('DB_DATABASE_DIALECT') || 'mysql') as Dialect,
            username: configService.get<string>('DB_DATABASE_USER') || 'root',
            password: configService.get<string>('DB_DATABASE_PASSWORD') || '',
            storage: ':memory:',
            models: models
        });



    }

     public static getInstance(): DatabaseService {
         if (!DatabaseService.instance) {
             DatabaseService.instance = new DatabaseService();
         }
         return DatabaseService.instance;
     }


     public authenticate(): void {
         this.sequelize
             .authenticate()
             .then(() => {
                 console.log('DB Connection Successful')
             })
             .catch((err) => {
                 console.log(`DB Connection Error: ${err}`)
                 process.exit(0);
             });
     }

}
export default DatabaseService.getInstance();