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
  logger.debug("Installing simulations restful route");

  F.route('/simulations/random', simulation_random, ['#cors']);
  F.restful('/simulations', ['#cors'], simulation_query, simulation_get, simulation_save, simulation_delete);
};

function simulation_delete(id) {
  logger.debug("Removing simulation " + id);

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

function simulation_get(id) {
  logger.debug("Getting simulation " + id);

  var self = this;
  var Simulation = MODEL('simulation').schema;

  Simulation.findById(id, function(err, doc) {

    if (err) {
      logger.error("Encountered error finding simulation " + id + ":" + err);
      self.throw400();
      return;
    }

    if (!doc) {
      self.throw404();
      return;
    }

    self.json(doc);
    return;
  });
}

function simulation_query() {
  logger.debug("Getting simulations");

  var self = this;
  var Simulation = MODEL('simulation').schema;

  Simulation.find(function(err, docs) {
    self.json(docs);
  });
}

function bigNum(b,e) {
  return b * Math.pow(10,e);
}

function simulation_random() {
  logger.debug("Randomingly generating simulation");

  var self         = this;
  var centerMass   = self.query.centerMass   || bigNum(1.988435,30);
  var centerRadius = self.query.centerRadius || bigNum(6.955,8);
  var count        = self.query.count        || 50;
  var ringStep     = self.query.ringStep     || bigNum(0.3,11);
  var bodyMass     = self.query.bodyMass     || bigNum(5.9721986,24);
  var bodyRadius   = self.query.bodyRadius   || bigNum(6.3674447,6);
  var chaos        = self.query.chaos        || 0.1;

  var Simulation = MODEL('simulation').schema;

  self.json(Simulation.randomSystem(centerMass,centerRadius,bodyCount,ringStep,bodyMass,bodyRadius,chaos));
}

function simulation_save(id) {
  var self = this;
  var Simulation = MODEL('simulation').schema;

  if (id) {
    var updates = self.json;
    logger.debug("Updating a simulation with id %s", id);

    Simulation.findByIdAndUpdate(id, { $set: updates }, function(err, doc) {
      if (err) {
        logger.error("Unable to update simulation: %s", id, update);
      }

      self.json(doc);
    });
  } else {

    logger.debug("Saving simulation id " + id);

    Simulation.create(self.body, function(err, doc) {

      if (err) {
        logger.error("Unable to create simulation: " + err);
        self.throw400(err);
        return;
      }

      self.json(doc);
    });
  }
}
