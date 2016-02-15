exports.install = function() {
  F.restful('/simulations', [], simulation_query, simulation_get, simulation_save, simulation_delete);
};

function simulation_query() {
  var self = this;
  var Simulation = MODEL('simulation').Schema;

  Simulation.find(function(err, docs) {
    self.json(docs);
  });
}

function simulation_get(id) {
  var self = this;
  var Simulation = MODEL('simulation').Schema;

  Simulation.findById(id, function(err, doc) {
    self.json(doc);
  });
}

function simulation_save(id) {
  var self = this;
  var Simulation = MODEL('simulation').Schema;

  Simulation.create({});
  self.json({status: 'success'});
}

function simulation_delete(id) {
  var self = this;
  var Simulation = MODEL('simulation').Schema;

  Simulation.findById(id).then((doc) => doc.remove());
  self.json({status: 'success'});
}
