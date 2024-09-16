import {User} from "../database/models/User";
import {FindOptions} from 'sequelize';
import {IUserRepository} from "./interfaces/user.repository.interface";
import {BaseRepository} from "./base.repository";



export class UserRepository extends BaseRepository<User> implements IUserRepository{

    constructor() {
        super(User);
    }

    async getByEmail(email: string): Promise<User | null> {
        try {
            const options: FindOptions = {where: { email }};
            return await User.findOne(options) ;
        } catch (error) {
            throw error
        }
    }

    async getByDisplayName(displayName: string): Promise<User | null> {
        try {
            const options: FindOptions = {where: { display_name:displayName }};
            return  await User.findOne(options);
        } catch (error) {
            throw error
        }
    }

}


