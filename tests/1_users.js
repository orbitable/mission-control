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

exports.run = function() {
  F.assert('Getting users not supported', '/users', ['get'],  function(error, data, code, headers) {
    assert.ok(code === 405, 'did not get 405');
  });
  F.assert('Deleting users is not supported', '/users/fake_id', ['delete'],  function(error, data, code, headers) {
    assert.ok(code === 405, 'did not get 405');
  });
  F.assert('Getting user not supported', '/users/fake_id', ['get'],  function(error, data, code, headers) {
    assert.ok(code === 405, 'did not get 405');
  });
  F.assert('Updating a user', '/users/123', ['put'], function(error, data, code, headers) {
    assert.ok(code === 501, 'did not get a 501; Got ' + code);
  }, {username: new Date(), password: new Date(), email: new Date()});
  F.assert('Creating a user', '/users', ['post', 'json'], function(error, data, code, headers) {
    assert.ok(code === 200, 'did not get a 200; Got ' + code);
  }, {username: new Date(), password: new Date(), email: new Date()});
};
