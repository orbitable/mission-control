function clientError(self, statusCode, reason, description) {
  logger.debug(statusCode, reason);

  self.statusCode = statusCode;
  self.json({code: statusCode, reason: reason, description: description});
}


global.clientError = clientError;
