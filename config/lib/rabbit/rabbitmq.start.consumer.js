"use strict";

const path = require('path');
const { ERR } = require(path.resolve('./modules/core/server/libs/errors.server.lib.js'));
const config = require(path.resolve('./config/config'));
const ProductConsumer = require('./product.object.consumer');
const OrderConsumer = require('./order.object.consumer');
const RabbitConfig = config.rabbit;

const queue_consumers = {
  product: ProductConsumer,
  order: OrderConsumer,
}

module.exports.start = function() {
  try {
    if (!RabbitConfig.active) {
      return;
    }

    if (!RabbitConfig.consumer_active) {
      return;
    }

    for (let queue in queue_consumers) {
      const queue_config = RabbitConfig.queue[queue];
      const Consumer = queue_consumers[queue];

      if (queue_config.active) {
        for(let i = 0; i < queue_config.limit; i++) {
          const consumer = new Consumer(queue_config.name);
          consumer.start();
        }
      }
    }
  } catch(e) {
    ERR.log(e);
  }
};
