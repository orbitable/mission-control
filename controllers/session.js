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
  F.restful('/sessions', [], session_query, session_get, session_save, session_delete);
};

function session_query() {
  logger.debug("Query sessions");

  var self = this;
  
    
  //Add query later on. I think a session model must be implemented first?
}

function session_delete(id) {
  logger.debug("Removing session " + id);

  var self = this;
  
    if (id) {
        logger.debug("Throwing error");
        return self.throw501();
    } else {
        logger.debug("Delete Called without specifying id, doing nothing...");
    }
}

function session_get(id) {
  logger.debug("getting session " + id);

  var self = this;
  //Add get functionality
}


function session_save(id) {
  var self = this;
    logger.debug("Entering Post");
  if (id) {

    logger.debug("Updating a session with id %s", id);
    //Add post information. STILL CONFUSED HOW TO SEND DATA WITHOUT IT! 

  } else {
    // TODO: Implement request data validation
    var updates = {
      _id: '1234567890abcdef',
      token: 'aoiu4nb728ba2f',
      timestamp: new Date() / 1000
    };

    logger.debug("Saving new session", updates);
    self.json(updates);
  }
}

