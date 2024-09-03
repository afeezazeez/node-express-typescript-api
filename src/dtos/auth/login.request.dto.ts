import {IsEmail, IsNotEmpty} from 'class-validator';

export class LoginRequestDto {


    @IsNotEmpty({ message: 'Email is required.' })
    @IsEmail({}, { message: 'Invalid email address.' })
    email!: string;

    @IsNotEmpty({ message: 'Password is required.' })
    password!: string;
}


// Log file for queue worker on production and local