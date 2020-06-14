'use strict';

const _ = require('lodash');
const path = require('path');
const { injectConfig } = require('./call.server.api');
const _is = require(path.resolve('./modules/core/share/lib/_is.lib.share'));
const { ErrorAdapter } = require(path.resolve('./modules/core/server/libs/error-adapters.server.lib'));

const { ERR } = require('../libs/errors.server.lib');

const HR = {
  CODE : 'SV_HR'
};

HR.SHOPS = {
  GET : {
    method    : 'get',
    url       : 'admin/shop.json',
    resPath   : 'body.shop'
  }
};
HR.ORDERS = {
  UPDATE : {
    transform   : (order, { user, shop }) => Object({ params : { order_id : order.id }, body : { order }, user, shop }),
    method      : 'put',
    url         : 'admin/orders/{order_id}.json',
    resPath     : 'body.order',
    simple_data : {
      order : {
        id               : 1000001,
        shipping_address : {}
      }
    }
  },
  GET : {
    transform : (order_id, { user, shop }) => Object({ params : { order_id }, user, shop }),
    method    : 'get',
    url       : 'admin/orders/{order_id}.json',
    resPath   : 'body.order'
  },
  TRANSACTIONS : {
    COMPLETE : {
      transform : ({ order_id, user, shop }) => Object({
        params  : { order_id },
        body    : { transaction : { kind: 'capture', send_email: true, user_id : user._id } },
        user, shop
      }),
      method    : 'post',
      url       : 'admin/orders/{order_id}/transactions.json',
      resPath   : 'body.transaction'
    },
  },
  CONFIRM : {
    transform : ({ order_id, user, shop }) => Object({ params : { order_id }, user, shop }),
    method    : 'post',
    url       : 'admin/orders/{order_id}/confirm.json',
    resPath   : 'body.order'
  },
  FULFILLMENTS : {
    CREATE : {
      transform : ({ order_id, fulfillment, user, shop }) => Object({ params : { order_id }, body : { fulfillment }, user, shop }),
      method    : 'post',
      url       : 'admin/orders/{order_id}/fulfillments.json',
      resPath   : 'body.fulfillment'
    },
  },
  CANCEL: {
    transform : ({ order_id, data, user, shop }) => Object({ params : { order_id }, body : data, user, shop }),
    method    : 'post',
    url       : 'admin/orders/{order_id}/cancel.json',
    resPath   : 'body.order',
    simple_data : {
      reason: 'fraud',
      note: 'not like',
      restock: true,
      ignore_cancel_fulfillment: true,
      email: true
    }
  }
};

HR.PRODUCTS = {
  COUNT : {
    method    : 'get',
    url       : 'admin/products/count.json',
    resPath   : 'body.count'
  },
  FIND : {
    method    : 'get',
    url       : 'admin/products.json',
    resPath   : 'body.products'
  },
  GET : {
    method    : 'get',
    url       : 'admin/products/{id}.json',
    resPath   : 'body.product'
  },
}

HR.INVENTORY_LOCATION_BALANCE = {
  COUNT : {
    method    : 'get',
    url       : 'admin/inventorylocationbalance/count.json',
    resPath   : 'body.count'
  },
  LIST_ID : {
    method    : 'get',
    url       : 'admin/inventorylocationbalance/listids.json',
    resPath   : 'body.inventorybalanceids',
    simple_data : {
      query : {
        from_id : 0,
        to_id   : 0,
        limit   : 100,
        offset  : 1,
      }
    }
  },
  DETAIL : {
    method  : 'get',
    url     : 'admin/inventorylocationbalance/{id}.json',
    resPath : 'body.inventorylocationbalance'
  }
};

HR.INVENTORY = {
  UPDATE : {
    method: 'post',
    url: 'admin/inventories/adjustorset.json',
    resPath: 'body.inventory'
  },
  ADJUSTOR_SET : {
    CREATE : {
      method  : 'post',
      url     : 'admin/inventories/adjustorset.json',
      resPath : 'body.inventory',
      simple_data : {
        "inventory": {
          "location_id": "482663",
          "type": "adjust",
          "reason": "newproduct",
          "note": "Điều chỉnh số lượng nhập kho khi hủy nhập kho của đơn hàng #108663",
          "line_items": [
            {
              "product_id": 10000434723,
              "product_variant_id": 101345186,
              "quantity": -10
            }
          ]
        }
      }
    },
  }
};

HR.CUSTOMER = {
  GROUP : {
    LIST : {
      method  : 'get',
      url     : 'admin/customers/groups.json',
      resPath : 'body.customer_groups'
    }
  }
};

HR.PROMOTION = {
  SAME_PRICE : {
    CREATE : {
      method  : 'post',
      url     : 'admin/promotion-enterprise.json',
      resPath : 'body.promotion'
    },
    DELETE : {
      method  : 'delete',
      url     : 'admin/promotion-enterprise/{id}.json',
      resPath : 'body'
    }
  }
}

// -------------------- HOOKS ------------------------
function setHrHeader(it) {
  if (typeof it.finalConfig.headers !== 'object') {
    it.finalConfig.headers = {};
  }

  if (it.data.user && it.data.user.HrApiConfig) {
    it.finalConfig.baseUrl = it.data.user.HrApiConfig.protocol + it.data.user.HrApiConfig.shop;
    it.finalConfig.headers['Authorization'] = `Bearer ${it.data.user.HrApiConfig.access_token}`;
  }
  else {
    throw new ERR({ message : 'Call seller api require user with HrApiConfig or shop' });
  }

  it.finalConfig.headers['accept']        = '*/*';
  it.finalConfig.headers['Content-Type']  = 'application/json';
}

function handler(it) {
  if (it.error.response) {
    throw ErrorAdapter.Seller({
      request : _.omit(it.finalConfig, ['headers']),
      ..._.pick(it.error.response, [
        'statusCode', 'statusMessage', 'body',
      ])
    });
  } 
  else {
    it.error.request = _.omit(it.finalConfig, ['headers']);
    throw ErrorAdapter.Guess(it.error);
  }
}

injectConfig({ service : HR, config : { json : true, before : setHrHeader, handler : handler, isRetry : _is.retry } });
// ----------------- END HOOKS ------------------------


module.exports = { HR };