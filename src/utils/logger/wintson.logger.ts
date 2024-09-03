import { transports, Logger, createLogger, LoggerOptions, format } from 'winston';
const { combine, timestamp, label, prettyPrint } = format;
import configService from "../config/config.service";
import {ILogger} from "./logger.interface";
import * as fs from 'fs';


export class WinstonLogger  implements ILogger{
    private readonly logConfig: LoggerOptions;
    public logger: Logger;

    constructor(scope: string) {
        const filePath= configService.get<string>('LOG_FILE_PATH') ;
        this.logConfig = {
            transports: [
                new transports.Console(),
                new transports.File({
                    filename: filePath,
                }),
            ],
            format: combine(label({ label: scope }), timestamp(), prettyPrint()),
        };
        this.logger = createLogger(this.logConfig);
    }

    debug(message: string, meta?: object): void {
        this.logger.debug(message, meta);
    }

    error(message: string, meta?: object): void {
        this.logger.error(message, meta);
    }

    info(message: string, meta?: object): void {
        this.logger.info(message, meta);
    }

    warn(message: string, meta?: object): void {
        this.logger.warn(message, meta);
    }

    message(message: string): void {

        const logFilePath = configService.get('WORKER_LOG_FILE_PATH');

        if (!logFilePath) {
            return;
        }

        try {
            const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
            logStream.write(message + '\n');
            logStream.end();
        } catch (error) {
            console.error('Error writing to log file:', error);
        }
    }
}

// Export a logger instance with a specific scope
const LoggerInstance = new WinstonLogger('App');
export default LoggerInstance;
