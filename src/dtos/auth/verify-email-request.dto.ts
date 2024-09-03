import { IsNotEmpty, IsString} from 'class-validator';

export class VerifyEmailRequestDto {
    @IsNotEmpty({ message: 'Token is required.' })
    @IsString({ message: 'Token name must be a string.' })
    token!: string;
}
