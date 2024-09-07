import {AdminRepository} from "../repositories/admin.repository";
import {WinstonLogger} from "../utils/logger/wintson.logger";
import {ILogger} from "../utils/logger/logger.interface";
import {ClientErrorException} from "../exceptions/client.error.exception";
import {IUser} from "../interfaces/user/user.interface";
import UserDto from "../dtos/user/user.dto";


/**
 * Admin Service: contains all logic that's related to admin model
 */
export class AdminService {
    private readonly adminRepository: AdminRepository;
    private readonly logger: ILogger;


    constructor(
        adminRepository: AdminRepository,
        logger: WinstonLogger,
    ) {
        this.adminRepository = adminRepository;
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
            const user = await this.adminRepository.getByEmail(email)
            return UserDto.make(user)
        } catch (e) {
            this.logger.error(`[AdminService] Failed to retrieve admin with email ${email} with error: ${e}`);
            throw new ClientErrorException("Failed to retrieve admin");
        }
    }


}
