import { Router } from 'express';
import {RegisterRequestDto} from "../dtos/auth/register-request.dto";
import {AuthController} from "../controllers/auth/user/auth.controller";
import {validateBody} from "../middlewares/request-validator";
import {AuthService} from "../services/auth.service";
import {UserRepository} from "../repositories/user.repository";
import {WinstonLogger} from "../utils/logger/wintson.logger";
import {BcryptService} from "../utils/bycrypt/bycrypt.service";

const  router =  Router();

const userRepository = new UserRepository();
const logger = new WinstonLogger('Authentication');
const bcryptService = new BcryptService();


const authService = new AuthService(userRepository, logger, bcryptService);
const authController:AuthController = new AuthController(authService)

router.post('/auth/register', validateBody(RegisterRequestDto), authController.register);

export default router;
