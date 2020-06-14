'use strict';

module.exports = ({ _, PromotionService, CartService, CartUtils, ProcessCart, SIG_FINISH }) => async function calculateCart({ shop, cart, promotions }) {

  const context = {
    shop: shop,
    cart: CartUtils.cloneCart(cart),
    promotion_filter: {},
    promotions: [],
    promotion_appliers: [],
    promotion_appliers_groups: [],
    apply_contexts: [],
    best_apply_context: {},
    candidate_carts: [],
    calculated_cart: null
  };

  try {
    context.cart = ProcessCart.clearPromotionData({ cart: context.cart });
    context.calculated_cart = context.cart;

    if (Array.isArray(promotions)) {
      context.promotions = promotions;
    }
    else {
      context.promotion_filter = CartUtils.buildPromotionFilter({ shop, cart });

      context.promotions = await PromotionService.Element.list({ shop, filter: context.promotion_filter });
  
      context.promotions = CartUtils.postFilterPromotions({ promotions: context.promotions, filter: context.promotion_filter });  
    }

    if (!(Array.isArray(context.promotions) && context.promotions.length > 0)) {
      throw new SIG_FINISH();
    }

    for (let promotion of context.promotions) {
      const applier = CartService.Applier.assertOne({ promotion });
      context.promotion_appliers.push({ applier, promotion });
    }

    context.cart = ProcessCart.mergeSameLines({ cart: context.cart });
    context.cart = ProcessCart.addProcessingData({ cart: context.cart });

    context.promotion_appliers_groups = CartUtils.buildApplierGroups({ promotion_appliers: context.promotion_appliers, cart: context.cart });

    for (let promotion_appliers of context.promotion_appliers_groups) {
      const apply_context = CartService.applyPromotions({
        cart: CartUtils.cloneCart(context.cart),
        promotion_appliers: promotion_appliers
      });

      context.apply_contexts.push(apply_context);

      if (apply_context.applied_cart) {
        context.candidate_carts.push(apply_context.applied_cart);
      }
    }

    const { best_cart } = CartUtils.chooseBestCart({ candidate_carts: context.candidate_carts });

    context.best_apply_context = context.apply_contexts.find(item => item.applied_cart === best_cart);
    context.calculated_cart = best_cart;

    context.calculated_cart = ProcessCart.removeProcessingData({ cart: context.calculated_cart });

    throw new SIG_FINISH();
  }
  catch (signal) {
    if (signal.code !== SIG_FINISH.CODE) {
      signal.calculate_cart_context = context;
      throw signal;
    }
  }

  return context;
}