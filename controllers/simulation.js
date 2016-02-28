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
  F.route('/simulations/random', simulation_random, ['#cors']);
  F.restful('/simulations', ['#cors'], simulation_query, simulation_get, simulation_save, simulation_delete);
};

function simulation_delete(id) {
  var self = this;
  var Simulation = MODEL('simulation').schema;

  Simulation.findById(id).then(function(doc) {
    if (doc) {
      doc.remove();
      return;
    }

    self.throw404();
  });
}

function simulation_get(id) {
  var self = this;
  var Simulation = MODEL('simulation').schema;

  Simulation.findById(id, function(err, doc) {

    if (err) {
      self.throw400();
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
  var self = this;
  var Simulation = MODEL('simulation').schema;

  Simulation.find(function(err, docs) {
    self.json(docs);
  });
}

function simulation_random() {
  var self       = this;
  var count      = self.query.count     || 100;
  var mass       = self.query.maxMass   || 100;
  var radius     = self.query.maxRadius || 25;
  var spread     = self.query.spread    || 1000;
  var Simulation = MODEL('simulation').schema;

  self.json(Simulation.random(count, mass, radius, spread));
}

function simulation_save(id) {
  var self = this;
  var Simulation = MODEL('simulation').schema;

    if (id) {
      // TODO: Implement record updating
      self.throw501();
    }

    Simulation.create(self.body, function(err, doc) {

     if (err) {
       self.throw400(err);
     }

     self.json(doc);
    });
}
