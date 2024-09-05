import nodemailer, { Transporter,SendMailOptions } from 'nodemailer';
import configService from "../config/config.service";
import { IEmailService } from "./email.service.interface";
import * as path from 'path';
import { ILogger } from "../logger/logger.interface";
import { WinstonLogger } from "../logger/wintson.logger";
import ejs from 'ejs';
import {SendMailArgs} from "../../interfaces/email/send.email";

export class EmailService implements IEmailService {
    private transporter: Transporter;
    private readonly logger: ILogger;

    constructor(
        logger: WinstonLogger,
    ) {
        this.transporter = nodemailer.createTransport({
            host: configService.get('MAIL_HOST'),
            port: configService.get('MAIL_PORT'),
            auth: {
                user: configService.get('MAIL_USERNAME'),
                pass:configService.get('MAIL_PASSWORD'),
            },
        });
        this.logger = logger;
    }

    /**
     * Sends an email with the specified parameters.
     * @returns {Promise<void>}
     * @param mailArgs
     */
    async sendMail(mailArgs:SendMailArgs): Promise<void> {

        const { to, subject, view, data } = mailArgs;

        // Render the email content first
        const emailContent = await ejs.renderFile(
            path.resolve(__dirname, '../../../views', view),
            {...data,app_name:configService.get('APP_NAME')}
        );

        // Render the layout with the email content
        const emailBody = await ejs.renderFile(
            path.resolve(__dirname, '../../../views/layout/main.ejs'),
            { ...data, body: emailContent }
        );

        const mailOptions: SendMailOptions = {
            from: configService.get('MAIL_FROM_ADDRESS'),
            to,
            subject,
            text: emailBody as string,
            html: emailBody as string,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            this.logger.error(`[EmailService] Sending email failed with error: ${error}`);
            throw error;
        }
    }

}
