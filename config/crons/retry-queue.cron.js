'use strict';

var path = require('path');
var config = require('../config');
var RabbitmqRetryConsumer = require(path.resolve('./config/lib/rabbit/rabbitmq.retry.consumer'));
var asyncLib = require('async');

var array_queue = [];

if (config.rabbit.queue && typeof config.rabbit.queue === 'object') {
  for (let queue in config.rabbit.queue) {
    const queue_config = config.rabbit.queue[queue];
    if (queue_config.active && queue_config.retry) {
      array_queue.push({ queue_name: queue_config.name, retry: queue_config.retry })
    }
  }
}

var objectConsumer = {};

module.exports.start = function(callback) {
  if(config.rabbit.active && config.rabbit.retry_active) {
    asyncLib.series({
      create_channel_consumer: function (callback_async) {
        for (var i = 0; i < array_queue.length; i++) {
          if(array_queue[i].retry){
            var rabbitmqRetryConsumer = new RabbitmqRetryConsumer(array_queue[i].queue_name + "_error", array_queue[i].queue_name);
            rabbitmqRetryConsumer.start();
            objectConsumer[array_queue[i].queue_name + "_error"] = rabbitmqRetryConsumer;
          }
        }
        callback_async();
      },
      close_channel_consumer: function (callback_async) {
        setTimeout(function () {
          if (Object.keys(objectConsumer).length) {
            for (var key in objectConsumer) {
              if (objectConsumer.hasOwnProperty(key)) {
                objectConsumer[key].closeChannel();
                delete objectConsumer[key];
              }
            }
          }
          return callback();
        }, config.rabbit.time_retry_consumer);
      }
    });
  } else {
    return callback();
  }
};