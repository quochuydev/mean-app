/*
const { OrderService } = require(path.resolve('./modules/orders/server/services/order-service.server.js'));
*/

'use strict';

const path = require('path');
const { OrderModel } = require(path.resolve('./modules/orders/server/models/orders.server.model'));
const { ShopService } = require(path.resolve('./modules/shop/server/services/shop-service.server'));
const API = require(path.resolve('./modules/core/server/api'));
const RabbitMQ = require(path.resolve('./config/lib/rabbitmq.js'));
const config = require(path.resolve('./config/config'));

const OrderService = {};

const di = { OrderService, OrderModel, ShopService, API, RabbitMQ, config };

OrderService.process = require('./activities/order-service.process.server')(di);
OrderService.makeDataWrite = require('./activities/order-service.make-data-write.server')(di);
OrderService.write = require('./activities/order-service.write.server')(di);
OrderService.delete = require('./activities/order-service.delete.server')(di);
// OrderService.scrollSeller = require('./activities/order-service.scroll-seller.server')(di);
OrderService.syncSeller = require('./activities/order-service.sync-seller.server')(di);

module.exports = { OrderService };