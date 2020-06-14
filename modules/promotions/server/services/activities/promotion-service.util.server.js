/**
 * const PromotionUtil = require(path.resolve('./modules/promotions/server/services/promotion-service.util.server'));
 */

const path = require('path');
const PromotionUtil = require(path.resolve('./modules/core/share/lib/PromotionUtil.lib.share'));

PromotionUtil.mapToServerElementsModel = function (promotion_server) {
  const found_promotion_mapping = PromotionUtil.ListPromotionMappings.find(item => item.matchServerModel({ promotion_server }));

  if (!found_promotion_mapping) {
    throw new Error('ERR_PROMOTION_MAPPING_NOT_FOUND : ', JSON.stringify(promotion_server));
  }

  return found_promotion_mapping.mapToServerElementsModel({ promotion_server });
}

PromotionUtil.PromotionMappings['BUYX_GETY.ZV03'].mapToServerElementsModel = ({ promotion_server }) => {
  let promotion = { ...promotion_server };
  let { _id, promotion_products } = { ...promotion };
  delete promotion._id;

  let condition_item = null;
  let promotion_items = [];
  let promotion_elements = [];

  for (let i = 0; i < promotion_products.length; i++) {
    let promotion_product = promotion_products[i];
    if (!promotion_product.is_main) {
      promotion_items.push({ ...promotion_product });
    }
    else {
      condition_item = { ...promotion_product };
    }
  }

  for (let i = 0; i < promotion_items.length; i++) {
    let promotion_item = promotion_items[i];
    for (let j = 0; j < promotion_item.variants.length; j++) {
      let promotion_item_variant = promotion_item.variants[j];
      let promotion_element_products = [condition_item, { ...promotion_item, variants: [promotion_item_variant] }];
      let new_promotion_element = { promotion_id: _id, ...promotion, promotion_products: promotion_element_products };
      promotion_elements.push(new_promotion_element);
    }
  }

  return promotion_elements;
}

module.exports = PromotionUtil;