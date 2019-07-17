import { createLogger, format, transports } from 'winston';
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: `${logDir}/%DATE%-results.log`,
    format: format.combine(
        format.printf(
            info =>
                `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
        )
    ),
    datePattern: 'YYYY-MM-DD'
});

export default createLogger({
    // change level if in dev environment versus production
    level: env === 'production' ? 'info' : 'debug',
    format: format.combine(
        format.label({ label: path.basename(process.mainModule.filename) }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(
                    info =>
                        `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
                )
            )
        }),
        dailyRotateFileTransport,
    ]
});