import { Request, Response, NextFunction } from 'express';
import {RegisterRequestDto} from "../../../dtos/auth/register-request.dto";
import {sendSuccessResponse} from "../../../utils/http-response/response-handlers";
import {AuthService} from "../../../services/auth.service";

export class AuthController {

    private readonly authService: AuthService;

    /**
     *
     * @param authService {AuthService}
     */
    constructor(authService: AuthService) {
        this.authService = authService;
    }

    /**
     * Register New User
     * @param req {Request}
     * @param res (Response
     * @param next {NextFunction}
     * @returns {Response}
     */
    async register(req: Request, res: Response,next:NextFunction):  Promise<Response | void> {
        try {
            const response = await this.authService.register(req.body as RegisterRequestDto);
            return sendSuccessResponse(res,response,'Registration successful. Please check your email',201)
        } catch (e) {
            next(e);
        }
    }

}
