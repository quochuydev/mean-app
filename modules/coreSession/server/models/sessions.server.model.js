'use strict';

/**
 * Module dependencies.
 */
var path = require('path');
var _ = require('lodash');
var mongoose = require('mongoose');
var config = require(path.resolve('./config/config'));
var Schema = mongoose.Schema;

/**
 *  Sessions Schema
 */
var Sessions = new Schema({
  session: { type: Schema.Types.Mixed },
  expires: { type: Date }
});
const INDEX_SESSION_ST_1 = { 'session.orgid' : 1};
const INDEX_SESSION_ST_2 = { 'session.sid' : 1};
Sessions.index(INDEX_SESSION_ST_1);
Sessions.index(INDEX_SESSION_ST_2);

mongoose.model(config.sessionCollection, Sessions);
