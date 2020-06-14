'use strict';

/**
 * Module dependencies.
 */
var config = require('../config');
var chalk = require('chalk');
var amqp = require('amqp-connection-manager');
var RabbitConfig = config.rabbit;

// Initialize Rabbit
module.exports.connect = function () {
  if (!RabbitConfig.active) {
    return;
  }

  var _this = this;
  _this.publisherChannel = {};

  var rabbitUrl = 'amqp://' + RabbitConfig.user + ':' + RabbitConfig.pass + '@' + RabbitConfig.host + ':' + RabbitConfig.port + '/' + RabbitConfig.vhost + '?heartbeat=60';

  var conn = amqp.connect([rabbitUrl]);

  conn.on('connect', function() {
    console.log('Rabbit connected!');
  });

  conn.on('disconnect', function(params) {
    console.log('Rabbit disconnected.', params.err.stack);
  });

  _this.rabbitConn = conn;
};

module.exports.disconnect = function (cb) {
  var _this = this;

  _this.rabbitConn.close(function (err) {
    console.info(chalk.yellow('Disconnected from Rabbit.'));
    cb(err);
  });
};

module.exports.createPublisher = function (queue_name) {
  if(!queue_name || (queue_name && queue_name == undefined+'_error')){
    return;
  }
  if (!RabbitConfig.active) {
    return;
  }

  if (!RabbitConfig.publisher_active) {
    return;
  }

  var _this = this;

  if (_this.publisherChannel[queue_name]) {
    return;
  }

  _this.publisherChannel[queue_name] = _this.rabbitConn.createChannel({
    setup: function (channel) {
      channel.prefetch(RabbitConfig.prefetch);
      return channel.assertQueue(queue_name, { durable: true, messageTtl: RabbitConfig.ttl });
    }
  });

  _this.publisherChannel[queue_name].on('error', function (err) {
    console.log('PublisherChannel err: ', err);
  });
};

module.exports.createPublisherForActiveQueue = function createPublisherForActiveQueue() {
  if (!RabbitConfig.active) {
    return;
  }

  if (!RabbitConfig.publisher_active) {
    return;
  }

  var _this = this;

  if (RabbitConfig.queue && typeof RabbitConfig.queue === 'object') {
    for (let queue in RabbitConfig.queue) {
      const queue_config = RabbitConfig.queue[queue];

      if (!queue_config.active) { continue }

      _this.createPublisher(queue_config.name);

      if (queue_config.retry) {
        _this.createPublisher(queue_config.name + '_error');
      }
    }
  }
}

module.exports.sendMessage = async function (queue_name, msg) {
  if (!RabbitConfig.active) {
    return;
  }

  if (!RabbitConfig.publisher_active) {
    return;
  }

  var _this = this;
  if(!_this.publisherChannel[queue_name]){
    return;
  }
  return _this.publisherChannel[queue_name].sendToQueue(queue_name, new Buffer(JSON.stringify(msg)), { persistent: true }).catch(function (err) {
    console.log('Message was rejected: ', err.stack);
    _this.publisherChannel[queue_name].close();
    _this.rabbitConn.close();
  });

};
