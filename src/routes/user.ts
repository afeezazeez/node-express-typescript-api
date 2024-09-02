import { Router } from 'express';
import {RegisterRequestDto} from "../dtos/auth/register-request.dto";
import {VerifyEmailRequestDto} from "../dtos/auth/verify-email-request.dto";
import {AuthController} from "../controllers/auth/user/auth.controller";
import {validateBody} from "../middlewares/request-validator";
import {AuthService} from "../services/auth/auth.service";
import {UserRepository} from "../repositories/user.repository";
import {WinstonLogger} from "../utils/logger/wintson.logger";
import {BcryptService} from "../utils/bycrypt/bycrypt.service";
import {EmailService} from "../services/email/email.service";
import {RedisService} from "../utils/redis/redis.service";

const  router =  Router();

const userRepository = new UserRepository();
const logger = new WinstonLogger('Auth');
const bcryptService = new BcryptService();
const emailService = new EmailService(logger)
const redisService = new RedisService()


const authService = new AuthService(userRepository, logger, bcryptService,emailService,redisService);
const authController:AuthController = new AuthController(authService)


router.post('/auth/register', validateBody(RegisterRequestDto), authController.register);
router.post('/auth/email/verify', validateBody(VerifyEmailRequestDto), authController.verifyEmail);

export default router;
