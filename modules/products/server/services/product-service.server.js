/*
const { ProductService } = require(path.resolve('./modules/products/server/services/product-service.server.js'));
*/

'use strict';

const path = require('path');
const { ProductModel } = require(path.resolve('./modules/products/server/models/products.server.model.js'));
const { ShopService } = require(path.resolve('./modules/shop/server/services/shop-service.server.js'));
const API = require(path.resolve('./modules/core/server/api'));
const RabbitMQ = require(path.resolve('./config/lib/rabbitmq.js'));
const config = require(path.resolve('./config/config'));

const ProductService = {};

const di = { ProductService, ProductModel, ShopService, API, RabbitMQ, config };

ProductService.process = require('./activities/product-service.process.server')(di);
ProductService.makeDataWrite = require('./activities/product-service.make-data-write.server')(di);
ProductService.write = require('./activities/product-service.write.server')(di);
ProductService.delete = require('./activities/product-service.delete.server')(di);
ProductService.scrollSeller = require('./activities/product-service.scroll-seller.server')(di);
ProductService.syncSeller = require('./activities/product-service.sync-seller.server')(di);
ProductService.search = require('./activities/product-service.search.server')(di);

module.exports = { ProductService };