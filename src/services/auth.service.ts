import {UserRepository} from "../repositories/user.repository";
import {WinstonLogger} from "../utils/logger/wintson.logger";
import {BcryptService} from "../utils/bycrypt/bycrypt.service";
import {ILogger} from "../utils/logger/logger.interface";
import {RegisterRequestDto} from "../dtos/auth/register-request.dto";
import {ClientErrorException} from "../exceptions/client.error.exception";
import {IEmailService} from "../utils/email/email.service.interface";
import {EmailService} from "../utils/email/email.service";
import {jobQueue} from "../config/queue/queue.config";
import {Jobs} from "../enums/jobs.types";
import {Tokens} from "../enums/tokens";
import configService from "../utils/config/config.service";
import {IUser} from "../interfaces/user/user.interface";
import {generateHash} from "../utils/crypto-util/crypto";
import {SendMailArgs} from "../interfaces/email/send.email";
import {RedisService} from "../utils/redis/redis.service";
import {VerifyEmailRequestDto} from "../dtos/auth/verify-email-request.dto";
import {ResponseStatus} from "../enums/http-status-codes";
import UserDto from "../dtos/user/user.dto";
import {ResendEmailRequestDto} from "../dtos/auth/resend-email-request.dto";
import {LoginRequestDto} from "../dtos/auth/login.request.dto";
import {JwtService} from "../utils/jwt/jwt.service";
import {LoginResponseDto} from "../dtos/auth/login.response.dto";
import {RequestPasswordLinkDto} from "../dtos/auth/request-password-request.dto";
import {ResetPasswordRequestDto} from "../dtos/auth/reset-password-request.dto";
import {TokenBlacklistService} from "../utils/token-blacklist/token.blacklist.service";
import {Token} from "nodemailer/lib/xoauth2";
import {IRequestWithUser} from "../interfaces/request/request-user";

/**
 * Authentication Service: contains all logic that's related to user authentication
 */
export class AuthService {
    private readonly userRepository: UserRepository;
    private readonly logger: ILogger;
    private readonly bcryptService: BcryptService;
    private readonly emailService:IEmailService
    private readonly redisService:RedisService;
    private readonly provider;
    private readonly jwtService:JwtService;
    private readonly tokenBlacklistService:TokenBlacklistService

    constructor(
        userRepository: UserRepository,
        logger: WinstonLogger,
        bcryptService: BcryptService,
        emailService:EmailService,
        redisService:RedisService,
        jwtService:JwtService,
        tokenBlacklistService:TokenBlacklistService,
        provider:string,
    ) {
        this.userRepository = userRepository;
        this.logger = logger;
        this.bcryptService = bcryptService;
        this.emailService = emailService;
        this.redisService = redisService;
        this.jwtService =jwtService;
        this.tokenBlacklistService = tokenBlacklistService;
        this.provider = provider;
    }


    /**
     * Registers new user
     * @param data {RegisterRequestDto}
     * @returns {LoginResponseDto}
     * @throws {ClientErrorException}
     */
    async register(data: RegisterRequestDto): Promise<boolean> {

        const { displayName, email, password } = data;

        const isEmailExist = await this.userRepository.getByEmail(email);

        if (isEmailExist) {
            throw new ClientErrorException('Email is already associated with an account');
        }
        const isDisplayNameExist = await this.userRepository.getByDisplayName(displayName);

        if (isDisplayNameExist) {
            throw new ClientErrorException('Display name is already associated with an account');
        }

        try {
            const password = await this.bcryptService.make(data.password);
            const userData = { ...data, password};
            const newUser = await this.userRepository.create(userData);
            await this.sendVerificationEmail(UserDto.make(newUser));
            return true;
        } catch (e) {
            this.logger.error(`[AuthService Error] Registration failed with error: ${e}`);
            throw new ClientErrorException("Registration failed.");
        }
    }

    /**
     * Login
     * @param data {LoginRequestDto}
     * @returns {void}
     * @throws {ClientErrorException}
     */
    async login(data: LoginRequestDto): Promise<LoginResponseDto> {


        const user = await this.userRepository.getByEmail(data.email);

        if (!user) {
            throw new ClientErrorException('Email is not associated with an account');
        }

        const  isPasswordCorrect = await this.bcryptService.check(data.password,user.password);

        if (!isPasswordCorrect){
            throw new ClientErrorException('Password is incorrect');
        }

        if (!user.email_verified_at){
            throw new ClientErrorException('Email has not be verified. Please request link');
        }

        try {
            const payload = {email:user.email}
            const token = this.jwtService.signPayload(payload);
            return new LoginResponseDto(token,user.displayName);
        } catch (e) {
            this.logger.error(`[AuthService Error] Login failed with error: ${e}`);
            throw new ClientErrorException("Login failed.");
        }
    }


    /**
     * Get Authenticated User
     * @param req {IRequestWithUser}
     * @returns {Promise<IUser | null>}
     * @throws {ClientErrorException}
     */
    async getAuthUser(req: IRequestWithUser): Promise<IUser | null> {
        return req.user || null;
    }


    /**
     * Logout
     * @param token
     * @returns {void}
     * @throws {ClientErrorException}
     */
    async logout(token:any): Promise<void> {
        await this.tokenBlacklistService.addTokenToBlacklist(token);
    }


    /**
     * Verify user email
     * @param data {VerifyEmailRequestDto}
     * @returns {Promise<boolean>}
     */
    async verifyEmail(data:VerifyEmailRequestDto): Promise<boolean>{

        const email = await this.redisService.get(`${Tokens.EMAIL_VERIFICATION_REDIS_KEY}:${data.token}`)

        if (!email){
            throw new ClientErrorException("Verification link is invalid or has expired")
        }

        const user = await this.userRepository.getByEmail(email)

        if (!user){
            throw new ClientErrorException("User not found",ResponseStatus.BAD_REQUEST)
        }

        try {
            const response = await this.userRepository.update({email_verified_at: new Date()},user.id)
            if (response){
                await this.redisService.del(`${Tokens.EMAIL_VERIFICATION_REDIS_KEY}:${data.token}`)
            }
            return true;
        } catch (e) {
            this.logger.error(`[AuthService Error] Email verification failed with error: ${e}`);
            throw new ClientErrorException("Email verification failed.");
        }

    }


    /**
     * Resend user email
     * @param data {ResendEmailRequestDto}
     * @returns {Promise<boolean>}
     */
    async resendEmail(data:ResendEmailRequestDto): Promise<boolean>{

        const user = await this.userRepository.getByEmail(data.email)

        if (!user){
            throw new ClientErrorException("Email is not associated with any account",ResponseStatus.BAD_REQUEST)
        }

        if(user.email_verified_at){
            throw new ClientErrorException("Account is already verified",ResponseStatus.BAD_REQUEST)
        }

        try {
            await this.sendVerificationEmail(UserDto.make(user));
            return true;
        } catch (e) {
            this.logger.error(`[AuthService Error] Resending Email verification failed with error: ${e}`);
            throw new ClientErrorException("Failed to resend email.");
        }

    }

    /**
     * Resend user email
     * @param data {RequestPasswordLinkDto}
     * @returns {Promise<boolean>}
     */
    async requestPasswordResetLink(data:RequestPasswordLinkDto): Promise<boolean>{

        const user = await this.userRepository.getByEmail(data.email)

        if (!user){
            throw new ClientErrorException("Email is not associated with any account",ResponseStatus.BAD_REQUEST)
        }

        try {
            await this.sendPasswordResetLink(UserDto.make(user));
            return true;
        } catch (e) {
            this.logger.error(`[AuthService Error] Resending Email verification failed with error: ${e}`);
            throw new ClientErrorException("Failed to resend email.");
        }

    }

    /**
     * Reset  password
     * @param data {RequestPasswordLinkDto}
     * @returns {Promise<boolean>}
     */
    async resetPassword(data:ResetPasswordRequestDto): Promise<boolean>{

        const email = await this.redisService.get(`${Tokens.PASSWORD_RESET_REDIS_KEY}:${data.token}`)

        if (!email){
            throw new ClientErrorException("Password reset link is invalid or has expired")
        }

        if (data.new_password !== data.confirm_new_password){
            throw new ClientErrorException("Passwords do not  match")
        }

        const user = await this.userRepository.getByEmail(email)

        if (!user){
            throw new ClientErrorException('Please request new link')
        }

        const  isOldPasswordCorrect = await this.bcryptService.check(data.old_password,user.password);

        if (!isOldPasswordCorrect){
            throw new ClientErrorException('Old password is incorrect');
        }

        const  isNewPasswordCurrent = await this.bcryptService.check(data.new_password,user.password);

        if (isNewPasswordCurrent){
            throw new ClientErrorException('Please set a new password different from old password');
        }


        try {
            const new_password = await this.bcryptService.make(data.new_password);
            const response = await this.userRepository.update({password:new_password},user.id)
            if (response){
                await this.redisService.del(`${Tokens.PASSWORD_RESET_REDIS_KEY}:${data.token}`)
            }
            return true;
        } catch (e) {
            this.logger.error(`[AuthService Error] Password reset failed with error: ${e}`);
            throw new ClientErrorException("Failed to reset password.");
        }

    }


    /**
     * Send email verification link
     * @param user {User}
     * @returns {Promise<void>}
     */
    async sendVerificationEmail(user:IUser ): Promise<void> {
        const sendMailArgs: SendMailArgs = {
            to: user.email,
            subject: 'Please Verify Your Email',
            view: 'emails/verification.ejs',
            data: { name: user.displayName }
        };
        await this.triggerEmail(user, sendMailArgs,'email-verify')
    }

    /**
     * Send password reset link
     * @param user {User}
     * @returns {Promise<void>}
     */
    async sendPasswordResetLink(user:IUser ): Promise<void> {

        const sendMailArgs: SendMailArgs = {
            to: user.email,
            subject: 'Password Reset Link',
            view: 'emails/password-reset.ejs',
            data: { name: user.displayName }
        };
        await this.triggerEmail(user, sendMailArgs,null)
    }


    /**
     * Send email
     * @param user {User}
     * @param emailData
     * @param type
     * @returns {Promise<void>}
     */
    async triggerEmail(user:IUser,emailData:SendMailArgs,type:string|null ): Promise<void> {

        const token = generateHash(user.email)
        const expiry =  type === 'email-verify' ? Tokens.EMAIL_VERIFICATION_TOKEN_EXPIRY : Tokens.PASSWORD_RESET_TOKEN_EXPIRY
        const redisKey = type === 'email-verify' ? Tokens.EMAIL_VERIFICATION_REDIS_KEY : Tokens.PASSWORD_RESET_REDIS_KEY
        const url =  type === 'email-verify' ? 'email/verify' : 'password-reset/reset'
        const link = `${configService.get('APP_FRONTEND_URL')}/auth/${url}?token=${token}`;
        const job_type = type === 'email-verify' ? Jobs.SEND_VERIFICATION_EMAIL : Jobs.SEND_PASSWORD_RESET_EMAIL


        await this.redisService.set(`${redisKey}:${token}`, user.email,  expiry*60);
        emailData.data = emailData.data || {};
        emailData.data.link = link;
        emailData.data.expiry = `${expiry} minutes`;
        //Push the job to the queue to send the verification email
        await jobQueue.add(job_type,emailData,{
            attempts:3,
            backoff :{
                type: 'fixed',
                delay: 9000, // 9 seconds delay between retries
            }
        });
    }




}
