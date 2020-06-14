'use strict';
const mongoose = require('./mongoose');

mongoose.loadModels(); //Load moongo models
const path = require('path');

const CronJob = require('cron').CronJob;
const config = require(path.resolve('./config/config'));
const nlogger = require(path.resolve("./config/lib/nlogger"));
const SyncProductCron = require(path.resolve('./config/crons/sync-product.cron.js'));
const SyncOrderCron = require(path.resolve('./config/crons/sync-order.cron.js'));
const { ERR } = require(path.resolve('./modules/core/server/libs/errors.server.lib.js'));

const syncProductJob = new CronJob({
  cronTime: config.cron_time.sync_product,
  onTick: function () {
    if (global.syncProduct) {
      return;
    }

    global.syncProduct = true;

    SyncProductCron.start()
      .then(() => {
        global.syncProduct = false;
      })
      .catch(err => {
        ERR.log(err);
      });
  },
  start: false
});

const syncOrderJob = new CronJob({
  cronTime: config.cron_time.sync_order,
  onTick: function () {
    if (global.syncOrder) { return; }

    global.syncOrder = true;

    SyncOrderCron.start()
      .then(() => {
        global.syncOrder = false;
      })
      .catch(err => {
        ERR.log(err);
      });
  },
  start: false
});

module.exports.start = function () {
  if (config.cron_active.sync_product) {
    syncProductJob.start();
  }
  if (config.cron_active.sync_order) {
    syncOrderJob.start();
  }
};
