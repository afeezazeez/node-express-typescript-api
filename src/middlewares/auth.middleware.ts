
import { Response, NextFunction, RequestHandler } from 'express';
import {JwtService} from "../utils/jwt/jwt.service";
import {AuthenticationException} from "../exceptions/authentication.exception";
import {IRequestWithUser} from "../interfaces/request/request-user";
import {TokenBlacklistService} from "../utils/token-blacklist/token.blacklist.service";


export class AuthMiddleware {
    private readonly jwtService: JwtService;
    private readonly entityService: any;
    private readonly tokenBlacklistService:TokenBlacklistService;

    constructor(
        jwtService: JwtService,
        entityService:any,
        tokenBlacklistService:TokenBlacklistService,
    ) {
        this.jwtService = jwtService;
        this.entityService = entityService;
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
            next(new AuthenticationException('Unauthenticated'));
        }

        try {
            const { email } = this.jwtService.verifyToken(token);
            req.user = await this.entityService.getUserByEmail(email);
            next();
        } catch (error) {
            console.log(error)
            next(new AuthenticationException('Unauthenticated'));
        }
    }
}
