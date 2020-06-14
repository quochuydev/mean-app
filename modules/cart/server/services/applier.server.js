/*
const { Applier } = require(path.resolve('./modules/cart/server/services/applier.server.js'));
*/

'use strict';

const _ = require('lodash');
const path = require('path');
const { ERR, SIG_FINISH } = require(path.resolve('./modules/core/server/libs/errors.server.lib.js'));
const ApplierFactory = require('./appliers/cart-service.applier.server');
const _do = require(path.resolve('./modules/core/share/lib/_do.lib.share.js'));
const _to = require(path.resolve('./modules/core/share/lib/_to.lib.share.js'));
const _CONST = require(path.resolve('./modules/core/share/lib/_CONST.lib.share'));
const PromotionUtil = require(path.resolve('./modules/promotions/server/services/activities/promotion-service.util.server'));

const { joinS } = _do;

const Applier = ApplierFactory({ _, SIG_FINISH, ERR, joinS, _to, _CONST, PromotionUtil });

module.exports = { Applier };