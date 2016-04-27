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

var mongoose = require('mongoose');

var VectorSchema = new mongoose.Schema({
  x: {type: Number, default: 0},
  y: {type: Number, default: 0},
});

var NoteSchema = new mongoose.Schema({
  duration: {type: Number, default: 10000},
  position: {type: VectorSchema, default: {x: 0, y: 0}}, 
  simulation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'simulation',
    required: 'A note must reference a simulation'
  },
  startTime: {type: Number, default: 0},
  title: {type: String, default: 'New Note'},
  text: {type: String, default: 'Add a body'}
});

exports.schema = mongoose.model('note', NoteSchema);
exports.name = 'note';
