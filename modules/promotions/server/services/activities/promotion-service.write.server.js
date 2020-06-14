'use strict';

module.exports = ({ PromotionModel, PromotionService, MSG }) => async function writePromotion(data) {
  let { body, user, shop, orgid } = data;
  let new_promotion = { shop, orgid, ...body, user_created: user.id }
  let { code, name } = new_promotion;
  if (!(code && name)) { throw { message: MSG('ME-00005') } };
  let promotion = (await PromotionModel.create(new_promotion)).toJSON();
  if (!(promotion && promotion._id)) { throw { message: 'Đã có lỗi xảy ra!' } };
  let { promotion_elements } = await PromotionService.Element.write({ promotion });
  let result = { promotion, promotion_elements };
  return result;
}