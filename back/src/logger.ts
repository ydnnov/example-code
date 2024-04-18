import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';
import { env } from './envconf.js';

export const logger = createLogger({
    transports: [
        new transports.DailyRotateFile({
            level:    env.LOG_LEVEL_FILE,
            dirname:  `${env.STORAGE_PATH}/logs`,
            filename: 'events-%DATE%.log',
            format:   format.combine(
                format.timestamp(),
                format.printf(({ level, message, timestamp }) => {
                    return `${timestamp} ${level.toUpperCase()}: ${message}`;
                }),
            ),
        }),
        new transports.DailyRotateFile({
            level:    'error',
            dirname:  `${env.STORAGE_PATH}/logs`,
            filename: 'errors-%DATE%.log',
            format:   format.combine(
                format.timestamp(),
                format.printf(({ level, message, timestamp }) => {
                    return `${timestamp} ${level.toUpperCase()}: ${message}`;
                }),
            ),
        }),
        new transports.Console({
            level:  env.LOG_LEVEL_CONSOLE,
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.printf(({ level, message, timestamp }) => {
                    return `${timestamp} ${level.toUpperCase()}: ${message}`;
                }),
                format.colorize({ all: true }),
            ),
        }),
    ],
});
