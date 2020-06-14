'use strict';

const path = require('path');

module.exports = ({ PromotionModel }) => async function (data) {
  const { orgid, params } = data;

  const result = {
    item: null
  };

  const { promotionId } = params;

  let filter = { _id: promotionId, orgid }

  result.item = await PromotionModel.findOne(filter).lean(true);

  return result;
}