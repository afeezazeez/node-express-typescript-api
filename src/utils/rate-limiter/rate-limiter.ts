import rateLimit from 'express-rate-limit';
import {RateLimitException} from "../../exceptions/rate.limit.exception";

export class RateLimiter {
    private readonly windowMs: number;
    private readonly max: number;
    private readonly message: string;
    private readonly standardHeaders: boolean;
    private readonly legacyHeaders: boolean;

    /**
     * Initialize the rate limiter with parameters.
     * @param {number} minutes - Time window in minutes.
     * @param {number} max - Maximum number of requests per IP.
     * @param {boolean} standardHeaders - Whether to return standard headers for rate limiting.
     * @param {boolean} legacyHeaders - Whether to return legacy headers for rate limiting.
     */
    constructor(
        minutes: number,
        max: number,
        standardHeaders: boolean = true,
        legacyHeaders: boolean = false
    ) {
        this.windowMs = minutes * 60 * 1000; // Convert minutes to milliseconds
        this.max = max;
        this.message = `Too many requests, please try again  in ${minutes} minutes.`;
        this.standardHeaders = standardHeaders;
        this.legacyHeaders = legacyHeaders;
    }

    /**
     * Get the rate limiting middleware.
     * @returns {rateLimit} Express rate limit middleware
     */
    getLimiter() {
        return rateLimit({
            windowMs: this.windowMs,
            max: this.max,
            message: this.message,
            standardHeaders: this.standardHeaders,
            legacyHeaders: this.legacyHeaders,
            handler: (req, res, next) => {
                next(new RateLimitException(this.message));
            },
        });
    }
}
