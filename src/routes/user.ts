import { Router } from 'express';
import {RegisterRequestDto} from "../dtos/auth/register-request.dto";
import {AuthController} from "../controllers/auth/user/auth.controller";
import {validateBody} from "../middlewares/request-validator";
const  router =  Router();
const authController:AuthController = new AuthController()

router.post('/auth/register', validateBody(RegisterRequestDto), authController.register);

export default router;
