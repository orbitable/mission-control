var winston = require('winston');

// The log level can be set via the environment or configuration
var loglevel = process.env.LOG_LEVEL || F.config.loglevel;

var logger = new (winston.Logger)({
  transports: [
      new (winston.transports.Console)({level: loglevel, timestamp: true}),
  ],
});

logger.handleExceptions();

global.logger = logger;
