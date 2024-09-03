export class LoginResponseDto {
    token: string;
    display_name: string;

    constructor(token: string, display_name: string) {
        this.token = token;
        this.display_name = display_name;
    }
}
