import {JobHandler} from "./job.handler";
import {EmailService} from "../email/email.service";
import { jobQueue } from "../../config/queue/queue.config";
import configService from "../../utils/config/config.service";
import {WinstonLogger} from "../logger/wintson.logger";
import {ILogger} from "../logger/logger.interface";

export class JobService {
    private readonly jobHandler: JobHandler;
    private readonly queueType: string;
    private readonly logger: WinstonLogger;


    constructor() {
        this.logger = new WinstonLogger("Job Service");
        const emailService = new EmailService(this.logger);
        this.jobHandler = new JobHandler(emailService);
        this.queueType = configService.get('QUEUE_CONNECTION') || 'sync';
    }

    public async dispatch(job: string, data: any): Promise<void> {

        const jobName = job as keyof JobHandler;

        if (typeof this.jobHandler[jobName] === 'function') {

            if (this.queueType === 'sync') {
                await this.jobHandler[jobName](data);
            } else if (this.queueType === 'bull') {
                await jobQueue.add(jobName, data, {
                    attempts: 3,
                    backoff: {
                        type: 'fixed',
                        delay: 9000,
                    }
                });
            }
        } else {
            console.error(`[JobService] No job handler method found for job: ${jobName}`);
            this.logger.error(`[JobService] No handler method found for job: ${jobName}`);
        }
    }

    public async dispatchSync(job: string, data: any): Promise<void> {
        const jobName = job as keyof JobHandler;

        if (typeof this.jobHandler[jobName] === 'function') {
            try {
                await this.jobHandler[jobName](data);
            } catch (error) {
                console.error(`[JobService] Error executing job ${jobName} synchronously: ${error}`);
                this.logger.error(`[JobService] Error executing job ${jobName} synchronously: ${error}`);
            }
        } else {
            console.error(`[JobService] No job handler method found for job: ${jobName}`);
            this.logger.error(`[JobService] No handler method found for job: ${jobName}`);
        }
    }

}
