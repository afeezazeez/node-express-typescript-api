import {SendMailArgs} from "../../interfaces/email/send.email";
/**
 * @interface IEmailService
 */
export interface IEmailService {
    sendMail(args: SendMailArgs): Promise<void>;
}