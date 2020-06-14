'use strict';

const path = require('path');
const { ERR_ENTRY_NOT_FOUND } = require(path.resolve('./modules/core/server/libs/errors.server.lib.js'));

module.exports = ({ OrderService, OrderModel, ShopService, API }) => async function writeOrder(data) {
  const result = {
    wroteOrder: null
  };

  let { shop, orgid, order, retry_count, isGetOrderSeller, isCheckExists = true } = data;

  if (!(order && order.id)) { return result }

  shop = await ShopService.assertExists({ shop, orgid });

  if (retry_count > 0 || isGetOrderSeller) {
    let [error, order_seller] = await to(API.call(API.OMNI.ORDERS.GET, { shop, order_id: order.id, maxRetry : 3 }));
    if (error) {
      if (error.code === ERR_ENTRY_NOT_FOUND.CODE) {
        return result;
      }
      throw error;
    }
    if (!order_seller) {
      return result;
    }
    order = order_seller;
  }

  const order_data = OrderService.makeDataWrite({ shop, order_seller: order });

  if (isCheckExists) {
    let existsOrder = await OrderModel.findOne({ id: order.id, orgid : shop.orgid }).lean(true);

    if (existsOrder) {
      order.updated_at = new Date(order.updated_at);
      if (!(order.updated_at >= existsOrder.updated_at)) {
        return result;
      }

      if (existsOrder.is_deleted) {
        order.is_deleted = existsOrder.is_deleted;
        order.deleted_at = existsOrder.deleted_at;
      }
    }
  }

  result.wroteOrder = await OrderModel.findOneAndUpdate(
    { id: order.id, orgid : shop.orgid },
    { $set: order_data },
    { new: true, lean : true, upsert : true, setDefaultsOnInsert : true }
  );

  if (!result.wroteOrder) { return result }

  return result;
}

