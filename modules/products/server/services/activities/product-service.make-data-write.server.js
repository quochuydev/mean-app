'use strict';

module.exports = ({ }) => function makeDataWrite({ shop, product_seller }) {
  const data = {
    ...product_seller,
    shop: shop._id,
    orgid: shop.orgid,
  };

  if (product_seller.session_sync_id) {
    data.session_sync_id = product_seller.session_sync_id;
  }


  return data;
}
