// processors/emailProcessor.ts
import { Worker } from 'bullmq';
import configService from '../../utils/config/config.service';
import { JobHandlers } from './jobs.handler';
import { Jobs } from '../../enums/jobs.types';
import { EmailService } from '../email/email.service';
import {WinstonLogger} from "../logger/wintson.logger";
const emailService = new EmailService( new WinstonLogger('Worker'));
const jobHandlers = new JobHandlers(emailService);
const logger = new WinstonLogger('Worker');


const jobStartTimes = new Map<string, number>();
const formattedDate = new Date().toISOString().replace('T', ' ').slice(0, 19);

const worker = new Worker('jobQueue', async job => {
    jobStartTimes.set(job.id!, Date.now());
    console.log(`[${formattedDate}] Job ${job.name} ................... RUNNING`);
    logger.message(`[${formattedDate}] Job ${job.name} ................... RUNNING`);
    switch (job.name) {
        case Jobs.SEND_VERIFICATION_EMAIL:
        case Jobs.SEND_PASSWORD_RESET_EMAIL:
            await jobHandlers.sendEmail(job.data);
            break;
    }
}, {
    connection: { host: configService.get('REDIS_HOST'), port: configService.get('REDIS_PORT') },
});

worker.on('completed', job => {

    const durationStr = getDurationString(job)
    console.log(`[${formattedDate}] Job ${job.name} ................... ${durationStr} DONE`);
    logger.message(`[${formattedDate}] Job ${job.name} ................... ${durationStr} DONE`);
});

worker.on('failed', (job, err) => {
    const durationStr = getDurationString(job,true)
    console.log(`[${formattedDate}] Job ${job?.name} ................... ${durationStr} FAIL`);
    logger.error(`[Queue-Worker]Job  ${job?.name} failed with error ${err.message}`)
    logger.message(`[${formattedDate}] Job ${job?.name} ................... ${durationStr} FAIL`);
});


function getDurationString(job:any,clear = false):string{
    const startTime = jobStartTimes.get(job.id!);
    const endTime = Date.now();
    const durationMs = endTime - (startTime || endTime);

    // Convert duration to milliseconds, seconds, and minutes
    const durationMsStr = `${durationMs}ms`;
    const durationSec = Math.round(durationMs / 1000);
    const durationSecStr = `${durationSec}s`;
    const durationMin = Math.round(durationSec / 60);
    const durationMinStr = `${durationMin}m`;

    let durationStr: string;
    if (durationMs < 1000) {
        durationStr = durationMsStr;
    } else if (durationSec < 60) {
        durationStr = durationSecStr;
    } else {
        durationStr = durationMinStr;
    }
    jobStartTimes.delete(job.id!);
    return durationStr;
}