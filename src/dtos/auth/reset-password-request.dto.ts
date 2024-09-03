import {
    IsNotEmpty,
    MinLength,
    MaxLength,

} from 'class-validator';


export class ResetPasswordRequestDto {
    @IsNotEmpty({ message: 'Token is required.' })
    token!: string;

    @IsNotEmpty({ message: 'Old password is required.' })
    old_password!: string;


    @MinLength(6, { message: 'New password must be at least 6 characters long.' })
    @MaxLength(12, { message: 'New password must not exceed 12 characters.' })
    @IsNotEmpty({ message: 'New password is required.' })
    new_password!: string;

    @IsNotEmpty({ message: 'Confirm new password is required.' })
    confirm_new_password!: string;
}