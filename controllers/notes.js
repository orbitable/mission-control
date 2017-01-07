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

var okay = function() { this.plain('okay'); };

exports.install = function() {
  logger.debug('Installing notes restful route');

  F.route('/',function() {console.log("TEST");});

  // Accept OPTIONS requests
  F.route('/notes', okay, ['#cors', 'OPTIONS']);
  F.route('/notes/{note}', okay, ['#cors', 'OPTIONS']);

  // Add join to simulation
  F.route('/simulations/{simulationId}/notes', queryNote, ['#cors']);

  F.restful('/notes', ['#cors'], queryNote, getNote, saveNote, deleteNote);
};

function deleteNote(id) {
  logger.debug('Removing note ' + id);

  var self = this;
  var Note = MODEL('note').schema;

  Note.findById(id).then(function(note) {
    if (note) {
      note.remove();
      return self.json({status: 200, reason: 'note deleted'});
    }

    return self.throw404();
  });
}

function getNote(id) {
  logger.debug('Getting note ' + id);

  var self = this;
  var Note = MODEL('note').schema;

  Note.findById(id, function(err, note) {

    if (err) {
      logger.error('Encountered error finding note' + id + ':' + err);

      self.throw400();
      return;
    }

    if (!note) {
      self.throw404();
      return;
    }

    self.json(note);
    return;
  });
}

function queryNote(simulationId) {

  var self = this;
  var Note = MODEL('note').schema;

  if (simulationId) {
    logger.debug('Getting notes for simulation id ' + simulationId);
    if (simulationId === 'random') {
      return self.json([]);
    } else {
      Note.find({simulation: simulationId}, function(err, notes) {
        if (err) {
          logger.error(err); return self.throw500(err);
        }

        return self.json(notes);
      });
    }

  } else {
    logger.debug('Getting notes');
    Note.find(function(err, notes) {
      if (err) {
        logger.error(err); return self.throw500(err);
      }

      self.json(notes);
    });
  }
}

function saveNote(id) {
  var self = this;
  var Note = MODEL('note').schema;

  logger.debug('saving note');

  if (id) {
    var updates = self.json;
    logger.debug('Updating a note with id %s', id);

    Note.findByIdAndUpdate(id, {$set: updates}, function(err, doc) {
      if (err) {
        logger.error('Unable to update note: %s', id, updates);
      }

      self.json(doc);
    });
  } else {
    logger.debug('Saving new note');

    Note.create(self.body, function(err, doc) {

      if (err) {
        logger.error('Unable to create note: ' + err);
        self.throw400(err);
        return;
      }

      self.json(doc);
    });
  }
}

