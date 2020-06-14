'use strict';

function ApplierFactory({ _, PromotionUtil, CartUtils, ApplierUtil, ProcessCart, _CONST }) {

  const applier = {
    code: 'BUY_X_GET_Y.ZV03.LINE_QUANTITY_FREE_ITEM.GIVE_BY',
    shared_data_schema: {
      promotion: {
        line_buy: {
          entity: { type: 'string', enum: ['product', 'variant'] },
          title: { type: 'string' },
          key_name: { type: 'string' },
          key: { type: 'number' },
          product_id: { type: 'number' }, 
          variant_id: { type: 'number' }, 
          quantity_unit: { type: 'number' }
        },
        line_promotion: {
          entity: { type: 'string', enum: ['product', 'variant'] },
          title: { type: 'string' },
          key_name: { type: 'string' },
          key: { type: 'number' },
          product_id: { type: 'number' },
          variant_id: { type: 'number' }, 
          quantity_unit: { type: 'number' },
          promotion_type: { type: 'string' },
          promotion_value: { type: 'number' },
        }
      }
    },
    data_schema: {
      list_line_cart_match_line_buy: [],
      list_line_cart_match_line_promotion: [],
      list_pair_line_cart_buy_and_line_cart_promotion: [],
      line_cart_match_line_buy: { type: 'object' },
      line_cart_match_line_promotion: { type: 'object' },
      new_line_promotion: { type: 'object' },
      new_line_no_promotion: { type: 'object' },
      quantity_buy_has_promotion: { type: 'number' },
      quantity_buy_no_promotion: { type: 'number' },
      max_promotion_quantity: { type: 'number' },
      used_promotion_quantity: { type: 'number' },
      not_promotion_quantity: { type: 'number' },
      slots: { type: 'number' },
      total_promotion_value: { type: 'number' },
    },
    apply_once: true,
    priority: 1,
    isMatchPromotion({ promotion }) {
      if (promotion.type === _CONST.PROMOTION.TYPE.BUYX_GETY) {
        if (Array.isArray(promotion.promotion_products) && promotion.promotion_products.length === 2) {
          const line_buy = promotion.promotion_products.find(line => line.is_main === true);
          
          if (line_buy) {
            const line_get = promotion.promotion_products.find(line => line.is_main === false);

            if (line_get) {
              const line_buy_key = PromotionUtil.getItemKey({ item: line_buy });
              const line_get_key = PromotionUtil.getItemKey({ item: line_get });

              if (!_.isEqual(line_buy_key, line_get_key)) {
                return true;
              }
            }
          }
        }
      }

      return false;
    },
    matchPromotion({ promotion }) {
      if (promotion.case) {
        return promotion.case === applier.code;
      }
      return applier.isMatchPromotion({ promotion });
    },
    matchCartCondition({ the_case, context }){
      const { cart, data } = the_case;

      const { line_buy } = ApplierUtil.ZV03.assertPromotionInfos({ the_case, context });

      data.list_line_cart_match_line_buy = findLineCartMatchLineBuy({ data, cart, line_buy });

      if (Array.isArray(data.list_line_cart_match_line_buy) && data.list_line_cart_match_line_buy.length > 0) {
        return true;
      }

      return false;
    },
    applyPromotion({ the_case, context }) {
      const { cart, promotion, data } = the_case;

      the_case.applied_cart = cart;

      const { line_buy, line_promotion } = ApplierUtil.ZV03.assertPromotionInfos({ the_case, context });

      data.list_line_cart_match_line_promotion = listLineCartMatchLinePromotion({ data, cart, line_promotion });
      if (!(Array.isArray(data.list_line_cart_match_line_promotion) && data.list_line_cart_match_line_promotion.length > 0)) {
        return the_case;
      }

      data.list_pair_line_cart_buy_and_line_cart_promotion = generatePairLineCartBuyAndLineCartPromotion({
        line_buy, line_promotion,
        list_line_cart_match_line_buy: data.list_line_cart_match_line_buy,
        list_line_cart_match_line_promotion: data.list_line_cart_match_line_promotion
      });

      const bestPairLine = chooseBestPairLineCartBuyAndLineCartPromotion({ candidates: data.list_pair_line_cart_buy_and_line_cart_promotion });

      if (!bestPairLine) {
        return the_case;
      }

      data.line_cart_match_line_buy = bestPairLine.line_cart_match_line_buy;
      data.line_cart_match_line_promotion = bestPairLine.line_cart_match_line_promotion;
      Object.assign(data, bestPairLine.infos);

      CartUtils.writeLog({ context, the_case, activity: 'apply_promotion', data: {
        line_buy: ProcessCart.LineKey.get({ line: data.line_cart_match_line_buy }),
        line_promotion: ProcessCart.LineKey.get({ line: data.line_cart_match_line_promotion }),
        slots: data.slots,
        total_promotion_value: data.total_promotion_value
      }});

      if (data.not_promotion_quantity === 0) {
        data.new_line_promotion = data.line_cart_match_line_promotion;
      }
      else {
        const { new_lines } = ProcessCart.splitLine({
          context, the_case,
          line: data.line_cart_match_line_promotion, 
          patches: [data.used_promotion_quantity, data.not_promotion_quantity] 
        });

        [data.new_line_promotion, data.new_line_no_promotion] = new_lines;
      }

      addProcessingDataToLineCart(the_case);
      ProcessCart.applyLinePromotion({ context, the_case, line: data.new_line_promotion, type: line_promotion.promotion_type, value: line_promotion.promotion_value });
      ProcessCart.setLineProperty({ context, the_case, line: data.new_line_promotion, key: 'BuyXGetY', value: `${promotion.promotion_id}-${promotion._id}` });
      ProcessCart.setLinePromotionRef({ context, the_case, line: data.new_line_promotion, value: promotion.promotion_id });
      ProcessCart.setLinePromotionBuyProductId({ context, the_case, line: data.new_line_promotion, product_id: line_buy.product_id, variant_ids: [line_buy.variant_id] });

      const attribute = ApplierUtil.ZV03.createPromotionAttribute({ promotion_type: line_promotion.promotion_type, line_buy: line_buy, line_promotion: line_promotion });
      ProcessCart.setAttribute({
        context, the_case,
        cart: the_case.applied_cart,
        key: attribute.key,
        value: attribute.value
      });

      const { new_cart } = ProcessCart.mapLines({
        context, the_case,
        cart: the_case.applied_cart,
        map: [
          { from: data.line_cart_match_line_promotion, to: [data.new_line_promotion, data.new_line_no_promotion] }
        ]
      });

      the_case.applied_cart = new_cart;

      return the_case;
    }
  }

  return applier;

  function findLineCartMatchLineBuy({ cart, line_buy }) {
    const list_line_cart_match_line_buy = cart.items.filter(line => {
      if (!ApplierUtil.ZV03.canBeLineBuy({ line, line_buy })) {
        return false;
      }
      if (Number(line[line_buy.key_name]) === Number(line_buy.key)) {
        const quantity_buy_no_promotion = getQuantityBuyNoPromotion({ line });
        if (quantity_buy_no_promotion > 0 && quantity_buy_no_promotion >= line_buy.quantity_unit) {
          return true;
        }
      }
      return false;
    });

    return list_line_cart_match_line_buy;
  }

  function getQuantityBuyNoPromotion({ line }) {
    let quantity_buy_no_promotion = ProcessCart.ProcessingData.Line.get({ line, key: 'quantity_buy_no_promotion' });
    if (!(quantity_buy_no_promotion >= 0)) {
      quantity_buy_no_promotion = line.quantity;
    }
    return quantity_buy_no_promotion;
  }

  function listLineCartMatchLinePromotion({ cart, line_promotion }) {
    const list_line_cart_match_line_promotion = cart.items.filter(item => {
      if (!ApplierUtil.ZV03.canBeLinePromotion({ line: item })) {
        return false;
      }
      return Number(item[line_promotion.key_name]) === Number(line_promotion.key);
    });

    return list_line_cart_match_line_promotion;
  }

  function generatePairLineCartBuyAndLineCartPromotion({ line_buy, line_promotion, list_line_cart_match_line_buy, list_line_cart_match_line_promotion }) {
    const list_pair_lines = [];

    for (let line_cart_match_line_buy of list_line_cart_match_line_buy) {
      for (let line_cart_match_line_promotion of list_line_cart_match_line_promotion) {
        const infos = calculateAppliedPromotionInfos({ line_buy, line_promotion, line_cart_match_line_buy, line_cart_match_line_promotion });
        if (infos.is_valid) {
          list_pair_lines.push({
            line_cart_match_line_buy,
            line_cart_match_line_promotion,
            infos: infos
          })        
        }
      }
    }

    return list_pair_lines;
  }

  function chooseBestPairLineCartBuyAndLineCartPromotion({ candidates }) {
    const sorted_candidates = _.orderBy(
      candidates, 
      ['infos.total_promotion_value', 'infos.slots', 'infos.not_promotion_quantity', 'infos.quantity_buy_no_promotion'], 
      ['desc', 'asc', 'asc']
    );

    return sorted_candidates[0];
  }

  function calculateAppliedPromotionInfos({ line_buy, line_promotion, line_cart_match_line_buy, line_cart_match_line_promotion }) {
    const old_quantity_buy_no_promotion = getQuantityBuyNoPromotion({ line: line_cart_match_line_buy });
    const ratio = line_buy.quantity_unit / line_promotion.quantity_unit;
    const max_promotion_quantity = Math.floor(old_quantity_buy_no_promotion / ratio);
    const used_promotion_quantity = Math.min(max_promotion_quantity, line_cart_match_line_promotion.quantity);
    const not_promotion_quantity = line_cart_match_line_promotion.quantity - used_promotion_quantity;
    const slots = (used_promotion_quantity / line_promotion.quantity_unit);
    const quantity_buy_has_promotion = slots * line_buy.quantity_unit;
    const quantity_buy_no_promotion = old_quantity_buy_no_promotion - quantity_buy_has_promotion;
    const total_promotion_value = line_cart_match_line_promotion.price * used_promotion_quantity;
    const is_buy_not_enough_promotion_quantity = !(line_cart_match_line_promotion.quantity >= max_promotion_quantity);
    const is_valid = !is_buy_not_enough_promotion_quantity;

    return {
      is_valid, is_buy_not_enough_promotion_quantity,
      ratio, max_promotion_quantity, used_promotion_quantity, 
      not_promotion_quantity, slots, total_promotion_value,
      quantity_buy_has_promotion, quantity_buy_no_promotion,
      old_quantity_buy_no_promotion
    };
  }

  function addProcessingDataToLineCart({ data }) {
    ProcessCart.ProcessingData.Line.set({ line: data.line_cart_match_line_buy, key: 'quantity_buy_no_promotion', value: data.quantity_buy_no_promotion })
  }
}

module.exports = ApplierFactory;