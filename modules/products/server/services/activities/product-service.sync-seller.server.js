'use strict';

const _ = require('lodash');
const path = require('path');
const _CONST = require(path.resolve('./modules/core/share/lib/_CONST.lib.share'));
const { to } = require(path.resolve('./modules/core/server/libs/common.server.lib'));
const { ERR, SIG_FINISH } = require(path.resolve('./modules/core/server/libs/errors.server.lib.js'));

module.exports = ({ ProductService, ProductModel, RabbitMQ, ShopService, API, config }) => async function syncProduct (data) {
  let { shop, orgid, query, isDeleteOtherProduct = true } = data;

  let result = { 
    write : {
      ok : 0,
      fail_ids : [],
      fail_pages : []
    },
    delete : {
      ok : 0,
      fail_ids : []
    }
  };

  try {
    shop = await ShopService.assertExists({ shop, orgid });

    const seller_product_cursor = await ProductService.scrollSeller({ shop, query });

    const session_sync_id = Date.now();

    await seller_product_cursor.eachAsync(async product => {
      product.session_sync_id = session_sync_id;
      const [error, writeResult] = await to(ProductService.write({ shop, product, isCheckExists : false }));
      if (!error && writeResult && writeResult.wroteProduct) {
        result.write.ok++;
      }
      else {
        result.write.fail_ids.push(product.id);
      }
    });

    if (Array.isArray(seller_product_cursor.failedPages) && seller_product_cursor.failedPages.length > 0) {
      result.write.fail_pages = seller_product_cursor.failedPages;

      ERR.log({ code : 'PRODUCT_SERVICE.SELLER.SYNC_ALL.FAILED_PAGES', failed_pages : seller_product_cursor.failedPages });

      // throw new SIG_FINISH();
    }

    if (isDeleteOtherProduct) {
      const filter = { orgid : shop.orgid, session_sync_id : { $ne : session_sync_id }};

      if (result.write.fail_ids.length > 0) {
        filter.id = { $nin : result.write.fail_ids };
      }
  
      const mongo_product_cursor = ProductModel
      .find(filter)
      .lean(true)
      .cursor({ batchSize : 100 });
  
      await mongo_product_cursor.eachAsync(async product => {
        const [error] = await to (ProductService.delete({ shop, product }));
        if (error) {
          result.delete.fail_ids.push(product.id);
        }
        else {
          result.delete.ok++;
        }
      });
    }

    throw new SIG_FINISH();
  }
  catch (signal) {
    if (signal.code === SIG_FINISH.CODE) {
      result = _.merge(result, signal.result);
      let hasItemFail = result.write.fail_ids.length || result.write.fail_pages.length || result.delete.fail_ids.length;
      if (hasItemFail) {
        result.status = _CONST.PROCESS.STATUS.FAILED;
      }
      else {
        result.status = _CONST.PROCESS.STATUS.FINISHED;
      }
      return result;
    }
    else {
      signal.result = result;
      throw signal;
    }
  }
}