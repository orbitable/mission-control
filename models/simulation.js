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

Vector.statics.scalarProduct = function(vectorX,vectorY,factor) {
    var vX = vectorX * factor;
    var vY = vectorY * factor;
    return new this({x: vX, y: vY});
};

Vector.statics.cross = function(vector) {
    var vX = vector.y;
    var vY = -vector.x;
    return new this({x: vX, y: vY});
};

Vector.statics.add = function(aX,aY,bX,bY) {
    var vX = aX + bX;
    var vY = aY + bY;
    return new this({x: vX, y: vY});
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

var centerBody = function(mass, radius) {
    var body = mongoose.model('Body', Body);
    var vector = mongoose.model('Vector', Vector);

    return new body({
        position: vector({x: 0, y: 0}),
        mass: mass,
        radius: radius,
        density: 1410,
        luminosity: _.sample(_.range(1,5))
    });
};

var Simulation = mongoose.Schema({ bodies: [Body] });



Simulation.statics.random = function(count, mass, radius, spread) {
  var body = mongoose.model('Body', Body);
  return new this({
    bodies: _.range(count || 100).map(() => body.random(mass, radius, spread))
  });
};

var newOrbitingBody = function (centerBody,distance,mass,radius, chaos) {
    var body = mongoose.model('Body', Body);
    var vector = mongoose.model('Vector', Vector);

    var position = getPointOnCircle(centerBody.position,distance);
    var velocity = getTangent(centerBody.position,position);

    return new body({
        position: position,
        velocity: vector.scalarProduct(velocity.x,velocity.y,getEscapeVelocity(centerBody.mass,distance) * getChaos(chaos)),
        mass: mass,
        radius: radius,
        density: 5515
    }); 
};

var G = 6.674 * Math.pow(10,-11);
var PI2 = Math.PI * 2.0;

var getEscapeVelocity = function (centerMass,distance) {
    return Math.sqrt(G * centerMass/distance);
};
var getTangent = function (centerPosition,bodyPosition) {
    var vector = mongoose.model('Vector', Vector);

    var cross = vector.cross(
            vector.add(
                bodyPosition.x,
                bodyPosition.y,
                -centerPosition.x,
                -centerPosition.y
            )
        );

    var normFactor = 1.0 / Math.sqrt(Math.pow(cross.x,2.0) + Math.pow(cross.y,2.0));
    return vector.scalarProduct(cross.x,cross.y,normFactor);
};

var getPointOnCircle = function (centerPosition,distance) {
    var vector = mongoose.model('Vector', Vector);

    var rX = (Math.random()-0.5);
    var rY = (Math.random()-0.5);
    var normFactor = distance / Math.sqrt(Math.pow(rX,2.0) + Math.pow(rY,2.0));

    return new vector({
        x: centerPosition.x + rX * normFactor,
        y: centerPosition.y + rY * normFactor
    });
};

var getChaos = function(factor) {
    
    
    factor = Math.min(factor,0.999999999); // Prevent value >= 1 to prevent division by 0 and unwanted values
    factor = Math.max(factor,0.0);
    
    var min = (1.0-factor)/1.0
    var max = 1.0/(1.0-factor)
    
    return (Math.random() * (max-min)) + min;
};

Simulation.statics.randomSystem = function(centerMass,centerRadius,bodyCount,ringStep,bodyMass,bodyRadius,chaos) {
    //var body = mongoose.model('Body', Body);

    var bodies = [];
    var solarBody = centerBody(centerMass,centerRadius);
    bodies.push(solarBody);

    var distance = ringStep;
    for(var i = 0; i < bodyCount; i++) {
        bodies.push(
            newOrbitingBody(
                solarBody,
                distance,
                bodyMass * getChaos(chaos),
                bodyRadius * getChaos(chaos),
                chaos
            )
        );
        distance += ringStep * getChaos(chaos);
    }


    return new this({
        bodies: bodies
    });
};

exports.schema = mongoose.model('simulation', Simulation);
exports.name = 'simulation';

