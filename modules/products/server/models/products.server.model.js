/*
const { ProductModel } = require(path.resolve('./modules/products/server/models/products.server.model.js'));
*/

'use strict';

const path = require('path');
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require(path.resolve('./config/config'));
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  id: { type: Number, unique: true },
  shop: { type: String, required: true },
  orgid: { type: String, required: true },
  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date, default: null },
  created_at: { type: Date, default: null },
  updated_at: { type: Date, default: null },
  // body_html: ,
  // body_plain: null,
  // handle: { type: String, default: '' },
  // images: [
  //   {
  //     _id: false,
  //     created_at: { type: Date, default: null },
  //     id: { type: Number, default: null },
  //     position: { type: Number, default: null },
  //     product_id: { type: Number, default: null },
  //     src: { type: String, default: null },
  //     updated_at: { type: Date, default: null },
  //     attachment: { type: Schema.Types.Mixed, default: null },
  //     filename: { type: String, default: null },
  //     metafields: { type: Schema.Types.Mixed, default: null },
  //     variant_ids: [{ type: Number, default: null }]
  //   }
  // ],
  // template_suffix: { type: String, default: null },
  // metafields: { type: Schema.Types.Mixed, default: null },
  // only_hide_from_list: { type: Boolean, default: false },
  // metafields_global_title_tag: { type: Schema.Types.Mixed, default: null },
  // metafields_global_description_tag: { type: Schema.Types.Mixed, default: null },
  // options: [
  //   {
  //     _id: false,
  //     name: { type: String, default: null },
  //     id: { type: Number, default: null },
  //     position: { type: Number, default: null },
  //     product_id: { type: Number, default: null },
  //   }
  // ],  
  product_type: { type: String, default: null },
  published: { type: Boolean, default: false },
  published_at: { type: Date, default: null },
  published_scope: { type: String, default: null },
  tags: { type: String, default: null },
  title: { type: String, default: '' },
  variants: [
    {
      _id: false,
      id: { type: Number, default: null },
      barcode: { type: String, default: null },
      compare_at_price: { type: Number, default: 0 },
      created_at: { type: Date, default: null },
      fulfillment_service: { type: String, default: null },
      grams: { type: Number, default: 0 },
      inventory_management: { type: String, default: null },
      inventory_policy: { type: String, default: null },
      inventory_quantity: { type: Number, default: 0 },
      old_inventory_quantity: { type: Number, default: 0 },
      inventory_quantity_adjustment: { type: Schema.Types.Mixed, default: null },
      position: { type: Number, default: 0 },
      price: { type: Number, default: 0 },
      product_id: { type: Number, default: null },
      requires_shipping: { type: Boolean, default: false },
      sku: { type: String, default: null },
      taxable: { type: Boolean, default: false },
      title: { type: String, default: null },
      updated_at: { type: Date, default: null },
      image_id: { type: Number, default: null },
      option1: { type: String, default: null },
      option2: { type: String, default: null },
      option3: { type: String, default: null },
      metafields: { type: Schema.Types.Mixed, default: null },
      inventory_advance: {
        qty_avaiable: { type: Number, default: 0 },
        qty_onhand: { type: Number, default: 0 },
        qty_commited: { type: Number, default: 0 },
        qty_incoming: { type: Number, default: 0 },
      }
    },
  ],
  vendor: { type: String, default: null },
  not_allow_promotion: { type: Boolean, default: false },
  session_sync_id: { type: String, default: null },
}, { versionKey: false });

ProductSchema.index({ orgid: 1, id: 1, updated_at: -1 });

const ProductModel = mongoose.model(config.dbprefix + '_Product', ProductSchema);

module.exports = { ProductModel };
