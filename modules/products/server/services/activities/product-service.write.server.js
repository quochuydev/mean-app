'use strict';

const path = require('path');
const { ERR_ENTRY_NOT_FOUND } = require(path.resolve('./modules/core/server/libs/errors.server.lib.js'));

module.exports = ({ ProductService, ProductModel, ShopService, API }) => async function writeProduct(data) {
  const result = {
    wroteProduct: null
  };

  let { shop, orgid, product, retry_count, isGetProductSeller, isCheckExists = true } = data;

  if (!(product && product.id)) { return result }

  shop = await ShopService.assertExists({ shop, orgid });

  if (retry_count > 0 || isGetProductSeller) {
    let [error, product_seller] = await to(API.call(API.OMNI.PRODUCTS.GET, { shop, product_id: product.id, maxRetry : 3 }));
    if (error) {
      if (error.code === ERR_ENTRY_NOT_FOUND.CODE) {
        return result;
      }
      throw error;
    }
    if (!product_seller) {
      return result;
    }
    product = product_seller;
  }

  const product_data = ProductService.makeDataWrite({ shop, product_seller: product });

  if (isCheckExists) {
    let existsProduct = await ProductModel.findOne({ id: product.id, orgid : shop.orgid }).lean(true);

    if (existsProduct) {
      product.updated_at = new Date(product.updated_at);
      if (!(product.updated_at >= existsProduct.updated_at)) {
        return result;
      }

      if (existsProduct.is_deleted) {
        product.is_deleted = existsProduct.is_deleted;
        product.deleted_at = existsProduct.deleted_at;
      }
    }
  }

  result.wroteProduct = await ProductModel.findOneAndUpdate(
    { id: product.id, orgid : shop.orgid },
    { $set: product_data },
    { new: true, lean : true, upsert : true, setDefaultsOnInsert : true }
  );

  if (!result.wroteProduct) { return result }

  return result;
}

