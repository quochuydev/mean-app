'use strict';

let chalk = require('chalk');
let config = require('../config');
let express = require('./express');
let mongoose = require('./mongoose');
let rabbitmq = require('./rabbitmq');

mongoose.loadModels();
module.exports.loadModels = function loadModels() {
  mongoose.loadModels();
};

module.exports.init = function init(callback) {
  rabbitmq.connect();
  rabbitmq.createPublisherForActiveQueue();
  mongoose.connect(function (db) {
    let app = express.init(db);
    if (callback) callback(app, db, config);
  });
};

module.exports.start = function start(callback) {
  let _this = this;

  _this.init(function (app, db, config) {
    app.listen(config.port, config.host, function () {
      let server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port + '/' + config.appslugadmin;
      console.log('--');
      console.log(chalk.green(config.app.title));
      console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
      console.log(chalk.green('Server:          ' + server));
      console.log(chalk.green('Database:        ' + config.db.uri));
      console.log(chalk.green('App version:     ' + config.meanjs.version));
      if (config.meanjs['meanjs-version']) {
        console.log(chalk.green('MEAN.JS version: ' + config.meanjs['meanjs-version']));
      }
      console.log('--');
      if (callback) callback(app, db, config);
    });
  });
};
