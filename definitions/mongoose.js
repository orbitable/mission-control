var mongoose = require('mongoose');
mongoose.connect(F.config.mongopath);

global.mongoose =  mongoose;
