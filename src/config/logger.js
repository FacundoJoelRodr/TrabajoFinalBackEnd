
'instalar npm i winston ,poner en carpeta de config';
'instalar cluster and docker desktop';
'artillery fijarse';
' kubernetes y chocolate y minikube';
import winston from 'winston';
import config from '../config.js';

const customLevelsOptions = {
  levels: {
    debug: 5,
    http: 4,
    info: 3,
    warning: 2,
    error: 1,
    fatal: 0,
  },
  colors: {
    debug: 'white',
    http: 'green',
    info: 'blue',
    warning: 'magenta',
    error: 'yellow',
    fatal: 'red',
  },
};

const loggerProd = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: './errors.log', level: 'error' }),
  ],
});

const loggerDev = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

export const addLogger = (req, res, next) => {
  req.logger = config.ENV === 'prod' ? loggerProd : loggerDev;

  next();
};
