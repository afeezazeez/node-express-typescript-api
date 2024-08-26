import { IsDefined, IsEmail, IsString } from 'class-validator';

export class RegisterRequestDto {
    @IsDefined({ message: 'Display name is required.' })
    @IsString({ message: 'Display name must be a string.' })
    displayName!: string;

    @IsDefined({ message: 'Email is required.' })
    @IsEmail({}, { message: 'Invalid email address.' })
    email!: string;

    @IsDefined({ message: 'Password is required.' })
    @IsString({ message: 'Password must be a string.' })
    password!: string;
}
