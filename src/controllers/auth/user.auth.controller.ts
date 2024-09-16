import { Request, Response, NextFunction } from 'express';
import { RegisterRequestDto } from "../../dtos/auth/register-request.dto";
import { sendSuccessResponse } from "../../utils/http/response-handlers";
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
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: 'user@example.com'
     *               displayName:
     *                 type: string
     *                 example: 'JohnDoe'
     *               password:
     *                 type: string
     *                 example: 'password123'
     *             required:
     *               - email
     *               - displayName
     *               - password
     *     responses:
     *       201:
     *         description: Registration successful
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
     *                   example: 'Registration successful. Please check your email'
     *       400:
     *         description: Bad request - Various validation errors
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
     *                       example: 'Email is already associated with an account'
     *                 - type: object
     *                   properties:
     *                     success:
     *                       type: boolean
     *                       example: false
     *                     message:
     *                       type: string
     *                       example: 'Display name is already associated with an account'
     *                 - type: object
     *                   properties:
     *                     success:
     *                       type: boolean
     *                       example: false
     *                     message:
     *                       type: string
     *                       example: 'Password must be at least 6 characters long.'
     *                 - type: object
     *                   properties:
     *                     success:
     *                       type: boolean
     *                       example: false
     *                     message:
     *                       type: string
     *                       example: 'Password must not exceed 12 characters.'
     */

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.authService.register(req.body as RegisterRequestDto);
            return sendSuccessResponse(res, null, 'Registration successful. Please check your email', ResponseStatus.CREATED);
        } catch (e) {
            next(e);
        }
    };


    /**
     * @swagger
     * /api/users/auth/login:
     *   post:
     *     summary: Login an user
     *     tags: [User Auth]
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
     *                 example: 'azeezafeez212@gmail.com'
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
     *                       example: 'chilling'
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
     * /api/users/auth/user:
     *   get:
     *     summary: Get the authenticated admin
     *     tags: [User Auth]
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
     *                       example: 'chilling'
     *                     email:
     *                       type: string
     *                       example: 'azeezafeez212@gmail.com'
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
     * /api/users/auth/email/verify:
     *   post:
     *     summary: Verify user email
     *     tags: [User Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               token:
     *                 type: string
     *                 example: '02840877ad59ea384a38f55f971c82fe95a25593179b1ea1bdef5f843fe1'
     *             required:
     *               - token
     *     responses:
     *       200:
     *         description: Email verification successful
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
     *                   example: 'Email verification successful.'
     *       400:
     *         description: Bad Request - Invalid or expired verification link
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
     *                   example: 'Verification link is invalid or has expired'
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
     *     summary: Request email verification link
     *     tags: [User Auth]
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
     *                 example: 'azeezafeez212@gmail.com'
     *             required:
     *               - email
     *     responses:
     *       200:
     *         description: Verification link sent
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
     *                   example: 'Verification email resent successfully.'
     *       400:
     *         description: Bad request
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
     *                       example: 'Email is not associated with an account.'
     *                 - type: object
     *                   properties:
     *                     success:
     *                       type: boolean
     *                       example: false
     *                     message:
     *                       type: string
     *                       example: 'Account is already verified'
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
     * /api/users/auth/password-reset/request-link:
     *   post:
     *     summary: Request password reset link
     *     tags: [User Auth]
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
     *                 example: 'azeezafeez212@gmail.com'
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
     * /api/users/auth/password-reset/reset-password:
     *   post:
     *     summary: Reset password
     *     tags: [User Auth]
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
