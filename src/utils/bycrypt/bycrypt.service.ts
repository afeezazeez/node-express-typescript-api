import bcrypt from 'bcrypt';
import {ClientErrorException} from "../../exceptions/client.error.exception";

export class BcryptService {
    private readonly saltRounds: number;

    constructor(saltRounds: number = 10) {
        this.saltRounds = saltRounds;
    }

    // Hash a plain text password
    public async make(password: string): Promise<string> {
        try {
            return await bcrypt.hash(password, this.saltRounds);
        } catch (error) {
            throw new ClientErrorException('[BcryptService] Error hashing password');
        }
    }

    // Check if the plain text password matches the hashed password
    public async check(password: string, hashedPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            console.log(error)
            throw new ClientErrorException('[BcryptService] Error checking password');
        }
    }
}


