import {User} from "../database/models/User";
import {FindOptions} from 'sequelize';
import {IUser} from "../interfaces/user/user.interface";


export class UserRepository {

    async create(user:any): Promise<User> {
        try {
            return await User.create(user);
        } catch (error) {
            throw error
        }
    }

    async getById(id: string): Promise<User | null> {
        try {
            const options: FindOptions = {where: { id:id}};
           return  await User.findOne(options);
        } catch (error) {
            throw error
        }
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

    async update(userData:any, id: string): Promise<[affectedCount: number]> {
        try {
            return await User.update(userData, {where: {id}})

        } catch (error) {
            throw  error
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await User.destroy({where: {id: id,}});
        } catch (error) {
            throw error
        }
    }

}


