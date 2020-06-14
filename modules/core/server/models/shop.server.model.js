'use strict';

let mongoose = require('mongoose');
let path = require('path');
let config = require(path.resolve('./config/config'));
let Schema = mongoose.Schema;

let ShopSchema = new Schema({
  _id: { type: String, required: true, index: { unique: true } },
  orgid: { type: String, required: true, index: { unique: true } },
  authorize: {
    'access_token': { type: String, default: null },
    'refresh_token': { type: String, default: null },
    'expires_in': { type: Number, default: 0 },
    'expires_time': { type: Date, default: null },
    'id_token': { type: String, default: null },
    'token_type': { type: String, default: null },
    'scope': { type: String, default: null }
  },
  cart_proxy_register: { type: Schema.Types.Mixed },
  status: { type: Number, default: 0 },
  settings: { type: Schema.Types.Mixed },
  install_date: { type: Date, default: null },
  uninstall_date: { type: Date, default: null },
});
ShopSchema.statics.STATUS_ACTIVE = 1;
ShopSchema.statics.STATUS_DEACTIVE = 0;

const ShopModel = mongoose.model(config.dbprefix + '_Shop', ShopSchema);

module.exports = { ShopModel };
