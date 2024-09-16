import { User } from '../database/models/User';
import {IBaseRepository} from "./base.repository.interface";

export interface IUserRepository extends IBaseRepository<User>{
    getByEmail(email: string): Promise<User | null>;
    getByDisplayName(displayName: string): Promise<User | null>;
}
