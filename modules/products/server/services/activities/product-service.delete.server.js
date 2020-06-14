'use strict';

const path = require('path');

module.exports = ({ ProductModel, ShopService }) => async function deleteProduct(data) {
  const result = {
    deletedProduct: null
  };

  let { shop, orgid, product_id, product } = data;

  if (!product_id && product) {
    product_id = product.id;
  }

  if (!product_id) { return result }

  shop = await ShopService.assertExists({ shop, orgid });

  const filter = { orgid: shop.orgid, id: product_id };
  const data_update = { is_deleted: true, deleted_at: new Date() };

  result.deletedProduct = await ProductModel.findOneAndUpdate(filter, { $set: data_update }, { new: true, lean: true });

  return result;
};

