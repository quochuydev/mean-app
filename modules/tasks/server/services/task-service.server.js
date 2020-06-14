/*
const { TaskService } = require(path.resolve('./modules/promotions/server/services/promotion-service.server.js'));
*/

'use strict';

const path = require('path');
const { ProductModel } = require(path.resolve('./modules/products/server/models/products.server.model.js'));
const { ShopService } = require(path.resolve('./modules/shop/server/services/shop-service.server.js'));
const API = require(path.resolve('./modules/core/server/api'));
const RabbitMQ = require(path.resolve('./config/lib/rabbitmq.js'));
const config = require(path.resolve('./config/config'));
const { ProductService } = require(path.resolve('./modules/products/server/services/product-service.server.js'));
const { TaskModel } = require(path.resolve('./modules/tasks/server/models/task.server.model.js'));
const { PromotionElementModel } = require(path.resolve('./modules/promotions/server/models/promotion_element.server.model.js'));
const _do = require(path.resolve('./modules/core/share/lib/_do.lib.share.js'));
const MSG = require(path.resolve('./modules/core/share/lib/MSG.lib.share.js'));
const PromotionUtil = require(path.resolve('./modules/promotions/server/services/activities/promotion-service.util.server'));
const { Applier } = require(path.resolve('./modules/cart/server/services/applier.server.js'));

const TaskService = {};

const di = {
  Applier, TaskService, TaskModel, PromotionElementModel, PromotionUtil,
  ProductService, ProductModel, ShopService, API, RabbitMQ, config, _do, MSG
};

TaskService.search = require('./activities/task-service.search.server')(di);
TaskService.get = require('./activities/task-service.get.server')(di);
TaskService.write = require('./activities/task-service.write.server')(di);
TaskService.changeStatus = require('./activities/task-service.change-status.server')(di);
TaskService.delete = require('./activities/task-service.delete.server')(di);

module.exports = { TaskService };