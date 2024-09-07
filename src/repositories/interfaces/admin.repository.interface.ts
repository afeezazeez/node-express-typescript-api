import Admin from "../../database/models/Admin";
import {IRepository} from "./repositories.base.interface";

export interface IAdminRepository extends IRepository<User> {
    getByEmail(email: string): Promise<Admin | null>;
}
