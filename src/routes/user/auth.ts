import {validateBody} from "../../middlewares/request-validator";
import {RegisterRequestDto} from "../../dtos/auth/register-request.dto";
import {VerifyEmailRequestDto} from "../../dtos/auth/verify-email-request.dto";
import {ResendEmailRequestDto} from "../../dtos/auth/resend-email-request.dto";
import {UserRepository} from "../../repositories/user.repository";
import {WinstonLogger} from "../../utils/logger/wintson.logger";
import {BcryptService} from "../../utils/bycrypt/bycrypt.service";
import {EmailService} from "../../utils/email/email.service";
import {RedisService} from "../../utils/redis/redis.service";
import {AuthService} from "../../services/auth/auth.service";
import {AuthController} from "../../controllers/auth/user/auth.controller";
import {Router} from "express";
import {LoginRequestDto} from "../../dtos/auth/login.request.dto";
import {JwtService} from "../../utils/jwt/jwt.service";
import {RequestPasswordLinkDto} from "../../dtos/auth/request-password-request.dto";

const  router =  Router();

const userRepository = new UserRepository();
const logger = new WinstonLogger('Auth');
const bcryptService = new BcryptService();
const emailService = new EmailService(logger)
const redisService = new RedisService();
const jwtService = new JwtService();


const authService = new AuthService(userRepository, logger, bcryptService,emailService,redisService,jwtService,'user');
const authController:AuthController = new AuthController(authService)

router.post('/register', validateBody(RegisterRequestDto), authController.register);
router.post('/login', validateBody(LoginRequestDto), authController.login);
router.post('/email/verify', validateBody(VerifyEmailRequestDto), authController.verifyEmail);
router.post('/email/resend', validateBody(ResendEmailRequestDto), authController.resendEmail);
router.post('/password-reset/request-link',validateBody(RequestPasswordLinkDto),authController.requestPasswordResetLink)


export default router;
