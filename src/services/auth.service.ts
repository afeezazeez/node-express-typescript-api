import {UserRepository} from "../repositories/user.repository";
import {WinstonLogger} from "../utils/logger/wintson.logger";
import {BcryptService} from "../utils/bycrypt/bycrypt.service";
import {ILogger} from "../utils/logger/logger.interface";
import {RegisterRequestDto} from "../dtos/auth/register-request.dto";
import {ClientErrorException} from "../exceptions/client.error.exception";

/**
 * Authentication Service: contains all logic that's related to user authentication
 */
export class AuthService {
    private readonly userRepository: UserRepository;
    private readonly logger: ILogger;
    private readonly bcryptService: BcryptService;

    constructor(
        userRepository: UserRepository,
        logger: WinstonLogger,
        bcryptService: BcryptService,
    ) {
        this.userRepository = userRepository;
        this.logger = logger;
        this.bcryptService = bcryptService;
    }


    /**
     * Registers new user
     * @param data {RegisterRequestDto}
     * @returns {boolean}
     * @throws {ClientErrorException}
     */
    async register(data: RegisterRequestDto): Promise<boolean> {

        const { displayName, email, password } = data;

        const isEmailExist = await this.userRepository.getByEmail(email);

        if (isEmailExist) {
            const message:string ="Email is already associated with an account";
            this.logger.error(message);
            throw new ClientErrorException(message);
        }
        const isDisplayNameExist = await this.userRepository.getByDisplayName(displayName);

        if (isDisplayNameExist) {
            const message:string ="Display name is already associated with an account";
            this.logger.error(message);
            throw new ClientErrorException(message);
        }

        try {
            const passwordHash = await this.bcryptService.make(password);
            const newUser = { ...data, password: passwordHash };
            await this.userRepository.create(newUser);
            return true;
        } catch (e) {
            this.logger.error(`[AuthService Error] Registration failed with error: ${e}`);
            throw new ClientErrorException("Registration failed.");
        }
    }

}
