'use strict';

const path = require('path');
const { ScrollSellerDataFactory } = require(path.resolve('./modules/core/server/libs/scroll-selller-data-factory.server.lib.js'));

module.exports = ({ API }) => ScrollSellerDataFactory({ api: API.OMNI.ORDERS.FIND });