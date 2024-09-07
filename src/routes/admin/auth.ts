import {validateBody} from "../../middlewares/request-validator";
import {WinstonLogger} from "../../utils/logger/wintson.logger";
import {BcryptService} from "../../utils/bycrypt/bycrypt.service";
import {EmailService} from "../../utils/email/email.service";
import {RedisService} from "../../utils/redis/redis.service";
import {AuthService} from "../../services/auth.service";
import {AuthController} from "../../controllers/auth/auth.controller";
import {Router} from "express";
import {LoginRequestDto} from "../../dtos/auth/login.request.dto";
import {JwtService} from "../../utils/jwt/jwt.service";
import {RequestPasswordLinkDto} from "../../dtos/auth/request-password-request.dto";
import {ResetPasswordRequestDto} from "../../dtos/auth/reset-password-request.dto";
import {AuthMiddleware} from "../../middlewares/auth.middleware";
import {TokenBlacklistService} from "../../utils/token-blacklist/token.blacklist.service";
import {AdminRepository} from "../../repositories/admin.repository";
import {AdminService} from "../../services/admin.service";


const  router =  Router();

const adminRepository = new AdminRepository();
const bcryptService = new BcryptService();
const emailService = new EmailService(new WinstonLogger('Email Service'))
const redisService = new RedisService();
const jwtService = new JwtService();
const adminService = new AdminService(adminRepository,new WinstonLogger('Admin Service'));
const tokenBlacklistService = new TokenBlacklistService(redisService)
const authMiddleware = new AuthMiddleware(jwtService,adminService,tokenBlacklistService);


const authService = new AuthService(
    new WinstonLogger('Auth Service'),
    bcryptService,
    emailService,
    redisService,
    jwtService,
    tokenBlacklistService,
    'admin'
);

const authController:AuthController = new AuthController(authService)


router.get('/admin',authMiddleware.authenticate, authController.getAuthUser);
router.post('/login', validateBody(LoginRequestDto), authController.login);
router.post('/logout',authMiddleware.authenticate,  authController.logout);
router.post('/password-reset/request-link',validateBody(RequestPasswordLinkDto),authController.requestPasswordResetLink)
router.post('/password-reset/reset-password',validateBody(ResetPasswordRequestDto),authController.resetPassword)


export default router;
