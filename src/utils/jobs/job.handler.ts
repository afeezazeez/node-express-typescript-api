import {EmailService} from "../email/email.service";
import {IEmailService} from "../email/email.service.interface";
import {SendMailArgs} from "../../interfaces/email/send.email";


export class JobHandler {
    private readonly emailService:IEmailService;

    constructor(emailService:EmailService) {
        this.emailService = emailService
    }

    public async sendEmail(data: SendMailArgs): Promise<void> {
        await this.emailService.sendMail(data);
    }
    public async handlePasswordResetEmail(data: SendMailArgs): Promise<void> {
        await this.emailService.sendMail(data);
    }


}
