import { Request, Response, NextFunction } from 'express';
import { sendSuccessResponse } from "../../utils/http/response-handlers";
import { AuthService } from "../../services/auth.service";

import { LoginRequestDto } from "../../dtos/auth/login.request.dto";
import { RequestPasswordLinkDto } from "../../dtos/auth/request-password-request.dto";
import { ResetPasswordRequestDto } from "../../dtos/auth/reset-password-request.dto";
import { IRequestWithUser } from "../../interfaces/request/request-user";

export class AdminAuthController {

    private readonly authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }


    /**
     * @swagger
     * /api/admins/auth/login:
     *   post:
     *     summary: Login an admin
     *     tags: [Admin Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: 'Etha62@hotmail.com'
     *               password:
     *                 type: string
     *                 format: password
     *                 example: '123456'
     *             required:
     *               - email
     *               - password
     *     responses:
     *       200:
     *         description: Login successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: 'Login successful'
     *                 data:
     *                   type: object
     *                   properties:
     *                     token:
     *                       type: string
     *                       example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
     *                     display_name:
     *                       type: string
     *                       example: 'johndoe'
     *       400:
     *         description: Bad request - Either password is incorrect or email is not associated with any account
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - type: object
     *                   properties:
     *                     success:
     *                       type: boolean
     *                       example: false
     *                     message:
     *                       type: string
     *                       example: 'Password is incorrect'
     *                 - type: object
     *                   properties:
     *                     success:
     *                       type: boolean
     *                       example: false
     *                     message:
     *                       type: string
     *                       example: 'Email is not associated with an account'
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
     * /api/admins/auth/admin:
     *   get:
     *     summary: Get the authenticated admin
     *     tags: [Admin Auth]
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Authenticated user details
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   type: object
     *                   properties:
     *                     displayName:
     *                       type: string
     *                       example: 'john@12'
     *                     email:
     *                       type: string
     *                       example: 'Alvah30@yahoo.com'
     *       401:
     *         description: Unauthorized
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: 'Unauthenticated'
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
     * /api/admins/auth/logout:
     *   post:
     *     summary: Logout the authenticated admin
     *     tags: [Admin Auth]
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Logout successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: 'Logout successful.'
     *       401:
     *         description: Unauthorized
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: 'Unauthenticated'
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
     * /api/admins/auth/password-reset/request-link:
     *   post:
     *     summary: Request password reset link
     *     tags: [Admin Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: 'Alvah30@yahoo.com'
     *             required:
     *               - email
     *     responses:
     *       200:
     *         description: Password reset link sent
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: 'Password reset link sent successfully.'
     *       400:
     *         description: Incorrect email
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: 'Email is not associated with an account'
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
     * /api/admins/auth/password-reset/reset-password:
     *   post:
     *     summary: Reset password
     *     tags: [Admin Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               token:
     *                 type: string
     *                 example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
     *               old_password:
     *                 type: string
     *                 example: 'oldPassword123'
     *               new_password:
     *                 type: string
     *                 example: 'newPassword123'
     *               confirm_new_password:
     *                 type: string
     *                 example: 'newPassword123'
     *             required:
     *               - token
     *               - old_password
     *               - new_password
     *               - confirm_new_password
     *     responses:
     *       200:
     *         description: Password reset successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: 'Password was reset successfully.'
     *       400:
     *         description: Bad request - Various possible errors
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - type: object
     *                   properties:
     *                     success:
     *                       type: boolean
     *                       example: false
     *                     message:
     *                       type: string
     *                       example: 'Password reset link is invalid or has expired'
     *                 - type: object
     *                   properties:
     *                     success:
     *                       type: boolean
     *                       example: false
     *                     message:
     *                       type: string
     *                       example: 'Old password is incorrect'
     *                 - type: object
     *                   properties:
     *                     success:
     *                       type: boolean
     *                       example: false
     *                     message:
     *                       type: string
     *                       example: 'Please set a new password different from old password'
     *                 - type: object
     *                   properties:
     *                     success:
     *                       type: boolean
     *                       example: false
     *                     message:
     *                       type: string
     *                       example: 'Passwords do not match'
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
