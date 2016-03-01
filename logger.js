var winston = require('winston');


var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)()
    ]
});

logger.handleExceptions();

logger.info(Date() + ': log service start');

