'use strict';

const _ = require('lodash');
const path = require('path');
const _CONST = require(path.resolve('./modules/core/share/lib/_CONST.lib.share'));
const { to } = require(path.resolve('./modules/core/server/libs/common.server.lib'));
const { ERR, SIG_FINISH } = require(path.resolve('./modules/core/server/libs/errors.server.lib.js'));

module.exports = ({ OrderService, OrderModel, RabbitMQ, ShopService, API, config }) => async function syncOrder (data) {
  let { shop, orgid, query, isDeleteOtherOrder = true } = data;

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

    const seller_order_cursor = await OrderService.scrollSeller({ shop, query });

    const session_sync_id = Date.now();

    await seller_order_cursor.eachAsync(async order => {
      order.session_sync_id = session_sync_id;
      const [error, writeResult] = await to(OrderService.write({ shop, order, isCheckExists : false }));
      if (!error && writeResult && writeResult.wroteOrder) {
        result.write.ok++;
      }
      else {
        result.write.fail_ids.push(order.id);
      }
    });

    if (Array.isArray(seller_order_cursor.failedPages) && seller_order_cursor.failedPages.length > 0) {
      result.write.fail_pages = seller_order_cursor.failedPages;

      ERR.log({ code : 'ORDER_SERVICE.SELLER.SYNC_ALL.FAILED_PAGES', failed_pages : seller_order_cursor.failedPages });

      // throw new SIG_FINISH();
    }

    if (isDeleteOtherOrder) {
      const filter = { orgid : shop.orgid, session_sync_id : { $ne : session_sync_id }};

      if (result.write.fail_ids.length > 0) {
        filter.id = { $nin : result.write.fail_ids };
      }
  
      const mongo_order_cursor = OrderModel
      .find(filter)
      .lean(true)
      .cursor({ batchSize : 100 });
  
      await mongo_order_cursor.eachAsync(async order => {
        const [error] = await to (OrderService.delete({ shop, order }));
        if (error) {
          result.delete.fail_ids.push(order.id);
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