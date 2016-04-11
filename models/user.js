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
var bcrypt   = require('bcryptjs');
var ROUNDS = 10;

var UserSchema = new mongoose.Schema({
  // TODO: Validate email format
  username: {type: String, required: 'An username is required'},
  email:    {
    type: String,
    required: 'An email address is required',
    trim: true,
    unique: true
  },
  password: {type: String, required: 'A password is required'},
});

UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) { return next(); }

  bcrypt.genSalt(ROUNDS, function(err, salt) {
    if (err) {
      logger.error('Cannot generate salt: ', err);
    } else {
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          logger.error('Failure hasing password', err);
          return next(err);
        }

        user.password = hash;
        next();
      });}
  });

});

UserSchema.methods.isValidPassword = function(givenPassword, callback) {
  bcrypt.compare(givenPassword, this.password, callback);
};

UserSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

exports.schema = mongoose.model('user', UserSchema);
exports.name = 'user';
