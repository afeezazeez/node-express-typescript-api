import { IsDefined, IsEmail, IsString } from 'class-validator';

export class LoginRequestDto {


    @IsDefined({ message: 'Email is required.' })
    @IsEmail({}, { message: 'Invalid email address.' })
    email!: string;

    @IsDefined({ message: 'Password is required.' })
    @IsString({ message: 'Password must be a string.' })
    password!: string;
}


// Log file for queue worker on production and local