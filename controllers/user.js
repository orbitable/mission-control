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

exports.install = function() {
  logger.debug("Installing users restful route");
  F.restful('/users', ['#cors', 'OPTIONS'], methodNotAllowed, methodNotAllowed, user_save, methodNotAllowed); 
};

function methodNotAllowed() {
  logger.debug("users: method not allowed");
  this.status = 405;
  return this.plain('405: Method not supported');
}

function user_save(id) {
  var self = this;
  var User = MODEL('user').schema;

  if (id) {
    // TODO: Implement user updates
    return self.throw501();
  } else {
    logger.debug("users: creating new user");

    // TODO: Deal with PREFLIGHT
    if (self.req.method === 'OPTIONS') {
      self.plain('');
      return;
    }

    User.create(self.body, function(err, doc) {

      if (err) {
        logger.error("users: unable to create new user: " + err);
        // TODO: Do not return mongo err directly. Parse and identify reason for
        // validation failure
        self.throw400(err.message);
        return;
      }

      self.json(doc);
    });
  }
}
