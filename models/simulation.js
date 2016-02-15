var mongoose = require('mongoose');
var simulationSchema = mongoose.Schema({
  bodies: [
    {
      position: {x: Number, y: Number},
      velocity: {x: Number, y: Number},
      mass: Number,
      density: Number,
      radius: Number,
      luminosity: Number
    }
  ]
});

exports.name = 'simulation';
exports.Schema = mongoose.model('Simulation', simulationSchema);
