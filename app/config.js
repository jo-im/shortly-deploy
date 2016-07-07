var mongoose = require('mongoose');

mongoose.connect('mongod://localhost:4567');
var db = mongoose.connection;
db.on('error', function(err) {
  console.log('Error connecting to database');
});

module.exports = db;
