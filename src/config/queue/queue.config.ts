import { Queue } from 'bullmq';
import configService from "../../utils/config/config.service";

// Create a new Bull queue for handling email jobs


export const jobQueue = new Queue('jobQueue', { connection: {
        host:configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT')
}});