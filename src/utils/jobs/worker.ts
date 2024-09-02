// processors/emailProcessor.ts
import { Worker } from 'bullmq';
import configService from '../../utils/config/config.service';
import { JobHandlers } from './jobs.handler';
import { JobTypes } from '../../enums/jobs.types';
import { EmailService } from '../../services/email/email.service';
import {WinstonLogger} from "../logger/wintson.logger";
const emailService = new EmailService( new WinstonLogger('Worker'));
const jobHandlers = new JobHandlers(emailService);
const logger = new WinstonLogger('Worker');
// Create a BullMQ worker to process jobs

const worker = new Worker('jobQueue', async job => {
    console.log(`Running job: ${job.name}`)
    switch (job.name) {
        case JobTypes.SEND_VERIFICATION_EMAIL:
            await jobHandlers.handleSendVerificationEmail(job.data);
            break;
    }
}, {
    connection: { host: configService.get('REDIS_HOST'), port: configService.get('REDIS_PORT') },
});

worker.on('completed', job => {
    console.log(`Completed job: ${job.name}`);
});

worker.on('failed', (job, err) => {
    logger.error(`[Queue-Worker]Job  ${job?.name} failed with error ${err.message}`)
});
