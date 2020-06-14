'use strict';

const path = require('path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require(path.resolve('./config/config'));

var UserSchema = new Schema({
  id:             { type: String, required: true, unique: true},
  account_owner:  { type: Boolean, default: false },
  bio:            { type: String, default: '' },
  email:          { type: String, default: '' },
  first_name:     { type: String, default: ''},
  im:             { type: String, default: '' },
  last_name:      { type: String, default: ''},
  phone:      { type: String, default: '', trim: true },
  receive_announcements:  { type: Number, default: 0 },
  url:    { type: String, default: '' },
  user_type:  { type: String, default: '' },
  permissions: [],

  shop: { type: String, required: true },
  orgid: { type: String, required: true },
  is_deleted: {type: Boolean, default: false}
}, {versionKey: false});
module.exports = mongoose.model(config.dbprefix + '_User', UserSchema);
