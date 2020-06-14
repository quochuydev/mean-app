/*
let LocationMD = mongoose.model(config.dbprefix + '_Location');
*/

'use strict';

const path = require('path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require(path.resolve('./config/config'));

var LocationsSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, default: null },
  email: { type: String, default: null },
  location_type: { type: String, default: null },
  address1: { type: String, default: null },
  address2: { type: String, default: null },
  zip: { type: String, default: null },
  city: { type: String, default: null },
  country: { type: String, default: null },
  province: { type: String, default: null },
  province_code: { type: String, default: null },
  district: { type: String, default: null },
  district_code: { type: String, default: null },
  ward: { type: String, default: null },
  ward_code: { type: String, default: null },
  country_code: { type: String, default: null },
  country_name: { type: String, default: null },
  phone: { type: String, default: null },
  is_primary: { type: Boolean, default: false },
  is_unavailable_quantity: { type: Boolean, default: false },
  type: { type: String, default: null },
  created_at: { type: Date, default: null },
  updated_at: { type: String, default: null },

  shop: { type: String, required: true },
  orgid: { type: String, required: true },
  is_deleted: { type: Boolean, default: false }
}, { versionKey: false });

module.exports = mongoose.model(config.dbprefix + '_Location', LocationsSchema);
