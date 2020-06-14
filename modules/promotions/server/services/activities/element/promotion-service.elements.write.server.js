'use strict';

module.exports = ({ Applier, PromotionElementModel, PromotionUtil }) => async function ({ promotion }) {
  const result = {
    total: 0,
    promotion_elements: []
  };

  let promotion_elements = PromotionUtil.mapToServerElementsModel(promotion);

  for (let i = 0; i < promotion_elements.length; i++) {
    let promotion_element = promotion_elements[i];

    promotion_element.case = Applier.detectCase({ promotion: promotion_element });

    let new_promotion_element = (await PromotionElementModel.create(promotion_element)).toJSON();
    if (new_promotion_element && new_promotion_element._id) {
      result.promotion_elements.push(new_promotion_element);
    }
  }
  
  result.total = result.promotion_elements.length;
  return result;
}