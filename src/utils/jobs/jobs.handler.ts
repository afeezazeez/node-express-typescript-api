import {EmailService} from "../../services/email/email.service";
import {IEmailService} from "../../services/email/email.service.interface";

export class JobHandlers {
    private readonly emailService:IEmailService;

    constructor(emailService:EmailService) {
        this.emailService = emailService
    }

    public async handleSendVerificationEmail(data: any): Promise<void> {
        await this.emailService.sendMail(data);
    }
}
