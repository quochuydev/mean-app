'use strict';

var path = require('path');
var mongoose = require('mongoose');
var url = require('url');

var config = require(path.resolve('./config/config'));
var nlogger = require(path.resolve('./config/lib/nlogger'));
var CoreSession = require(path.resolve('./modules/coreSession/server/businesses/session.server.businesses'));
var ShopMD = mongoose.model(config.dbprefix + '_Shop');

/**
 * Render the embed application page
 */
exports.renderIndex = function (req, res) {
  var shop = req.session.shop || req.query.shop || '';
  var orgid = req.session.store_id || req.query.orgid || '';
  var timestamp = req.query.timestamp || '';
  var signature = req.query.signature || '';
  var code = req.query.code || '';
  var embed = config.embed;
  var domain = url.parse(config.apphost).hostname;
  let indexTemplate = embed ? 'modules/core/server/views/index-embed' : 'modules/core/server/views/index';
  res.render(indexTemplate, {
    domain: domain,
    shopname: shop,
    orgid: orgid,
    timestamp: timestamp,
    signature: signature,
    code: code
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

exports.renderFileNotFound = function (req, res) {
  res.render('modules/core/server/views/100', {
    // error: 'Oops! file not found'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};

exports.renderPermission = function (req, res) {
  res.render('modules/core/server/views/permission', {
  });
};

