/*
const { ShopService } = require(path.resolve('./modules/shop/server/services/shop-service.server.js'));
*/

'use strict';

const path = require('path');
const { ShopModel } = require(path.resolve('./modules/core/server/models/shop.server.model.js'));
const { ERR_INVALID_DATA } = require(path.resolve('./modules/core/server/libs/errors.server.lib.js'));

const ShopService = {};

ShopService.assertExists = async function assertShopExists({ shop, orgid, shop_url, filter = {status: 1}, fields }) {
  if (shop && typeof shop === 'object' && shop._id && shop.authorize) {
    return shop;
  }
  if (typeof shop === 'string' && !shop_url) {
    shop_url = shop;
  }
  if (orgid || shop_url) {
    if (orgid) {
      filter.orgid = orgid;
    }
    if (shop_url) {
      filter._id = shop_url;
    }
    shop = await ShopModel.findOne(filter, fields).lean(true);
  }
  if (!shop) {
    throw new ERR_INVALID_DATA({ code: 'ERR_ENTRY_NOT_FOUND', entry : ShopModel.modelName, filter });
  }
  return shop;
}

module.exports = { ShopService };