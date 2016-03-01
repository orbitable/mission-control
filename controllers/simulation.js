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

    self.throw404();
  });
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

function simulation_random() {
  logger.debug("Randomingly generating simulation");

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
    logger.warn("Updating a simulation is not implementend"); 
    self.throw501();
    return;
  }

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
