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

var _        = require('lodash');
var mongoose = require('mongoose');


var Vector = new mongoose.Schema({x: {type: Number, default: 0}, y: {type: Number, default: 0}});

Vector.statics.random = function(spread) {
  var range = spread || 2 * 4.628 * Math.pow(10,12);
  var xPosition = (-1 * range) + (2 * Math.random() * range);
  var yPosition = (-1 * range) + (2 * Math.random() * range);

  return new this({x: xPosition, y: yPosition});
};

var Body = mongoose.Schema({
        position: {type: Vector, required: true},
        velocity: {type: Vector, default: {x: 0, y: 0}},
        mass: {type: Number, required: true},
        density: {type: Number, default: 0},
        radius: {type: Number, default: 0},
        luminosity: {type: Number, default: 0}});

Body.statics.random = function(mass, radius, spread) {
  var vector = mongoose.model('Vector', Vector);

  // Constraints
  var minMass = 7.3476730 * Math.pow(10,22);
  var maxMass = mass || 1.989 * Math.pow(10,30);
  var minRadius = 6.3674447 * Math.pow(10,6);
  var maxRadius = radius || 6.955 * Math.pow(10,8);

  return new this({
    position: vector.random(spread),
    mass: Math.random() * (maxMass - minMass) + minMass,
    radius: Math.random() * (maxRadius - minRadius) + minRadius
  });
};

var Simulation = mongoose.Schema({ bodies: [Body] });

Simulation.statics.random = function(count, mass, radius, spread) {
  var body = mongoose.model('Body', Body);
  return new this({
    bodies: _.range(count || 100).map(() => body.random(mass, radius, spread))
  });
};

exports.schema = mongoose.model('simulation', Simulation);
exports.name = 'simulation';
