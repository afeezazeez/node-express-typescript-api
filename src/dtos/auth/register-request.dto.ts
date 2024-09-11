import {IsEmail, IsNotEmpty, MaxLength, MinLength} from 'class-validator';

export class RegisterRequestDto {
    @IsNotEmpty({ message: 'Display name is required.' })
    displayName!: string;

    @IsNotEmpty({ message: 'Email is required.' })
    @IsEmail({}, { message: 'Invalid email address.' })
    email!: string;

    @MinLength(6, { message: 'Password must be at least 6 characters long.' })
    @MaxLength(12, { message: 'Password must not exceed 12 characters.' })
    @IsNotEmpty({ message: 'Password is required.' })
    password!: string;
}
