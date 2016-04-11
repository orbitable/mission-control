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

exports.install = function () {
  logger.debug("Installing sessions endpoint");
  F.restful('/sessions', ['#cors', 'OPTIONS'], methodNotAllowed, methodNotAllowed, session_save, session_delete);
};

function methodNotAllowed() {
  logger.debug("users: method not allowed");
  this.status = 405;
  return this.plain('405: Method not supported');
}

function session_delete(id) {
  logger.debug("Attempting to invalidate a session");
  var self = this;
  var Session = MODEL('session').schema;

  Session.findById(id).then(function(session) {
    if (session) {
      logger.debug('Invalidated session', id);
      session.remove();
      return self.plain('');
    }

    return self.throw404();
  });

}

function session_save(id) {
  var self = this;

  // TODO: Allow preflights
  if (self.req.method === 'OPTIONS') {
    return self.plain('');
  }

  logger.debug("Attempting to create a new session");

  var User = MODEL('user').schema;
  var Session = MODEL('session').schema;

  User.findOne({ $or: [ {username: self.body.username}, {email: self.body.username}]} , function(err, user) {

    if (err) {
      logger.error("Encountered error finding username ", err);
      return self.throw400();
    }

    if (!user) {
      logger.debug('No such user ', self.body.username);
      return self.throw404();
    }

    user.isValidPassword(self.body.password, function(err, isValidPassword) {
      if (err) {
        logger.error("error comparing passwords", err);
        return self.throw400();
      }

      if (isValidPassword) {
        Session.create({owner: user._id}, function(err, session) {
            if (err) {
              logger.error('Failed to create session', err);
              return self.throw500();
            }

            if (session) {
              Session.populate(session, {path: 'owner'}, function(err, session) {
                if (err) {
                  logger.error('Failed to populate session', err);
                  return self.throw500();
                }

                return self.json(session);
              });
            }
          });
      } else { 
        logger.debug('Unsuccessful login attempt for', self.body.username);
        return self.throw404();
      }
    });
  });
}
