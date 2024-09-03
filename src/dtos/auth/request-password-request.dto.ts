import { IsDefined,IsEmail } from 'class-validator';

export class RequestPasswordLinkDto {
    @IsDefined({ message: 'Email is required.' })
    @IsEmail({}, { message: 'Invalid email address.' })
    email!: string;
}
