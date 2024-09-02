import {Request, Response, NextFunction, RequestHandler} from 'express';
import {RegisterRequestDto} from "../../../dtos/auth/register-request.dto";
import {sendSuccessResponse} from "../../../utils/http-response/response-handlers";
import {AuthService} from "../../../services/auth/auth.service";
import {VerifyEmailRequestDto} from "../../../dtos/auth/verify-email-request.dto";
import {ResendEmailRequestDto} from "../../../dtos/auth/resend-email-request.dto";

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
    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.authService.register(req.body as RegisterRequestDto);
            return sendSuccessResponse(res,response,'Registration successful. Please check your email',201)
        } catch (e) {
            next(e);
        }
    }

    /**
     * Verify user email
     * @param req {Request}
     * @param res (Response
     * @param next {NextFunction}
     * @returns {Response}
     */
    verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.verifyEmail(req.body as VerifyEmailRequestDto);
            return sendSuccessResponse(res,null,'Email verification successful.',200)
        } catch (e) {
            next(e);
        }
    }

    /**
     * Resend verification email
     * @param req {Request}
     * @param res (Response
     * @param next {NextFunction}
     * @returns {Response}
     */
    resendEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.resendEmail(req.body as ResendEmailRequestDto);
            return sendSuccessResponse(res,null,'Email verification resent successful.',200)
        } catch (e) {
            next(e);
        }
    }



}
