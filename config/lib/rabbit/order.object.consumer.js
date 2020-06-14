"use strict";

let path = require('path');
let config = require(path.resolve('./config/config'));
let rabbitmqProducer = require(path.resolve('./config/lib/rabbitmq.js'));
let RabbitConfig = config.rabbit;
let Promise = global.Promise;
let { OrderService } = require(path.resolve('./modules/orders/server/services/order-service.server.js'));
let { ERR, ERR_REACHED_MAX_RETRY_COUNT } = require(path.resolve('./modules/core/server/libs/errors.server.lib'));

class OrderConsumer {

  constructor(queue_name) {
    this.channelConsumer = null;
    this.queue_name = queue_name;
  }

  start() {
    let _this = this;
    if (_this.channelConsumer) { return; }

    _this.channelConsumer = rabbitmqProducer.rabbitConn.createChannel({
      setup: function (channel) {
        return Promise.all([
          channel.assertQueue(_this.queue_name, { durable: true, messageTtl: RabbitConfig.ttl }),
          channel.prefetch(RabbitConfig.prefetch),
          channel.consume(_this.queue_name, function (msg) {
            _this.onMessage(msg);
          }, { noAck: false })
        ]);
      }
    });

    _this.channelConsumer.on('error', function (err) {
      console.log('Consumer Channel Order err: ', err);
    });
  };

  onMessage(msg) {
    let _this = this;
    if (!msg || (msg && !msg.content)) {
      if (_this.channelConsumer) { return _this.channelConsumer.ack(msg); }
      return false;
    }
    let data = null;

    try {
      data = JSON.parse(msg.content.toString());
    } catch (e) {
      console.log(e);
    }

    if (!(data && data.order && data.action && data.orgid)) {
      if (_this.channelConsumer) {
        return _this.channelConsumer.ack(msg);
      } else {
        return false;
      }
    }

    if (data.retry_count && data.retry_count >= config.retry_count) {
      new ERR_REACHED_MAX_RETRY_COUNT({ queue: _this.queue_name, data }).log();
      if (_this.channelConsumer) { _this.channelConsumer.ack(msg); }
    } else {
      OrderService.process(data)
        .then(() => {
          if (_this.channelConsumer) {
            _this.channelConsumer.ack(msg);
          }
        })
        .catch(err => {
          ERR.log({ queue: _this.queue_name, data, error: err });
          _this.sendQueueError(data, err, function () {
            if (_this.channelConsumer) {
              _this.channelConsumer.ack(msg);
            }
          });
        });
    }

  };

  sendQueueError(data, err, callback) {
    let _this = this;
    data.retry_count = (data.retry_count ? data.retry_count : 0) + 1;
    data.error = "";
    data.queue_name = _this.queue_name;
    if (err) { data.error = toString.call(err) == '[object Object]' ? JSON.stringify(err) : err.toString(); }
    rabbitmqProducer.sendMessage(_this.queue_name + '_error', data);
    callback();
  };

  closeChannel() {
    if (!RabbitConfig.active) { return; }

    let _this = this;

    if (!_this.channelConsumer) { return; }

    try {
      _this.channelConsumer.close();
      _this.channelConsumer = null;
    } catch (e) {
      console.log(e);
    }
  };
}

module.exports = OrderConsumer;