'use strict';

const path = require('path');

module.exports = ({ OrderModel, ShopService }) => async function deleteOrder(data) {
  const result = {
    deletedOrder: null
  };

  let { shop, orgid, order_id, order } = data;

  if (!order_id && order) {
    order_id = order.id;
  }

  if (!order_id) { return result }

  shop = await ShopService.assertExists({ shop, orgid });

  const filter = { orgid: shop.orgid, id: order_id };
  const data_update = { is_deleted: true, deleted_at: new Date() };

  result.deletedOrder = await OrderModel.findOneAndUpdate(filter, { $set: data_update }, { new: true, lean: true });

  return result;
};

