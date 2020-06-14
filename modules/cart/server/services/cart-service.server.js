/*
const { CartService } = require(path.resolve('./modules/cart/server/services/cart-service.server.js'));
*/

'use strict';

const _ = require('lodash');
const path = require('path');
const { ERR, SIG_FINISH } = require(path.resolve('./modules/core/server/libs/errors.server.lib.js'));
const { CartServiceFactory } = require('./cart-service-factory.server');
const { PromotionService } = require(path.resolve('./modules/promotions/server/services/promotion-service.server.js'));
const _do = require(path.resolve('./modules/core/share/lib/_do.lib.share.js'));
const _to = require(path.resolve('./modules/core/share/lib/_to.lib.share.js'));
const _CONST = require(path.resolve('./modules/core/share/lib/_CONST.lib.share'));
const PromotionUtil = require(path.resolve('./modules/promotions/server/services/activities/promotion-service.util.server'));

const { joinS } = _do;

const CartService = CartServiceFactory({ _, SIG_FINISH, ERR, joinS, _to, _CONST, PromotionService, PromotionUtil });

module.exports = { CartService };