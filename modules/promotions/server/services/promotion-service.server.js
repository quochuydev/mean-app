/*
const { PromotionService } = require(path.resolve('./modules/promotions/server/services/promotion-service.server.js'));
*/

'use strict';

const path = require('path');
const { ProductModel } = require(path.resolve('./modules/products/server/models/products.server.model.js'));
const { ShopService } = require(path.resolve('./modules/shop/server/services/shop-service.server.js'));
const API = require(path.resolve('./modules/core/server/api'));
const RabbitMQ = require(path.resolve('./config/lib/rabbitmq.js'));
const config = require(path.resolve('./config/config'));
const { ProductService } = require(path.resolve('./modules/products/server/services/product-service.server.js'));
const { PromotionModel } = require(path.resolve('./modules/promotions/server/models/promotion.server.model.js'));
const { PromotionElementModel } = require(path.resolve('./modules/promotions/server/models/promotion_element.server.model.js'));
const _do = require(path.resolve('./modules/core/share/lib/_do.lib.share.js'));
const MSG = require(path.resolve('./modules/core/share/lib/MSG.lib.share.js'));
const PromotionUtil = require(path.resolve('./modules/promotions/server/services/activities/promotion-service.util.server'));
const { Applier } = require(path.resolve('./modules/cart/server/services/applier.server.js'));

const PromotionService = {};

const di = {
  Applier, PromotionService, PromotionModel, PromotionElementModel, PromotionUtil, 
  ProductService, ProductModel, ShopService, API, RabbitMQ, config, _do, MSG 
};

PromotionService.search = require('./activities/promotion-service.search.server')(di);
PromotionService.get = require('./activities/promotion-service.get.server')(di);
PromotionService.write = require('./activities/promotion-service.write.server')(di);
PromotionService.changeStatus = require('./activities/promotion-service.change-status.server')(di);
PromotionService.delete = require('./activities/promotion-service.delete.server')(di);
PromotionService.Element = {};
PromotionService.Element.search = require('./activities/element/promotion-service.elements.search.server')(di);
PromotionService.Element.list = require('./activities/element/promotion-service.elements.list.server')(di);
PromotionService.Element.write = require('./activities/element/promotion-service.elements.write.server')(di);

module.exports = { PromotionService };