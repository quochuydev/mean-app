'use strict';

function CartUtilsFactory({ _ }) {
  const CartUtils = {};

  CartUtils.buildPromotionFilter = function buildPromotionFilter({ at = new Date(), shop, cart }) {
    const conditions = [
      { status: 1 },
      // { is_deleted: false },
      { start_date: { $lte: at } },
      { $or: [
        { end_date: { $gte: at } },
        { end_date: null }
      ]}
    ];
  
    // if (shop) {
    //   conditions.push({ orgid: shop.orgid });
    // }
  
    if (cart) {
      if (Array.isArray(cart.customer_group_ids) && cart.customer_group_ids.length > 0) {
        conditions.push({ $or: [
          { 'customer_groups': null },
          { 'customer_groups.id': { $in: cart.customer_group_ids } }
        ]});
      }
      else {
        conditions.push({ 'customer_groups': null });
      }
    
      if (cart.source_name) {
        conditions.push({ $or: [
          { 'source_names': null },
          { 'source_names.code': cart.source_name }
        ]});
      }
      else {
        conditions.push({ 'source_names.code': null });
      }
    
      if (cart.location_id) {
        conditions.push({ $or: [
          { 'location': null },
          { 'location.id': cart.location_id }
        ]});
      }
      else {
        conditions.push({ 'location': null });
      }
    }
  
    const filter = { $and: conditions };
  
    return filter;
  }
  
  CartUtils.postFilterPromotions = function postFilterPromotions({ promotions, filter }) {
    //...
    return promotions;
  }
  
  CartUtils.buildApplierGroups = function buildApplierGroups({ promotion_appliers, cart }) {
    return [promotion_appliers];
  }
  
  CartUtils.chooseBestCart = function chooseBestCart({ candidate_carts }) {
    const best_cart = candidate_carts[0];
    return { best_cart }
  }

  CartUtils.cloneLine = function cloneLine(line) {
    const new_line = _.cloneDeep(line);
    new_line._id = 0;

    return new_line;
  }

  CartUtils.cloneCart = function cloneCart(cart) {
    return _.cloneDeep(cart);
  }
  
  CartUtils.findPromotionApplierMatchCartCondition = function (context) {
    const result = {
      promotion_applier: null,
      promotion: null,
      applier: null,
      the_case: null
    };
  
    const { promotion_appliers, applied_cart } = context;
  
    const new_cart = CartUtils.cloneCart(applied_cart);
  
    for (let promotion_applier of promotion_appliers) {
      const { promotion, applier } = promotion_applier;

      const the_case = {
        promotion: promotion,
        cart: new_cart,
        data: {},
        applied_cart: null,
      };
  
      if (applier.matchCartCondition({ the_case, context })) { 
        result.promotion_applier = promotion_applier;    
        result.promotion = promotion;
        result.applier = applier;
        result.the_case = the_case;
        break;
      }
    }
  
    return result;
  }
  
  CartUtils.writeLog = function writeLog({ context, the_case, activity, data }) {
    context.log_index++;
    const log = { log_index: context.log_index, case_index: context.case_index, promotion: the_case.promotion.promotion_id, activity, data};
    context.logs.push(log);
    return log.log_index;
  }

  return CartUtils;
}

module.exports = { CartUtilsFactory };