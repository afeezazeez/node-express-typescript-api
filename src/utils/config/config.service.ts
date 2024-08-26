import dotenv from 'dotenv';
import { IConfigService } from './config.interface';

// Load environment variables from .env file
dotenv.config();

class ConfigService implements IConfigService {
    private static instance: ConfigService;
    private readonly config: any;

    constructor() {
        this.config = process.env;
    }

    public static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }

    public get<T = any>(key: string, defaultValue?: T): T | undefined {
        return (this.config[key] as T) || defaultValue;
    }

}

export default ConfigService.getInstance();
