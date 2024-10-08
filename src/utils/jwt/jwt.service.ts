import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import configService from "../config/config.service";



export class JwtService {

    private readonly secret;
    constructor() {
        this.secret =  configService.get('JWT_SECRET_KEY');
    }

    // Method to sign a payload and return a token
    public signPayload(payload: string | object | Buffer): string {
        const signOptions: SignOptions = { expiresIn: '1hr' };
        try {
            return jwt.sign(payload, this.secret, signOptions);
        } catch (error) {
            throw error;
        }
    }

    // Method to verify a token and return the decoded payload
    public verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.secret);
        } catch (error) {
            throw error;
        }
    }
}
