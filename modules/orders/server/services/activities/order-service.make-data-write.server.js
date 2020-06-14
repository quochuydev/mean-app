'use strict';

module.exports = ({ }) => function makeDataWrite({ shop, order_seller }) {
  const data = {
    ...order_seller,
    shop: shop._id,
    orgid: shop.orgid,
  };

  if (order_seller.session_sync_id) {
    data.session_sync_id = order_seller.session_sync_id;
  }


  return data;
}
