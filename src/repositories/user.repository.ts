import {User} from "../database/models/User";
import {IUser} from "../interfaces/user/user.interface";
import {FindOptions} from 'sequelize';



export class UserRepository {

    async create(user:any): Promise<IUser> {
        try {
            const newUser = await User.create(user);
            return newUser as IUser
        } catch (error) {
            throw error
        }
    }

    async getById(id: number): Promise<IUser | null> {
        try {
            const options: FindOptions = {where: { id:id, deleted_at: null }};
            const user = await User.findOne(options);
            return user as IUser | null;
        } catch (error) {
            throw error
        }
    }

    async getByEmail(email: string): Promise<IUser | null> {
        try {
            const options: FindOptions = {where: { email:email, deleted_at: null }};
            const user = await User.findOne(options);
            return user as IUser | null;
        } catch (error) {
            throw error
        }
    }

    async getByDisplayName(displayName: string): Promise<IUser | null> {
        try {
            const options: FindOptions = {where: { display_name:displayName, deleted_at: null }};
            const user = await User.findOne(options);
            return user as IUser | null;
        } catch (error) {
            throw error
        }
    }

    async update(userData: IUser, id: number): Promise<[affectedCount: number]> {
        try {
            return await User.update(userData, {where: {id}})

        } catch (error) {
            throw  error
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await User.destroy({where: {id: id,}});
        } catch (error) {
            throw error
        }
    }

}


