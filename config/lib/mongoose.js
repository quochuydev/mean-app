'use strict';

/**
 * Module dependencies.
 */
var path = require('path');

var chalk = require('chalk');
var mongoose = require('mongoose');

var config = require('../config');

module.exports = {
  loadModels: loadModels,
  connect: connect,
  disconnect: disconnect
};

// Load the mongoose models
function loadModels (callback) {
  // Globbing model files
  config.files.server.models.forEach(function (modelPath) {
    require(path.resolve(modelPath));
  });

  if (callback) callback();
}

// Initialize Mongoose
function connect (cb) {
  mongoose.Promise = global.Promise;
  var db = mongoose.connect(config.db.uri, config.db.options, function (err) {
    // Log Error
    if (err) {
      console.error(chalk.red('Could not connect to MongoDB!'));
      console.log(err);
    } else {

      // Enabling mongoose debug mode if required
      mongoose.set('debug', config.db.debug);

      // Call callback FN
      if (cb) cb(db);
    }
  });
}

function disconnect (cb) {
  mongoose.disconnect(function (err) {
    console.info(chalk.yellow('Disconnected from MongoDB.'));
    cb(err);
  });
}
