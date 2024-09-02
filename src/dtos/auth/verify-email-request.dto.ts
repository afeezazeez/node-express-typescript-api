import { IsDefined, IsString } from 'class-validator';

export class VerifyEmailRequestDto {
    @IsDefined({ message: 'Token is required.' })
    @IsString({ message: 'Token name must be a string.' })
    token!: string;
}
