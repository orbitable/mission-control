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

var util = require('util');

exports.install = function () {
  logger.debug("Installing session restful route");
  F.restful('/sessions', ['post', 'json'], not_allowed, not_allowed, session_save, session_delete);
};

function not_allowed() {
  logger.debug("Calling on un-implemeneted method");
  var self = this;
  self.status = 405;
  return self.plain('');
}

function session_delete(id) {
  logger.debug("Delete method not implemented. Throwing error");
  var self = this;
  return self.throw501();
}

function session_save(id) {
  var self = this;
  logger.debug("Attempting to create new session");
  //TODO: Add checks to credentials and throw error if checks invalid
  //return mock token if valid.

  //Populate schema with mock credentials first
  var Credential = MODEL('credential').schema;

  //compare credentials from body to mock credentials
  Credential.findOne({"username": self.body.username}, function(err, doc) {

    if (err) {
      logger.error("Encountered error finding username ", err);
      return self.throw400();
    }

    if (!doc) {
      logger.debug("Did not find matching username " + self.body.username);
      return self.throw403();
    }

    if (doc.password == self.body.password) {
      var token = {tokenID : "13yasdd2245u67l"};
      return self.json(token);
    } else {
      logger.debug("Invalid credentials");
      return self.throw403();
    }
  });
}
