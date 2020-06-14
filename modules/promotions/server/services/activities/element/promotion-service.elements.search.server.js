'use strict';

module.exports = ({ _do, PromotionElementModel }) => async function ({ shop, query, is_get_all = false }) {
  const result = {
    total: 0,
    items: []
  };
  
  let { filter, fields, skip, limit, sort = { created_at: -1 } } = _do.parseQuery({ query });
  filter.orgid = shop.orgid;
  filter.is_deleted = PromotionElementModel.IS_NOT_DELETED;

  const total = await PromotionElementModel.count(filter);

  if (total > 0) {
    result.total = total;
    if (is_get_all) {
      result.items = await PromotionElementModel.find(filter, fields).sort(sort).lean(true);
    }
    else {
      result.items = await PromotionElementModel.find(filter, fields).skip(skip).limit(limit).sort(sort).lean(true);
    }
  }

  return result;
}