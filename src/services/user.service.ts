import {UserRepository} from "../repositories/user.repository";
import {WinstonLogger} from "../utils/logger/wintson.logger";
import {ILogger} from "../utils/logger/logger.interface";
import {ClientErrorException} from "../exceptions/client.error.exception";
import {IUser} from "../interfaces/user/user.interface";
import UserDto from "../dtos/user/user.dto";

/**
 * User Service: contains all logic that's related to user model
 */
export class UserService {
    private readonly userRepository: UserRepository;
    private readonly logger: ILogger;


    constructor(
        userRepository: UserRepository,
        logger: WinstonLogger,
    ) {
        this.userRepository = userRepository;
        this.logger = logger;
    }


    /**
     * get user by email
     * @param email {string}
     * @returns {IUser}
     * @throws {ClientErrorException}
     */
    async getUserByEmail(email: string): Promise<IUser> {

        try {
            const user = this.userRepository.getByEmail(email)
            return UserDto.make(user)
        } catch (e) {
            this.logger.error(`[UserService Error] Failed to retrieve user with email ${email} with error: ${e}`);
            throw new ClientErrorException("Failed to retrieve user");
        }
    }


}
