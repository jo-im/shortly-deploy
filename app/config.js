var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shortly');
var db = mongoose.connection;
db.on('error', function(err) {
  console.log('Error connecting to database');
});

module.exports = db;
