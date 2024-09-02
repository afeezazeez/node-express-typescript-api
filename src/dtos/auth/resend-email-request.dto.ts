import { IsDefined,IsEmail } from 'class-validator';

export class ResendEmailRequestDto {
    @IsDefined({ message: 'Email is required.' })
    @IsEmail({}, { message: 'Invalid email address.' })
    email!: string;
}
