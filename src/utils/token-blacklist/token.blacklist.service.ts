import {RedisService} from "../redis/redis.service";
import {Tokens} from "../../enums/tokens";

export class TokenBlacklistService {
    private readonly redisService:RedisService;

    constructor(redisService:RedisService) {
        this.redisService = redisService
    }

    async addTokenToBlacklist(token: string): Promise<void> {
        const expiry = Tokens.TOKEN_BLACKLIST_EXPIRY * 60
        await this.redisService.set(token, 'blacklisted',expiry );
    }

    async isTokenBlacklisted(token: string): Promise<boolean> {
        const result = await this.redisService.get(token);
        return result === 'blacklisted';
    }
}
