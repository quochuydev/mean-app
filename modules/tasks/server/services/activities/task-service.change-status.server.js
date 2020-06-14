'use strict';

const path = require('path');

module.exports = ({ PromotionModel, PromotionElementModel }) => async function (data) {
  let { body, orgid, promotionId } = data;
  let criteria = { _id: promotionId, orgid };
  let data_update = { status: body.status };
  let promotion = await PromotionModel.findOneAndUpdate(criteria, { $set: data_update }, { lean: true, new: true });

  await PromotionElementModel.update({ promotion_id: promotionId, orgid }, { $set: data_update }, { multi: true });

  const result = { promotion };

  return result;
}