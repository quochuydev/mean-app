'use strict';

module.exports = ({ _, SIG_FINISH, CartUtils }) => function applyPromotion({ shop, cart, promotion_appliers, max_cases = 1000 }) {
  const context = {
    shop: shop,
    origin_cart: cart,
    applied_cart: cart,
    promotion_appliers: promotion_appliers,
    case_index: 0,
    log_index: 0,
    logs: [],
    cases: [],
    shared_data: {}
  };

  try {
    for (let i = 1; i <= max_cases; i++) {
      const { promotion_applier, applier, the_case } = CartUtils.findPromotionApplierMatchCartCondition(context);

      if (!promotion_applier) {
        throw new SIG_FINISH();
      }

      context.case_index++;

      const { applied_cart } = applier.applyPromotion({ context, the_case });

      context.applied_cart = applied_cart;

      if (applier.apply_once) {
        context.promotion_appliers = context.promotion_appliers.filter(item => item !== promotion_applier);
      }

      context.cases.push(the_case);
    }
  }
  catch (signal) {
    if (signal.code !== SIG_FINISH.CODE) {
      signal.apply_promotions_context = context;
      throw signal;
    }
  }

  return context;
}