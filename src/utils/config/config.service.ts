import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

class ConfigService {
    private static instance: ConfigService;

    private constructor() {}

    public static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }

    public get(key: string): string {
        return process.env[key] || '';
    }
}

export default ConfigService.getInstance();
