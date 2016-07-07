var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var mongoose = require('mongoose');
var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function(err, links) {
    if (err) {
      console.log('Error fetching links');
      return res.status(404);
    }
    res.status(200).send(links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.findOne({url: this.url}, function(err, link) {
    if (err) {
      console.log('Error querying database');
      return res.sendStatus(404);
    } else if (link) {
      console.log('found link', link);
      res.status(200).send(found);
    } else {
      util.getUrlTitle(uri, function(err, title) { 
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        }); 

        newLink.save(function(err, newLink) {
          if (err) {
            console.log('Error adding new user to database');
            return res.sendStatus(404);
          }
          res.status(200).send(newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {
    if (err) {
      console.log('Error querying database');
      return res.status(404);
    } else if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          console.log('Incorrect password');
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  
  User.findOne({username: username}, function(err, user) {
    if (err) {
      console.log('Error querying database');
      return res.status(404);
    } else if (!user) {
      var newUser = new User({
        username: username, 
        password: password
      });
      console.log('want to save user');
      newUser.save(function(err, newUser) {
        if (err) {
          console.log('Error saving new user to database');
          return res.status(404);
        }
        util.createSession(req, res, newUser);
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }, function(err, link) {
    if (err) {
      console.log('Error querying database');
      return res.status(404);
    } else if (!link) {
      res.redirect('/');
    } else {
      link.visits = link.visits + 1;
      link.save(function(err) {
        if (err) {
          console.log('Error updating visits for link');
          return res.status(404);
        }
        res.redirect(link.url);
      });
    }
  });
};