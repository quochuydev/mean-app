'use strict';

function ApplierUtilFactory(DI) {
  const ApplierUtil = {};

  ApplierUtil.ZV03 = ApplierUtilZV03Factory(DI);

  return ApplierUtil;
}

function ApplierUtilZV03Factory({ _, joinS, ERR, _CONST }) {
  const ApplierUtilZV03 = {
    assertPromotionInfos,
    createPromotionAttribute,
    assertLineBuy,
    assertLinePromotion,
    canBeLinePromotion,
    canBeLineBuy,
  };

  function assertPromotionInfos({ the_case, context }) {
    let promotion_infos = null;

    const { promotion } = the_case;

    if (!context.shared_data.promotions) {
      context.shared_data.promotions = {};
    }

    promotion_infos = context.shared_data.promotions[promotion._id];

    if (promotion_infos) {
      return promotion_infos;
    }

    promotion_infos = {};

    promotion_infos.line_buy = assertLineBuy({ promotion });
    promotion_infos.line_promotion = assertLinePromotion({ promotion });

    context.shared_data.promotions[promotion._id] = promotion_infos;

    return promotion_infos;
  }

  function createPromotionAttribute({ promotion_type, line_buy, line_promotion }) {
    const result = { key: '', value: '' };

    const promotion_type_text = (promotion_type === _CONST.PROMOTION.DISCOUNT_TYPE.GIFT) ? 'tặng' : 'giảm';

    result.key = `Mua X Tặng Y mua ${line_buy.quantity_unit} ${line_buy.product_id} ${promotion_type_text} ${line_promotion.quantity_unit} ${line_promotion.product_id}`, 
    result.value = `Mua ${line_buy.quantity_unit} ${line_buy.title} ${promotion_type_text} ${line_promotion.quantity_unit} ${line_promotion.title}`;

    return result;
  }

  function assertLineBuy({ promotion }) {
    let line_buy = null;

    if (Array.isArray(promotion.promotion_products) && promotion.promotion_products.length > 0) {
      const product_buy = promotion.promotion_products.find(item => item.is_main === true);
      if (product_buy) {

        line_buy = {
          entity: null,
          title: null,
          key_name: null,
          key: null,
          product_id: null,
          variant_id: null, 
          quantity_unit: null,
          promotion_type: null,
          promotion_value: null,
        };

        if (product_buy.apply_resource === _CONST.PROMOTION.APPLY_RESOURCE.PRODUCT) {
          const rule = product_buy.rule[0];

          line_buy.entity = 'product';
          line_buy.title = product_buy.product_name;
          line_buy.key_name = 'product_id';
          line_buy.key = product_buy.product_id;
          line_buy.product_id = product_buy.product_id;
          line_buy.quantity_unit = product_buy.rule[0].quantity;
          line_buy.promotion_type = rule.promotion_type;
          line_buy.promotion_value = rule.promotion_value;
        }
        else if (product_buy.apply_resource === _CONST.PROMOTION.APPLY_RESOURCE.VARIANT) {
          const variant_buy = product_buy.variants[0];
          const rule = variant_buy.rule[0];

          line_buy.entity = 'variant';
          line_buy.title = joinS([ product_buy.product_name, variant_buy.title ], ' - ');
          line_buy.key_name = 'variant_id';
          line_buy.key = variant_buy.variant_id;
          line_buy.product_id = product_buy.product_id;
          line_buy.variant_id = variant_buy.variant_id;
          line_buy.quantity_unit = rule.quantity;
          line_buy.promotion_type = rule.promotion_type;
          line_buy.promotion_value = rule.promotion_value;
        }
      }
    }

    if (!line_buy) {
      throw new ERR({ code: 'INVALID_PROMOTION_LINE_BUY', promotion });
    }

    return line_buy;
  }
  
  function assertLinePromotion({ promotion }) {
    let line_promotion = null;

    if (Array.isArray(promotion.promotion_products) && promotion.promotion_products.length > 0) {
      const product_buy = promotion.promotion_products.find(item => item.is_main === false);
      if (product_buy) {

        line_promotion = {
          entity: null,
          title: null,
          key_name: null,
          key: null,
          product_id: null,
          variant_id: null, 
          quantity_unit: null,
          promotion_type: null,
          promotion_value: null,
        };

        if (product_buy.apply_resource === 1) {
          const rule = product_buy.rule[0];

          line_promotion.entity = 'product';
          line_promotion.title = product_buy.product_name;
          line_promotion.key_name = 'product_id';
          line_promotion.key = product_buy.product_id;
          line_promotion.product_id = product_buy.product_id;
          line_promotion.quantity_unit = rule.quantity_apply;
          line_promotion.promotion_type = rule.promotion_type;
          line_promotion.promotion_value = rule.promotion_value;
        }
        else if (product_buy.apply_resource === 2) {
          const variant_buy = product_buy.variants[0];
          const rule = variant_buy.rule[0];

          line_promotion.entity = 'variant';
          line_promotion.title = joinS([ product_buy.product_name, variant_buy.title ], ' - ');
          line_promotion.key_name = 'variant_id';
          line_promotion.key = variant_buy.variant_id;
          line_promotion.product_id = product_buy.product_id;
          line_promotion.variant_id = variant_buy.variant_id;
          line_promotion.quantity_unit = rule.quantity_apply;
          line_promotion.promotion_type = rule.promotion_type;
          line_promotion.promotion_value = rule.promotion_value;
        }
      }
    }

    if (!line_promotion) {
      throw new ERR({ code: 'INVALID_PROMOTION_LINE_BUY', promotion });
    }

    return line_promotion;
  }

  function canBeLineBuy({ line }) {
    if (line.not_allow_promotion) {
      return false;
    }

    const has_promotion = line.PromotionRef;
    
    if (has_promotion) {
      return false;
    }
    if (line.price_original === 0) {
      return false;
    }
    if (line.price === 0) {
      return false;
    }
    return true;
  }

  function canBeLinePromotion({ line }) {
    if (line.not_allow_promotion) {
      return false;
    }

    const has_promotion = line.PromotionRef;
    
    if (has_promotion) {
      return false;
    }
    if (line.price_original === 0) {
      return true;
    }
    if (line.price === 0) {
      return false;
    }
    return true;
  }

  return ApplierUtilZV03;
}



module.exports = { ApplierUtilFactory };