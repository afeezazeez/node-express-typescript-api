import { Worker } from 'bullmq';
import configService from '../../utils/config/config.service';
import {JobHandler} from "./job.handler";
import { Jobs } from '../../enums/jobs.types';
import { EmailService } from '../email/email.service';
import {WinstonLogger} from "../logger/wintson.logger";
const emailService = new EmailService( new WinstonLogger('Worker'));
const logger = new WinstonLogger('Worker');
import {jobQueue} from "../../config/queue/queue.config";
import {SendMailArgs} from "../../interfaces/email/send.email";


const jobHandler = new JobHandler(emailService);
const jobStartTimes = new Map<string, number>();
const formattedDate = new Date().toISOString().replace('T', ' ').slice(0, 19);

const worker = new Worker('jobQueue', async job => {

    jobStartTimes.set(job.id!, Date.now());

    console.log(`[${formattedDate}] Job ${job.name} ................... RUNNING`);

    logger.message(`[${formattedDate}] Job ${job.name} ................... RUNNING`);

    const jobName = job.name as keyof JobHandler;

    if (typeof jobHandler[jobName] === 'function') {
        await jobHandler[jobName](job.data);
    } else {
        console.error(`[Queue-Worker] No job handler method found for job: ${job.name}`);
        logger.error(`[Queue-Worker] No handler method found for job: ${job.name}`);

    }
}, {
    connection: { host: configService.get('REDIS_HOST'), port: configService.get('REDIS_PORT') },
    limiter: {
        max: 5, // Maximum 5 jobs processed in parallel
        duration: 1000, // In 1 second
    }
});

worker.on('completed', job => {

    const durationStr = getDurationString(job)
    console.log(`[${formattedDate}] Job ${job.name} ................... ${durationStr} DONE`);
    logger.message(`[${formattedDate}] Job ${job.name} ................... ${durationStr} DONE`);
});

worker.on('failed', async (job, err) => {

    const durationStr = getDurationString(job, true);

    console.log(`[${formattedDate}] Job ${job?.name} ................... ${durationStr} FAIL`);

    logger.error(`[Queue-Worker]Job  ${job?.name} failed with error ${err.message}`);

    logger.message(`[${formattedDate}] Job ${job?.name} ................... ${durationStr} FAIL`);

    if (job && (job.attemptsMade === job.opts.attempts)) {
        console.log(`[${formattedDate}] Job ${job?.name} has exhausted all retries.`);
        logger.message(`[${formattedDate}] Job ${job?.name} has exhausted all retries.`);

        const emailData: SendMailArgs = {
            to: configService.get('APP_ENGINEERING_EMAIL') || 'engineering@chllingdev.com',
            subject: 'New failed job after max tries',
            view: 'emails/failed_job.ejs',
            data: { name: job?.name, id: job?.id }
        };

        // Save job to db

        // Add the email notification to the queue, with retry settings
        await jobQueue.add(Jobs.SEND_FAILED_JOB_EMAIL, emailData, {
            attempts: 3,
            backoff: {
                type: 'fixed',
                delay: 9000, // Retry after 9 seconds
            }
        });
    }
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