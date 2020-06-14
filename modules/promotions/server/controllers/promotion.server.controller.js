'use strict';

const _ = require('lodash');
const path = require('path');
const escapeStringRegexp = require('escape-string-regexp');
const { PromotionService } = require(path.resolve('./modules/promotions/server/services/promotion-service.server.js'));
const { CartService } = require(path.resolve('./modules/cart/server/services/cart-service.server.js'));
const _CONST = require(path.resolve('./modules/core/share/lib/_CONST.lib.share'));

async function search(req, res, next) {
  let { body, user } = req;
  let { orgid, shop } = req.session;

  let criteria = {};
  criteria.$and = [];

  let status = [];
  let source_names = [];
  let locations = [];
  let user_createds = [];
  let customer_groups = [];

  for (let field in body) {
    if (!body[field]) { continue; }

    if (field == 'status_in_time') {
      status.push({
        $or: [
          { status: _CONST.PROMOTION.STATUS.ACTIVE, start_date: { $lte: new Date() }, end_date: { $gte: new Date() } },
          { status: _CONST.PROMOTION.STATUS.ACTIVE, start_date: { $lte: new Date() }, end_date: null }
        ]
      });
    }

    if (field == 'status_not_yet') {
      status.push({ status: _CONST.PROMOTION.STATUS.ACTIVE, start_date: { $gte: new Date() } })
    }

    if (field == 'status_active') {
      status.push({ status: _CONST.PROMOTION.STATUS.ACTIVE })
    }

    if (field == 'status_inactive') {
      status.push({ status: _CONST.PROMOTION.STATUS.INACTIVE })
    }

    if (field == 'source_names.code') {
      source_names.push({ 'source_names.code': body[field] })
    }
    if (field == 'locations.id') {
      locations.push({ 'locations.id': body[field] })
    }
    if (field == 'customer_groups.id') {
      customer_groups.push({ 'customer_groups.id': body[field] })
    }
    if (field == 'user_created') {
      user_createds.push({ 'user_created': body[field] })
    }

    if (field.includes('variant_buy_id')) {
      let variant_buy_id = Number(field.split('__')[1]);
      if (typeof variant_buy_id == 'number' && !isNaN(variant_buy_id)) {
        criteria.$and.push({ 'variant_buy_ids': variant_buy_id });
      }
    }

    if (field == 'code') {
      criteria.$or = [
        { code: { $regex: new RegExp(escapeStringRegexp(body[field]), 'i') } },
        { name: { $regex: new RegExp(escapeStringRegexp(body[field]), 'i') } }
      ];
    }
  }

  if (status.length) {
    criteria.$and.push({ $and: status });
  }
  if (source_names.length) {
    criteria.$and.push({ $or: [{ 'source_names': null }, { $and: source_names }] })
  }
  if (locations.length) {
    criteria.$and.push({ $or: [{ 'locations': null }, { $and: locations }] })
  }
  if (customer_groups.length) {
    criteria.$and.push({ $or: [{ 'customer_groups': null }, { $and: customer_groups }] })
  }
  if (user_createds.length) {
    criteria.$and.push({ $or: user_createds })
  }
  if (!criteria.$and.length) { delete criteria.$and; }

  let result = await PromotionService.search({ query: criteria, user, orgid, shop });
  res.json(result);
}

async function detail(req, res, next) {
  let { params, user } = req;
  let result = await PromotionService.get({ params, user, orgid: req.session.orgid, shop: req.session.shop });
  res.json(result);
}

async function write(req, res, next) {
  try {
    let { body, user } = req;
    let result = await PromotionService.write({ body, user, orgid: req.session.orgid, shop: req.session.shop });
    res.json(result);
  } catch (error) {
    res.status(400).send(error);
  }
}

async function changeStatus(req, res, next) {
  let { body, user, params } = req;
  let result = await PromotionService.changeStatus({ body, user, orgid: req.session.orgid, shop: req.session.shop, promotionId: params.promotionId });
  res.json(result);
}

async function deleteOne(req, res, next) {
  try {
    let { params, user } = req;
    let result = await PromotionService.delete({ params, user, orgid: req.session.orgid, shop: req.session.shop });
    res.json(result);
  } catch (error) {
    res.status(400).send(error);
  }
}

async function calculateCart(req, res, next) {
  try {
    const shop = {};
    const cart = req.body;

    const result = await CartService.calculate({ shop, cart });

    console.log(`CALCULATE_CART_RESULT : ${JSON.stringify({
      shop: shop._id,
      cart_token: cart.token,
      promotions: result.promotions.map(promotion => Object({ id: promotion.promotion_id, name: promotion.name })),
      logs: result.best_apply_context ? result.best_apply_context.logs : [],
      cart: cart,
      calculated_cart: result.calculated_cart
    })}`);

    return res.status(200).json(result.calculated_cart);
  }
  catch (error) {
    return next(error);
  }
}

module.exports = { search, detail, write, changeStatus, deleteOne, calculateCart };