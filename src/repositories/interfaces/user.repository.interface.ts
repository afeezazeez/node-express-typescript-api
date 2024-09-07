import { User } from '../database/models/User';
import {IRepository} from "./repositories.base.interface";

export interface IUserRepository extends IRepository<User> {
    getByEmail(email: string): Promise<User | null>;
    getByDisplayName(displayName: string): Promise<User | null>;
}
