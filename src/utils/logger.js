import winston from 'winston'
import __dirname from '../__dirname.js';
const { combine, timestamp, json } = winston.format
const LEVEL = Symbol.for('level')
let logger

const filterOnly = (level) => {
    return winston.format(info => {
        if (info[LEVEL] === level) {
        return info
        }
    })()
}

const loggerHandler = () => {
    if (logger) {
        return logger
    } else {
        logger = winston.createLogger({
        format: combine(
            timestamp(),
            json()
        ),
        transports: [
            new winston.transports.Console({ level: 'info' }),
            new winston.transports.File({ filename: `${__dirname}/logs/info.log`, format: filterOnly('info') }),
            new winston.transports.File({ filename: `${__dirname}/logs/warn.log`, format: filterOnly('warn') }),
            new winston.transports.File({ filename: `${__dirname}/logs/error.log`, format: filterOnly('error') })
        ]
    })
    return logger
    }
}

export default loggerHandler