'use strict';

var path = require('path');
var config = require(path.resolve('./config/config'));

module.exports = function (app, appslug) {
  var coreController = require('../controllers/core.server.controller');
  app.route('/' + appslug + '/server-error').get(coreController.renderServerError);
  app.route('/' + appslug + '/:url(api|modules|lib)/*').get(coreController.renderNotFound);
  app.route('/' + config.appslug + '/*').get(coreController.renderIndex);
};