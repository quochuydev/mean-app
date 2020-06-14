'use strict';

module.exports = ({ PromotionModel, MSG, PromotionElementModel }) => async function (data) {
  const { orgid, params } = data;

  const result = {
    item: null
  };
  let { promotionId } = params;
  let filter = { _id: promotionId, orgid }
  let data_delete = { is_deleted: PromotionModel.IS_DELETED, updated_at: new Date() };

  let promotion_found = await PromotionModel.findOne(filter, { start_date: 1 }).lean(true);

  if (promotion_found.start_date <= new Date()) { throw { message: MSG('ME-00015') }; }

  result.item = await PromotionModel.findOneAndUpdate(filter, { $set: data_delete }, { lean: true, new: true });

  await PromotionElementModel.update({ promotion_id: promotionId, orgid }, { $set: data_delete }, { multi: true });

  console.log(result);
  return result;
}