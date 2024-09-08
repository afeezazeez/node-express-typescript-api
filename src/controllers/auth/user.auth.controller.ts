import { Request, Response, NextFunction } from 'express';
import { RegisterRequestDto } from "../../dtos/auth/register-request.dto";
import { sendSuccessResponse } from "../../utils/http-response/response-handlers";
import { AuthService } from "../../services/auth.service";
import { VerifyEmailRequestDto } from "../../dtos/auth/verify-email-request.dto";
import { ResendEmailRequestDto } from "../../dtos/auth/resend-email-request.dto";
import { LoginRequestDto } from "../../dtos/auth/login.request.dto";
import { ResponseStatus } from "../../enums/http-status-codes";
import { RequestPasswordLinkDto } from "../../dtos/auth/request-password-request.dto";
import { ResetPasswordRequestDto } from "../../dtos/auth/reset-password-request.dto";
import { IRequestWithUser } from "../../interfaces/request/request-user";

export class UserAuthController {

    private readonly authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    /**
     * @swagger
     * /api/users/auth/register:
     *   post:
     *     summary: Register a new user
     *     tags: [User Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RegisterRequestDto'
     *     responses:
     *       201:
     *         description: Registration successful
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SuccessResponse'
     */
    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.authService.register(req.body as RegisterRequestDto);
            return sendSuccessResponse(res, response, 'Registration successful. Please check your email', ResponseStatus.CREATED);
        } catch (e) {
            next(e);
        }
    };

    /**
     * @swagger
     * /api/users/auth/login:
     *   post:
     *     summary: Login a user
     *     tags: [User Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginRequestDto'
     *     responses:
     *       200:
     *         description: Login successful
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SuccessResponse'
     */
    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.authService.login(req.body as LoginRequestDto);
            return sendSuccessResponse(res, response, 'Login successful.');
        } catch (e) {
            next(e);
        }
    };

    /**
     * @swagger
     * /api/users/auth/user:
     *   get:
     *     summary: Get the authenticated user
     *     tags: [User Auth]
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Authenticated user details
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SuccessResponse'
     */
    getAuthUser = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
        try {
            const response = await this.authService.getAuthUser(req);
            return sendSuccessResponse(res, response);
        } catch (e) {
            next(e);
        }
    };

    /**
     * @swagger
     * /api/users/auth/logout:
     *   post:
     *     summary: Logout the authenticated user
     *     tags: [User Auth]
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Logout successful
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SuccessResponse'
     */
    logout = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
            const response = await this.authService.logout(token);
            return sendSuccessResponse(res, response, 'Logout successful.');
        } catch (e) {
            next(e);
        }
    };

    /**
     * @swagger
     * /api/users/auth/email/verify:
     *   post:
     *     summary: Verify user email
     *     tags: [User Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/VerifyEmailRequestDto'
     *     responses:
     *       200:
     *         description: Email verification successful
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SuccessResponse'
     */
    verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.verifyEmail(req.body as VerifyEmailRequestDto);
            return sendSuccessResponse(res, null, 'Email verification successful.');
        } catch (e) {
            next(e);
        }
    };

    /**
     * @swagger
     * /api/users/auth/email/resend:
     *   post:
     *     summary: Resend verification email
     *     tags: [User Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ResendEmailRequestDto'
     *     responses:
     *       200:
     *         description: Resend successful
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SuccessResponse'
     */
    resendEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.resendEmail(req.body as ResendEmailRequestDto);
            return sendSuccessResponse(res, null, 'Verification email resent successfully.');
        } catch (e) {
            next(e);
        }
    };

    /**
     * @swagger
     * /api/users/auth/password/request-reset:
     *   post:
     *     summary: Request password reset link
     *     tags: [User Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RequestPasswordLinkDto'
     *     responses:
     *       200:
     *         description: Password reset link sent
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SuccessResponse'
     */
    requestPasswordResetLink = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.requestPasswordResetLink(req.body as RequestPasswordLinkDto);
            return sendSuccessResponse(res, null, 'Password reset link sent successfully.');
        } catch (e) {
            next(e);
        }
    };

    /**
     * @swagger
     * /api/users/auth/password/reset:
     *   post:
     *     summary: Reset password
     *     tags: [User Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ResetPasswordRequestDto'
     *     responses:
     *       200:
     *         description: Password reset successful
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SuccessResponse'
     */
    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.resetPassword(req.body as ResetPasswordRequestDto);
            return sendSuccessResponse(res, null, 'Password was reset successfully.');
        } catch (e) {
            next(e);
        }
    };
}
