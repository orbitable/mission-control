var util = require('util');

exports.install = function() {
  F.restful('/simulations', ['#cors'], simulation_query, simulation_get, simulation_save, simulation_delete);
};

function simulation_query() {
  var self = this;
  var Simulation = MODEL('simulation').schema;

  Simulation.find(function(err, docs) {
    self.json(docs);
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
