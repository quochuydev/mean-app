"use strict";

var path = require('path');
var mongoose = require('mongoose');
var nlogger = require(path.resolve('./config/lib/nlogger'));
var config = require(path.resolve('./config/config'));
var rabbitmq = require(path.resolve('./config/lib/rabbitmq'));
var RabbitConfig = config.rabbit;
var Promise = global.Promise;


function RetryConsumer(queue_name_send, queue_name_receive) {
  if (!(this instanceof RetryConsumer)) return new RetryConsumer();
  var _this = this;
  _this.channelConsumer = null;
  _this.queue_name_send = queue_name_send;
  _this.queue_name_receive = queue_name_receive;
}

RetryConsumer.prototype.start = function () {
  var _this = this;

  if (_this.channelConsumer) {
    return;
  }

  _this.channelConsumer = rabbitmq.rabbitConn.createChannel({
    setup: function (channel) {
      return Promise.all([
        channel.assertQueue(_this.queue_name_send , { durable: true, messageTtl: RabbitConfig.ttl }),
        channel.prefetch(RabbitConfig.prefetch),
        channel.consume(_this.queue_name_send , function(msg){
          try {
            _this.onMessage(msg);
          } catch (e) {
            console.log(e);
          }
        }, {noAck: false})
      ]);
    }
  });

  _this.channelConsumer.on('error', function (err) {
    console.log('Consumer Channel Order err: ');
    nlogger.writelog(nlogger.NLOGGER_ERROR, err, {
      filename: __filename,
      fn: 'start'
    })
  });
};


RetryConsumer.prototype.onMessage = function (msg) {
  var _this = this;
  if (!msg || (msg && !msg.content)) {
    return _this.channelConsumer.ack(msg);
  }
  var data = null;

  try {
    data = JSON.parse(msg.content.toString());
  } catch (e) {
    console.log(e);
  }

  if (!data) {
    return _this.channelConsumer.ack(msg);
  }

  rabbitmq.sendMessage(_this.queue_name_receive, data);
  _this.channelConsumer.ack(msg);

};

RetryConsumer.prototype.closeChannel = function (msg) {
  if (!RabbitConfig.active) {
    return;
  }

  var _this = this;

  if (!_this.channelConsumer) {
    return;
  }

  try {
    _this.channelConsumer.close();
    _this.channelConsumer = null;
  } catch (e) {
    console.log(e);
    console.trace();
  }
};

module.exports = RetryConsumer;