'use strict';

module.exports = ({ PromotionElementModel }) => async function ({ shop, filter, fields, sort }) {
  let promotions = [];
  
  filter.orgid = shop.orgid;
  filter.is_deleted = PromotionElementModel.IS_NOT_DELETED;
  sort = sort || { created_at: -1 };

  promotions = await PromotionElementModel.find(filter, fields).sort(sort).lean(true);

  return promotions;
}