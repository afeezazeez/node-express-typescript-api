import { Redis } from 'ioredis';
import configService from '../config/config.service';

export class RedisService {
    private redis: Redis;

    constructor() {
        this.redis = new Redis({
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
        });
    }

    /**
     * Set a key-value pair in Redis with an optional expiration time in minutes
     * @param key {string}
     * @param value {string}
     * @param expiryInMinutes {number} (optional)
     * @returns {Promise<void>}
     */
    async set(key: string, value: string, expiryInMinutes?: number): Promise<void> {
        if (expiryInMinutes) {
            await this.redis.set(key, value, 'EX', expiryInMinutes);
        } else {
            await this.redis.set(key, value);
        }
    }

    /**
     * Get a value by key from Redis
     * @param key {string}
     * @returns {Promise<string | null>}
     */
    async get(key: string): Promise<string | null> {
        return this.redis.get(key);
    }

    /**
     * Delete a key from Redis
     * @param key {string}
     * @returns {Promise<number>} Number of keys removed (1 if successful, 0 if the key did not exist)
     */
    async del(key: string): Promise<number> {
        return this.redis.del(key);
    }
}
