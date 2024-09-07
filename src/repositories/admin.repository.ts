import {Admin} from "../database/models/Admin";
import {FindOptions} from 'sequelize';
import {IAdminRepository} from "./interfaces/admin.repository.interface";



export class AdminRepository implements IAdminRepository{

    async create(user:any): Promise<Admin> {
        try {
            return await Admin.create(user);
        } catch (error) {
            throw error
        }
    }

    async update(userData:any, id: string): Promise<[affectedCount: number]> {
        try {
            return await Admin.update(userData, {where: {id}})

        } catch (error) {
            throw  error
        }
    }

    async getById(id: string): Promise<Admin | null> {
        try {
            const options: FindOptions = {where: { id:id}};
            return  await Admin.findOne(options);
        } catch (error) {
            throw error
        }
    }

    async getByEmail(email: string): Promise<Admin | null> {
        try {
            const options: FindOptions = {where: { email }};
            return await Admin.findOne(options) ;
        } catch (error) {
            throw error
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await Admin.destroy({where: {id: id,}});
        } catch (error) {
            throw error
        }
    }
}
