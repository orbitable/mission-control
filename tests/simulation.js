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

var fakeId = '56ca44c0b61563713582121b';
var testData = {
  bodies: [{position: {x: 0, y: 0}, mass: 0}],
  createdBy: '56e5a496e787f9e648429611'
};

exports.run = function() {
  F.assert('Simulation API GET',
    '/simulations',
    ['get'],
    function(error, data, code) {
      assert.ok(code === 200, 'did not get 200');
    }
  );

  F.assert('Simulation API GET bad id',
    '/simulations/bad_id',
    ['get'],
    function(error, data, code) {
      assert.ok(code === 400, 'did not get a 400 when using bad id: ' + code);
    }
  );

  F.assert('Simulation API GET',
    '/simulations/' + fakeId,
    ['get'],
    function(error, data, code) {
      assert.ok(code === 404, 'did not get 404 for non existent simulation');
    }
  );

  F.assert('Simulation API POST missing position',
    '/simulations',
    ['post', 'json'],
    function(error, data, code) {
      assert.ok(code == 400, 'did not get a bad request(400): ' + code);
    },

    {
      bodies: [{mass: 12, radius: 1}],
      createdBy: '56e5a496e787f9e648429611'
    }
  );

  F.assert('Simulation API POST missing mass',
    '/simulations',
    ['post', 'json'],
    function(error, data, code) {
      assert.ok(code == 400, 'did not get a bad request(400): ' + code);
    },

    {
      bodies: [{position: {x: 0, y: 0}, radius: 1}],
      createdBy: '56e5a496e787f9e648429611'
    }
  );

  F.assert('Simulation API POST',
    '/simulations',
    ['post', 'json'],
    function(error, data, code) {
      assert.ok(
        code == 200,
        'did not get a success (200): (' + code + ') ' + error
      );
    },

    testData
  );

  F.assert('Simulation API DELETE',
    '/simulations/' + fakeId,
    ['delete', 'json'],
    function(error, data, code) {
      assert.ok(code == 404, 'expected delete to return 404: ' + code);
    }
  );

  F.assert('Simulation API DELETE',
    '/simulations/' + fakeId,
    ['delete', 'json'],
    function(error, data, code) {
      assert.ok(code == 404, 'expected delete to return 404; got ' + code);
    }
  );

  F.assert('Simulation API PUT',
    '/simulations/' + fakeId,
    ['put', 'json'],
    function(error, data, code) {
      assert.ok(code == 404, 'expected put to return 200; got ' + code);
    }
  );
};
