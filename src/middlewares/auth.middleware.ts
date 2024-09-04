// src/middlewares/auth.middleware.ts
import { Response, NextFunction, RequestHandler } from 'express';
import {JwtService} from "../utils/jwt/jwt.service";
import {UserService} from "../services/user.service";
import {AuthenticationException} from "../exceptions/authentication.exception";
import {IRequestWithUser} from "../interfaces/request/request-user";
import {TokenBlacklistService} from "../utils/token-blacklist/token.blacklist.service";
import {ResponseStatus} from "../enums/http-status-codes";

export class AuthMiddleware {
    private readonly jwtService: JwtService;
    private readonly userService: UserService;
    private readonly tokenBlacklistService:TokenBlacklistService;

    constructor(
        jwtService: JwtService,
        userService: UserService,
        tokenBlacklistService:TokenBlacklistService
    ) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    public authenticate: RequestHandler = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(new AuthenticationException('No authentication header provided'));
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return next(new AuthenticationException('No authentication token provided'));
        }

        const isTokenBlacklisted = await this.tokenBlacklistService.isTokenBlacklisted(token)

        if (isTokenBlacklisted){
            next(new AuthenticationException('Token has expired. Please login again'));
        }

        try {
            const { email } = this.jwtService.verifyToken(token);
            req.user = await this.userService.getUserByEmail(email);
            next();
        } catch (error) {
            next(new AuthenticationException('Invalid or expired token'));
        }
    }
}
