"use strict";

var path = require('path');
var config = require(path.resolve('./config/config'));
var rabbitmqProducer = require(path.resolve('./config/lib/rabbitmq.js'));
var RabbitConfig = config.rabbit;
var Promise = global.Promise;
var { ProductService } = require(path.resolve('./modules/products/server/services/product-service.server.js'));

function ProductConsumer(queue_name) {
  if (!(this instanceof ProductConsumer)) return new ProductConsumer(queue_name);
  var _this = this;
  _this.channelConsumer = null;
  _this.queue_name = queue_name;
}

ProductConsumer.prototype.start = function () {
  var _this = this;

  if (_this.channelConsumer) {
    return;
  }

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


ProductConsumer.prototype.onMessage = function (msg) {
  var _this = this;
  if (!msg || (msg && !msg.content)) {
    if (_this.channelConsumer) {
      return _this.channelConsumer.ack(msg);
    } else {
      return false;
    }
  }
  var data = null;

  try {
    data = JSON.parse(msg.content.toString());
  } catch (e) {
    console.log(e);
  }

  if (!data || (data && (!data.hasOwnProperty('product') || !data.hasOwnProperty('action') || !data.hasOwnProperty('orgid')))) {
    if (_this.channelConsumer) {
      return _this.channelConsumer.ack(msg);
    } else {
      return false;
    }
  }

  if (data.retry_count && data.retry_count >= config.retry_count) {
    new ERR_REACHED_MAX_RETRY_COUNT({ queue: _this.queue_name, data }).log();

    if (_this.channelConsumer) {
      _this.channelConsumer.ack(msg);
    }
  } else {
    ProductService.process(data)
      .then(() => {
        if (_this.channelConsumer) {
          _this.channelConsumer.ack(msg);
        }
      })
      .catch(err => {
        _this.sendQueueError(data, err, function () {
          if (_this.channelConsumer) {
            _this.channelConsumer.ack(msg);
          }
        });
      });
  }

};

ProductConsumer.prototype.sendQueueError = function (data, err, callback) {
  var _this = this;
  data.retry_count = (data.retry_count ? data.retry_count : 0) + 1;
  data.error = "";
  data.queue_name = _this.queue_name;
  if (err)
    data.error = toString.call(err) == '[object Object]' ? JSON.stringify(err) : err.toString();
  rabbitmqProducer.sendMessage(_this.queue_name + '_error', data);
  callback();
};

ProductConsumer.prototype.closeChannel = function () {
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

module.exports = ProductConsumer;