var mongoose = require('mongoose');

var Vector = new mongoose.Schema({x: {type: Number, default: 0}, y: {type: Number, default: 0}});

var Body = mongoose.Schema({
        position: {type: Vector, required: true},
        velocity: {type: Vector, default: {x: 0, y: 0}},
        mass: {type: Number, required: true},
        density: {type: Number, default: 0},
        radius: {type: Number, default: 0},
        luminosity: {type: Number, default: 0}});

var simulationSchema = mongoose.Schema({ bodies: [Body] });

exports.schema = mongoose.model('simulation', simulationSchema);
exports.name = 'simulation';
