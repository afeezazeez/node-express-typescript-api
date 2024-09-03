import {UserRepository} from "../../repositories/user.repository";
import {WinstonLogger} from "../../utils/logger/wintson.logger";
import {BcryptService} from "../../utils/bycrypt/bycrypt.service";
import {ILogger} from "../../utils/logger/logger.interface";
import {RegisterRequestDto} from "../../dtos/auth/register-request.dto";
import {ClientErrorException} from "../../exceptions/client.error.exception";
import {IEmailService} from "../../utils/email/email.service.interface";
import {EmailService} from "../../utils/email/email.service";
import {jobQueue} from "../../config/queue/queue.config";
import {Jobs} from "../../enums/jobs.types";
import {Tokens} from "../../enums/tokens";
import configService from "../../utils/config/config.service";
import {IUser} from "../../interfaces/user/user.interface";
import {generateHash} from "../../utils/crypto-util/crypto";
import {SendMailArgs} from "../../interfaces/email/send.email";
import {RedisService} from "../../utils/redis/redis.service";
import {VerifyEmailRequestDto} from "../../dtos/auth/verify-email-request.dto";
import {ResponseStatus} from "../../enums/http-status-codes";
import UserDto from "../../dtos/user/user.dto";
import {ResendEmailRequestDto} from "../../dtos/auth/resend-email-request.dto";
import {LoginRequestDto} from "../../dtos/auth/login.request.dto";
import {JwtService} from "../../utils/jwt/jwt.service";
import {LoginResponseDto} from "../../dtos/auth/login.response.dto";

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
    private readonly jwtService:JwtService

    constructor(
        userRepository: UserRepository,
        logger: WinstonLogger,
        bcryptService: BcryptService,
        emailService:EmailService,
        redisService:RedisService,
        jwtService:JwtService,
        provider:string,
    ) {
        this.userRepository = userRepository;
        this.logger = logger;
        this.bcryptService = bcryptService;
        this.emailService = emailService;
        this.redisService = redisService;
        this.jwtService =jwtService
        this.provider = provider
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
            throw new ClientErrorException('Email is already associated with an account');
        }

        const  isPasswordCorrect = await this.bcryptService.check(data.password,user.password);

        if (!isPasswordCorrect){
            throw new ClientErrorException('Password is incorrect');
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
     * Send email verification link
     * @param user {User}
     * @returns {Promise<void>}
     */
     async sendVerificationEmail(user:IUser ): Promise<void> {
        const token = generateHash(user.email)
        const expiry = Tokens.EMAIL_VERIFICATION_TOKEN * 60
        await this.redisService.set(`${Tokens.EMAIL_VERIFICATION_REDIS_KEY}:${token}`, user.email,  expiry);
        const verificationLink = `${configService.get('APP_FRONTEND_URL')}/auth/email/verify?token=${token}`;
        const sendMailArgs: SendMailArgs = {
            to: user.email,
            subject: 'Please Verify Your Email',
            view: 'emails/verification.ejs',
            data: { name: user.displayName, verificationLink: verificationLink }
        };
        //Push the job to the queue to send the verification email
        await jobQueue.add(Jobs.SEND_VERIFICATION_EMAIL,sendMailArgs);
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




}
