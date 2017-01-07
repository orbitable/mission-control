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

var _ = require('lodash');

/*
 * Validates origin headers on requests and updates response.
 *
 * The cors middlewhere inspects the origin of all requests and compares
 * them to a white list of comma seperated hosts. If a match is found the
 * response includes an updated 'Access-Control-Allowed-Origin' header with
 * the origin.
 */
F.middleware('cors', function(req, res, next, options, controller) {
  console.log('middleware:','cors');
  if (controller) {
    // Parse the cors field of the current config
    var allowedOrigins = (F.config.cors || '').split(',');
    allowedOrigins.push('0.0.0.0');
    allowedOrigins.push('ec2-54-164-149-18.compute-1.amazonaws.com');

    // Validate request origin agains cors whitelist
    var isOrigin = (uri) => uri === req.headers.origin;
    controller.cors(_.find(allowedOrigins, isOrigin) || 'origin');
  }

  next();
});
