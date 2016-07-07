var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var userSchema = new mongoose.Schema({
  username: { type: String, require: true },
  password: { type: String, require: true },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  bcrypt.hash(this.password, null, null, function(err, hash) {
    if (err) {
      console.log('Error hashing password');
      throw err;
    }
    this.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
