/* Copyright 2016 Orbitable Team Members
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License.  You may obtain a copy of the
 * License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations under the License.
 */
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
