import {IsEmail, IsNotEmpty} from 'class-validator';

export class LoginRequestDto {

    @IsEmail({}, { message: 'Invalid email address.' })
    @IsNotEmpty({ message: 'Email is required.' })
    email!: string;

    @IsNotEmpty({ message: 'Password is required.' })
    password!: string;
}


// Log file for queue worker on production and local