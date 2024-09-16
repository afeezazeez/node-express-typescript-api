import {Admin} from "../database/models/Admin";
import {FindOptions} from 'sequelize';
import {IAdminRepository} from "./interfaces/admin.repository.interface";
import {BaseRepository} from "./base.repository";



export class AdminRepository extends BaseRepository<Admin> implements IAdminRepository{

    constructor() {
        super(Admin);
    }


    async getByEmail(email: string): Promise<Admin | null> {
        try {
            const options: FindOptions = {where: { email }};
            return await Admin.findOne(options) ;
        } catch (error) {
            throw error
        }
    }

}
