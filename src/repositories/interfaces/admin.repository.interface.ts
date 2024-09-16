import Admin from "../../database/models/Admin";
import {IBaseRepository} from "./base.repository.interface";

export interface IAdminRepository extends IBaseRepository<Admin>{
    getByEmail(email: string): Promise<Admin | null>;
}
