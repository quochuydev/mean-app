'use strict';

function ApplierFactory({ _, PromotionUtil, CartUtils, ApplierUtil, ProcessCart, _CONST }) {

  const applier = {
    code: 'BUY_X_GET_Y.ZV03.LINE_QUANTITY_FREE_ITEM.GIVE_BY.SAME_ITEM',
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
      is_same_lines: { type: 'boolean' },
      line_cart_match_line_buy: { type: 'object' },
      is_split_line_cart_match_line_buy: { type: 'boolean' },
      line_cart_match_line_buy_patches: [],
      line_cart_match_line_promotion: { type: 'object' },
      is_split_line_cart_match_line_promotion: { type: 'boolean' },
      line_cart_match_line_promotion_patches: [],
      new_line_buy: { type: 'object' },
      new_line_promotion: { type: 'object' },
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

              if (_.isEqual(line_buy_key, line_get_key)) {
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

      if (!(data.slots > 0)) {
        return the_case;
      }

      CartUtils.writeLog({ context, the_case, activity: 'apply_promotion', data: {
        line_buy: ProcessCart.LineKey.get({ line: data.line_cart_match_line_buy }),
        line_promotion: ProcessCart.LineKey.get({ line: data.line_cart_match_line_promotion }),
        slots: data.slots,
        total_promotion_value: data.total_promotion_value
      }});

      const lines_map = [];

      if (data.is_split_line_cart_match_line_buy) {
        const { new_lines } = ProcessCart.splitLine({
          context, the_case,
          line: data.line_cart_match_line_buy, 
          patches: data.line_cart_match_line_buy_patches 
        });

        [data.new_line_buy, data.new_line_promotion] = new_lines;
        lines_map.push({ from: data.line_cart_match_line_buy, to: new_lines });
      }
      else {
        data.new_line_buy = data.line_cart_match_line_buy;
      }

      if (data.is_split_line_cart_match_line_promotion) {
        const { new_lines } = ProcessCart.splitLine({
          context, the_case,
          line: data.line_cart_match_line_promotion, 
          patches: data.line_cart_match_line_promotion_patches 
        });

        data.new_line_promotion = new_lines[0];
        lines_map.push({ from: data.line_cart_match_line_promotion, to: new_lines });
      }
      else if (!data.is_same_lines){
        data.new_line_promotion = data.line_cart_match_line_promotion;
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
        map: lines_map
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
    const result = {
      is_valid: true,
      is_buy_not_enough_promotion_quantity: false,
      is_same_lines: false,
      is_split_line_cart_match_line_buy : false,
      is_split_line_cart_match_line_promotion : false,
      line_cart_match_line_buy_patches : [],
      line_cart_match_line_promotion_patches : [],
      old_quantity_buy_no_promotion : getQuantityBuyNoPromotion({ line: line_cart_match_line_buy }),
      ratio : line_buy.quantity_unit / line_promotion.quantity_unit,
      slots : 0,
      max_promotion_quantity: 0,
      used_promotion_quantity: 0,
      not_promotion_quantity: 0,
      quantity_buy_has_promotion: 0,
      quantity_buy_no_promotion: 0,
      total_promotion_value: 0
    };


    if (line_cart_match_line_buy === line_cart_match_line_promotion) {
      result.is_same_lines = true;

      let buy_promotion_quantity_unit = line_buy.quantity_unit + line_promotion.quantity_unit;
      result.slots = Math.floor(result.old_quantity_buy_no_promotion / buy_promotion_quantity_unit);

      if (result.slots > 0) {
        result.used_promotion_quantity = result.max_promotion_quantity = result.slots * line_promotion.quantity_unit;
        result.quantity_buy_has_promotion = result.slots * line_buy.quantity_unit;
        result.quantity_buy_no_promotion = result.old_quantity_buy_no_promotion - (result.quantity_buy_has_promotion + result.used_promotion_quantity);
        result.total_promotion_value = result.used_promotion_quantity * line_cart_match_line_buy.price;
        result.is_split_line_cart_match_line_buy = true;
        result.line_cart_match_line_buy_patches = [
          line_cart_match_line_buy.quantity - result.used_promotion_quantity, 
          result.used_promotion_quantity
        ];
      }
    }
    else {
      result.max_promotion_quantity = Math.floor(result.old_quantity_buy_no_promotion / result.ratio);
      if (!(line_cart_match_line_promotion.quantity >= result.max_promotion_quantity)) {
        result.is_buy_not_enough_promotion_quantity = true;
        result.is_valid = false;
        return result;
      }
      result.used_promotion_quantity = Math.min(result.max_promotion_quantity, line_cart_match_line_promotion.quantity);
      result.not_promotion_quantity = line_cart_match_line_promotion.quantity - result.used_promotion_quantity;
      result.slots = (result.used_promotion_quantity / line_promotion.quantity_unit);
      result.quantity_buy_has_promotion = result.slots * line_buy.quantity_unit;
      result.quantity_buy_no_promotion = result.old_quantity_buy_no_promotion - result.quantity_buy_has_promotion;
      result.total_promotion_value = line_cart_match_line_promotion.price * result.used_promotion_quantity;
      if (result.not_promotion_quantity > 0) {
        result.is_split_line_cart_match_line_promotion = true;
        result.line_cart_match_line_promotion_patches = [result.used_promotion_quantity, line_cart_match_line_promotion.quantity - result.used_promotion_quantity];
      }
    }

    return result;
  }

  function addProcessingDataToLineCart({ data }) {
    ProcessCart.ProcessingData.Line.set({ line: data.new_line_buy, key: 'quantity_buy_no_promotion', value: data.quantity_buy_no_promotion })
  }
}

module.exports = ApplierFactory;