'use strict';

const { CartUtilsFactory } = require('./activities/cart-service.utils.server');
const { ProcessCartFactory } = require('./process/cart-service.process.server');

function CartServiceFactory(DI) {
  const CartService = {};

  DI.CartService = CartService;
  DI.CartUtils = CartUtilsFactory(DI);
  DI.ProcessCart = ProcessCartFactory(DI);
    
  CartService.Applier = require('./appliers/cart-service.applier.server')(DI);
  CartService.calculate = require('./activities/cart-service.calculate.server')(DI);
  CartService.applyPromotions = require('./activities/cart-service.apply-promotions.server')(DI);

  return CartService;
}


module.exports = { CartServiceFactory };