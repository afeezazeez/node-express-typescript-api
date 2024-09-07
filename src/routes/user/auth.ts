import {validateBody} from "../../middlewares/request-validator";
import {RegisterRequestDto} from "../../dtos/auth/register-request.dto";
import {VerifyEmailRequestDto} from "../../dtos/auth/verify-email-request.dto";
import {ResendEmailRequestDto} from "../../dtos/auth/resend-email-request.dto";
import {UserRepository} from "../../repositories/user.repository";
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
import {UserService} from "../../services/user.service";
import {TokenBlacklistService} from "../../utils/token-blacklist/token.blacklist.service";


const  router =  Router();

const userRepository = new UserRepository();
const bcryptService = new BcryptService();
const emailService = new EmailService(new WinstonLogger('Email Service'))
const redisService = new RedisService();
const jwtService = new JwtService();
const userService = new UserService(userRepository,new WinstonLogger('User Service'));
const tokenBlacklistService = new TokenBlacklistService(redisService)
const authMiddleware = new AuthMiddleware(jwtService,userService,tokenBlacklistService);


const authService = new AuthService(
    new WinstonLogger('Auth Service'),
    bcryptService,
    emailService,
    redisService,
    jwtService,
    tokenBlacklistService,
    'user'
);

const authController:AuthController = new AuthController(authService)
router.get('/user',authMiddleware.authenticate, authController.getAuthUser);

router.post('/register', validateBody(RegisterRequestDto), authController.register);
router.post('/login', validateBody(LoginRequestDto), authController.login);
router.post('/logout',authMiddleware.authenticate,  authController.logout);
router.post('/email/verify', validateBody(VerifyEmailRequestDto), authController.verifyEmail);
router.post('/email/resend', validateBody(ResendEmailRequestDto), authController.resendEmail);
router.post('/password-reset/request-link',validateBody(RequestPasswordLinkDto),authController.requestPasswordResetLink)
router.post('/password-reset/reset-password',validateBody(ResetPasswordRequestDto),authController.resetPassword)


export default router;
