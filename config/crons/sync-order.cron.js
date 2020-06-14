'use strict';

const path = require('path');
const { ShopModel } = require(path.resolve('./modules/core/server/models/shop.server.model.js'));
const { OrderService } = require(path.resolve('./modules/orders/server/services/order-service.server.js'));
const { isMatchSyncAllTime, getSellerQueryTime, to } = require(path.resolve('./modules/core/server/libs/common.server.lib'));
const _CONST = require(path.resolve('./modules/core/share/lib/_CONST.lib.share'));
const { ERR } = require(path.resolve('./modules/core/server/libs/errors.server.lib.js'));

module.exports.start = async function (data={}) {
  let { 
    fetchWindowMinutes = 30, bufferMinutes = 5, isForceSyncAll = false, 
    syncAllAt = { hours: 10, minutes: 30 }, msRange = 5 * 60 * 1000,
    isLog = false,
  } = data;

  let is_sync_all = isForceSyncAll ? true : isMatchSyncAllTime({ syncAllAt, msRange });
  let cron_name = is_sync_all ? 'CRON_SYNC_ALL_ORDER' : 'CRON_SYNC_ORDER';

  let query = is_sync_all ? {} : getSellerQueryTime({ fetchWindowMinutes, bufferMinutes });
  let isDeleteOtherOrder = is_sync_all; 

  await ShopModel.find({status: 1}).lean(true).cursor().eachAsync(async shop => {
    if (isLog) { console.log(`[START] [${cron_name}] ${shop._id} query: ${JSON.stringify(query)}`); }

    const [error, result] = await to(OrderService.syncSeller({ shop, query, isDeleteOtherOrder }));

    if (error) {
      return ERR.log(error);
    }

    if (result.status === _CONST.PROCESS.STATUS.FAILED) {
      console.log(`[FAILED] [${cron_name}] ${shop._id} result : ${JSON.stringify(result)}`);
    }
    else if (isLog) {
      console.log(`[FINISHED] [${cron_name}] ${shop._id} result : ${JSON.stringify(result)}`);
    }
  }, { parallel : 5 });

  // console.log(`[DONE] [${cron_name}]`);
}
