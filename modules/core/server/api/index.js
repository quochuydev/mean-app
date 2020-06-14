'use strict';

const moment = require('moment');
const { CallAPI } = require('./call.server.api');
const callAPI = CallAPI({ now: () => moment().utc(7).format('DD/MM/YYYY HH:mm:ss') });

module.exports = {
  call: callAPI,
  ...require('./file-cloud.server.api'),
  ...require('./hr.server.api'),
  ...require('./omni.server.api'),
};

{ //------------------- TEST --------------------//
  const test = {
    async updateSellerOrder() {
      const assert = require('assert');
      const path = require('path');
      const config = require(path.resolve('./config/config'));
      const mongoose = require('mongoose');
      const ShopModel = mongoose.model(config.dbprefix + '_Shop');
      const OrderModel = mongoose.model(config.dbprefix + '_Order');
      const API = require(path.resolve('./modules/core/server/api/index'));

      const shop_url = 'zobid.sku.vn';

      const shop = await ShopModel.findOne({ _id : shop_url, status : ShopModel.STATUS_ACTIVE }).lean(true);

      if (!shop) { return }

      const app_order = await OrderModel.findOne({ is_deleted : false, shop : shop._id });

      if (!app_order) { return }

      // const user = {
      //   HrApiConfig: {
      //     shop: shop._id,
      //     protocol: config.protocol,
      //     access_token: shop.authorize.access_token
      //   }
      // };
      // let seller_order = await API.call(API.HR.ORDERS.GET, app_order._id, { user });

      let seller_order = await API.call(API.HR.ORDERS.GET, app_order._id, { shop });

      assert.ok(seller_order);

      const update_seller_order_data = {
        id : seller_order.id,
        tags : seller_order.tags + ' test_api'
      };

      let updated_seller_order = await API.call(API.HR.ORDERS.UPDATE, update_seller_order_data, { shop });

      assert.ok(updated_seller_order && updated_seller_order.tags === update_seller_order_data.tags);
    },
    async uploadFile() {
      const assert = require('assert');
      const path = require('path');
      const API = require(path.resolve('./modules/core/server/api/index'));

      const fileData = 'Hello';

      const link = await API.call(API.FILE_CLOUD.UPLOAD, { 
        params : { fileName : '/zobid.sku.vn/test/hello.txt' },
        body : fileData
      });

      const { body } = await API.call({ method : 'get', url : link });

      assert.deepEqual(body, fileData);
    },
    Omni: {
      async findProducts() {
        const assert = require('assert');
        const path = require('path');
        const API = require(path.resolve('./modules/core/server/api/index'));

        const shop = {
          authorize : {
            access_token: '27e5983d689691f66a5f8778298bfb49d7f1a9c1e656cd075c2e6c6682323ac7'
          }
        };

        const res = await API.call(API.OMNI.PRODUCTS.FIND, { shop });

        console.dir(res);
      }
    }
  }

  const path = require('path');
  const { _test } = require(path.resolve('./modules/core/server/libs/common.server.lib'));

  // _test(test);
}