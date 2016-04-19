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

exports.install = function() {
  
  logger.debug('Installing simulations restful route');

  F.route('/simulations/random', randomSimulation, ['#cors']);
  F.route('/users/{userId}/simulations', querySimulation, ['#cors']);

  // Accept OPTIONS requests
  F.route('/simulations',
    function() { this.plain('okay');},
    ['#cors', 'OPTIONS']);
  F.route('/simulations/{userId}',
    function() { this.plain('okay');},
    ['#cors', 'OPTIONS']);

  F.restful('/simulations',
    ['#cors'],
    querySimulation,
    getSimulation,
    saveSimulation,
    deleteSimulation);

};

function deleteSimulation(id) {
  logger.debug('Removing simulation ' + id);

  var self = this;
  var Simulation = MODEL('simulation').schema;

  Simulation.findById(id).then(function(doc) {
    if (doc) {
      doc.remove();
      return;
    }

    return self.throw404();
  });

  return self.throw404();
}

function getSimulation(id) {
  logger.debug('Getting simulation ' + id);

  var self = this;
  var Simulation = MODEL('simulation').schema;

  Simulation.findById(id, function(err, doc) {

    if (err) {
      return clientError(self, 400, err,  'Encountered error finding simulation ' + id + ':' + err);
    }

    if (!doc) {
      return clientError(self, 404, 'The given simulation does not exist', 'The given id did not match an existing document');
    }

    self.json(doc);
    return;
  });
}

function querySimulation(userId) {

  var self = this;
  var Simulation = MODEL('simulation').schema;

  if (userId) {
    logger.debug('Getting simulations for user id ' + userId);
    var User = MODEL('user').schema;

    User.find({$or: [{username: userId}]}, function(err, user) {
      if (err) {
        logger.error(err); return self.throw500(err);
      }

      if (!user) { return self.throw404(user); }

      Simulation.find({createdBy: user._id}, function(err, simulations) {
        if (err) {
          logger.error(err); return self.throw500(err);
        }

        return self.json(simulations);
      });

    });
  } else {
    logger.debug('Getting simulations');
    Simulation.find(function(err, simulations) {
      if (err) {
        logger.error(err); return self.throw500(err);
      }

      self.json(simulations);
    });
  }
}

function randomSimulation() {
  logger.debug('Randomingly generating simulation');

  var self         = this;

  // Query parameters are mapped to simulation generation || <default value>
  var centerMass   = parseFloat(self.query.centerMass)    || 1.988435e30;
  var centerRadius = parseFloat(self.query.centerRadius)  || 6.955e8;
  var count        = parseInt(self.query.count)           || 50;
  var ringStep     = parseFloat(self.query.ringStep)      || 0.3e11;
  var bodyMass     = parseFloat(self.query.bodyMass)      || 5.9721986e24;
  var bodyRadius   = parseFloat(self.query.bodyRadius)    || 6.3674447e6;
  var chaos        = parseFloat(self.query.chaos)         || 0.5;

  var Simulation = MODEL('simulation').schema;

  self.json(Simulation.randomSystem(
    centerMass,
    centerRadius,
    count,
    ringStep,
    bodyMass,
    bodyRadius,
    chaos)
  );
}

function saveSimulation(id) {
  var self = this;
  var Simulation = MODEL('simulation').schema;

  logger.debug('saving simulation');

  if (id) {
    var updates = self.json;
    logger.debug('Updating a simulation with id %s', id);

    Simulation.findByIdAndUpdate(id, {$set: updates}, function(err, doc) {
      if (err) {

        logger.error('Unable to update simulation: %s', id, update);

      }

      self.json(doc);
    });
  } else {
    logger.debug('Saving new simulation');

    Simulation.create(self.body, function(err, doc) {

      if (err) {

        logger.error('Unable to create simulation: ' + err);

        self.throw400(err);
        return;
      }

      self.json(doc);
    });
  }
}
