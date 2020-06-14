/*
const { PromotionModel } = require(path.resolve('./modules/promotions/server/models/promotion.server.model.js'));
*/

'use strict';

const path = require('path');
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require(path.resolve('./config/config'));
const Schema = mongoose.Schema;

const PromotionSchema = new Schema({
  orgid: { type: String, required: true },
  shop: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  user_created: { type: String, required: true },
  is_deleted: { type: Number, default: 0 },
  type: { type: Number, default: null },
  status: { type: Number, default: null },
  code: { type: String, default: null },
  name: { type: String, default: null },
  start_date: { type: Date, default: null },
  end_date: { type: Date, default: null },
  sub_total: { type: Number, default: null },
  allow_other_promotions: { type: Boolean, default: true },
  has_group: { type: Boolean, default: false },
  has_group_promotion: { type: Boolean, default: false },
  customer_groups: {
    type: [{
      _id: false,
      id: { type: String, default: null },
      name: { type: String, default: null },
    }],
    default: null
  },
  source_names: {
    type: [{
      _id: false,
      code: { type: String, default: null },
      name: { type: String, default: null },
    }],
    default: null
  },
  locations: {
    type: [{
      _id: false,
      id: { type: String, default: null },
      name: { type: String, default: null },
    }],
    default: null
  },
  
  product_buy_ids: [],
  variant_buy_ids: [],
  promotion_products: [{
    product_id: { type: Number, default: null },
    product_name: { type: String, default: null },
    product_image: { type: String, default: null },
    is_main: { type: Boolean, default: false },
    apply_resource: { type: Number, default: null },
    rule: [{
      promotion_type: { type: Number, default: 0 },
      quantity: { type: Number, default: 0 },
      quantity_apply: { type: Number, default: 0 },
      promotion_value: { type: String, default: '' },
      quantity_from: { type: Number, default: 0 },
      quantity_to: { type: Number, default: 0 },
    }],
    variants: [{
      variant_id: { type: Number, default: 0 },
      variant_title: { type: String, default: null },
      variant_sku: { type: String, default: null },
      variant_barcode: { type: String, default: null },
      rule: [{
        promotion_type: { type: Number, default: 0 },
        quantity: { type: Number, default: 0 },
        quantity_apply: { type: Number, default: 0 },
        promotion_value: { type: String, default: '' },
        quantity_from: { type: Number, default: 0 },
        quantity_to: { type: Number, default: 0 },
      }]
    }]
  }]
});

PromotionSchema.statics.IS_DELETED = 1;
PromotionSchema.statics.IS_NOT_DELETED = 0;

PromotionSchema.statics.TYPE_BUYX_GETY = 1;
PromotionSchema.statics.TYPE_DISCOUNT_ON_ORDER = 2;

PromotionSchema.statics.ACTIVE = 1;
PromotionSchema.statics.INACTIVE = 2;

PromotionSchema.statics.DISCOUNT_TYPE_NONE = 0;
PromotionSchema.statics.DISCOUNT_TYPE_MONEY = 1;
PromotionSchema.statics.DISCOUNT_TYPE_PERCENT = 2;
PromotionSchema.statics.DISCOUNT_TYPE_GIFT = 3;
PromotionSchema.statics.DISCOUNT_TYPE_FIX_AMOUNT = 4;

PromotionSchema.statics.CONDITION_TYPE_AND = 1;
PromotionSchema.statics.CONDITION_TYPE_OR = 2;

PromotionSchema.statics.HAS_GROUP_OR = true;
PromotionSchema.statics.HAS_GROUP_AND = false;

PromotionSchema.statics.IS_MAIN_TRUE = true;
PromotionSchema.statics.IS_MAIN_FALSE = false;

PromotionSchema.statics.APPLY_RESOURCE_PRODUCT = 1;
PromotionSchema.statics.APPLY_RESOURCE_VARIANT = 2;

PromotionSchema.index({ orgid: 1, created_at: 1 });

const PromotionModel = mongoose.model(config.dbprefix + '_Promotion', PromotionSchema);

module.exports = { PromotionModel };