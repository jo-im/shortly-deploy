var crypto = require('crypto');
var mongoose = require('mongoose');

var linkSchema = new mongoose.Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

linkSchema.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next(); 
});

var Link = mongoose.model('Link', linkSchema);

module.exports = Link;
