var _        = require('lodash');
var mongoose = require('mongoose');

var Vector = new mongoose.Schema({x: {type: Number, default: 0}, y: {type: Number, default: 0}});

Vector.statics.random = function(spread) {
  spread = spread || 1000;
  var range = _.range(spread / -2, spread / 2);

  return new this({x: _.sample(range), y: _.sample(range)});
}

var Body = mongoose.Schema({
        position: {type: Vector, required: true},
        velocity: {type: Vector, default: {x: 0, y: 0}},
        mass: {type: Number, required: true},
        density: {type: Number, default: 0},
        radius: {type: Number, default: 0},
        luminosity: {type: Number, default: 0}});

Body.statics.random = function(mass, radius, spread) {
  var vector = mongoose.model('Vector', Vector);
  return new this({
    position: vector.random(spread),
    mass: _.sample(_.range(1, mass || 100)),
    radius: _.sample(_.range(1, radius || 50))
  });
}

var Simulation = mongoose.Schema({ bodies: [Body] });

Simulation.statics.random = function(count, mass, radius, spread) {
  var body = mongoose.model('Body', Body);
  return new this({
    bodies: _.range(count || 100).map(() => body.random(mass, radius, spread))
  });
}

exports.schema = mongoose.model('simulation', Simulation);
exports.name = 'simulation';
