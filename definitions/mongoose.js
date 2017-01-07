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

function mongooseUri(host, database, user, password) {
  password = password === undefined ? '' : ':' + password;
  user     = user     === undefined ? '' : user + password + '@';
  database = database === undefined ? '' : database;

  return 'mongodb://' + user + host + '/' + database;
}


var host     = process.env.MONGO_HOST     || F.config.mongoHost || 'localhost';
var user     = process.env.MONGO_USER     || F.config.mongoUser;
var password = process.env.MONGO_PASSWORD || F.config.mongoPassword;
var database = process.env.MONGO_DATABASE ||
  F.config.mongoDatabase ||
  'default';
host = 'localhost';
database = 'orbitable';
user= '';
password = '';
var mongoPath = mongooseUri(host, database, user, password);
mongoPath = 'mongodb://localhost:27017'
mongoose.connect(mongoPath,function(err) {
  console.log("Mongoose Connected:",mongoPath);
});
global.mongoose = mongoose;