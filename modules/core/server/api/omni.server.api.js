'use strict';

const _ = require('lodash');
const path = require('path');
const { injectConfig } = require('./call.server.api');
const _is = require(path.resolve('./modules/core/share/lib/_is.lib.share'));
const { ErrorAdapter } = require(path.resolve('./modules/core/server/libs/error-adapters.server.lib'));
const { ERR } = require('../libs/errors.server.lib');
const { hara_app } = require(path.resolve('./config/config'));

const OMNI = { code: 'SV_OMNI' };

OMNI.ORDERS = {
  FIND : {
    method    : 'get',
    url       : 'com/orders.json',
    resPath   : 'body.orders'
  },
  UPDATE : {
    transform   : (order, { user, shop }) => Object({ params : { order_id : order.id }, body : { order }, user, shop }),
    method      : 'put',
    url         : 'com/orders/{order_id}.json',
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
    url       : 'com/orders/{order_id}.json',
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
      url       : 'com/orders/{order_id}/transactions.json',
      resPath   : 'body.transaction'
    },
  },
  CONFIRM : {
    transform : ({ order_id, user, shop }) => Object({ params : { order_id }, user, shop }),
    method    : 'post',
    url       : 'com/orders/{order_id}/confirm.json',
    resPath   : 'body.order'
  },
  FULFILLMENTS : {
    CREATE : {
      transform : ({ order_id, fulfillment, user, shop }) => Object({ params : { order_id }, body : { fulfillment }, user, shop }),
      method    : 'post',
      url       : 'com/orders/{order_id}/fulfillments.json',
      resPath   : 'body.fulfillment'
    },
  },
  CANCEL: {
    transform : ({ order_id, data, user, shop }) => Object({ params : { order_id }, body : data, user, shop }),
    method    : 'post',
    url       : 'com/orders/{order_id}/cancel.json',
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

OMNI.PRODUCTS = {
  COUNT : {
    method    : 'get',
    url       : 'com/products/count.json',
    resPath   : 'body.count'
  },
  FIND : {
    method    : 'get',
    url       : 'com/products.json',
    resPath   : 'body.products'
  },
  GET : {
    method    : 'get',
    url       : 'com/products/{id}.json',
    resPath   : 'body.product'
  },
};

OMNI.INVENTORY_LOCATION_BALANCE = {
  COUNT : {
    method    : 'get',
    url       : 'com/inventorylocationbalance/count.json',
    resPath   : 'body.count'
  },
  LIST_ID : {
    method    : 'get',
    url       : 'com/inventorylocationbalance/listids.json',
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
    url     : 'com/inventorylocationbalance/{id}.json',
    resPath : 'body.inventorylocationbalance'
  }
};

OMNI.INVENTORY = {
  UPDATE : {
    method: 'post',
    url: 'com/inventories/adjustorset.json',
    resPath: 'body.inventory'
  },
  ADJUSTOR_SET : {
    CREATE : {
      method  : 'post',
      url     : 'com/inventories/adjustorset.json',
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

OMNI.CUSTOMER = {
  GROUP : {
    LIST : {
      method  : 'get',
      url     : 'com/customers/groups.json',
      resPath : 'body.customer_groups'
    }
  }
};

OMNI.PROMOTION = {
  SAME_PRICE : {
    CREATE : {
      method  : 'post',
      url     : 'com/promotion-enterprise.json',
      resPath : 'body.promotion'
    },
    DELETE : {
      method  : 'delete',
      url     : 'com/promotion-enterprise/{id}.json',
      resPath : 'body'
    }
  }
}

OMNI.USERS = {
  FIND: {
    method  : 'get',
    url     : '/com/users.json',
    resPath : 'body.users',
  }
};

OMNI.LOCATIONS = {
  FIND: {
    method  : 'get',
    url     : '/com/locations.json',
    resPath : 'body.locations',
  }
};

OMNI.CARRIER_SERVICES = {
  CONFIG: {
    method  : 'get',
    url     : '/com/carrier_services/config.json',
    resPath : 'body.carrier_services',
  },
  SHIPPING_FEES: {
    method  : 'get',
    url     : '/com/carrier_services/{carrier_service}/shipping_fees.json',
    resPath : 'body.packages',
    simple_data: {
      params: {
        carrier_service: 8
      },
      query:{
        location_id: 485480,
        to_province_code: "HC",
        to_district_code: "HC486",
        to_address: "tranphu",
        to_ward_code: 27643,
        total_weight: 40,
        cod_amount: 50
      }
    }
  }
};

OMNI.CARTPROXY = {
  CREATE: {
    method  : 'post',
    url     : 'web/cartproxy.json',
    resPath : 'body.cartproxy',
  },
  DELETE: {
    method  : 'delete',
    url     : 'web/cartproxy.json',
    resPath : 'body',
  }
};

// -------------------- HOOKS ------------------------
function setHrHeader(it) {
  if (typeof it.finalConfig.headers !== 'object') {
    it.finalConfig.headers = {};
  }

  if (it.data.user && it.data.user.HrApiConfig) {
    it.finalConfig.headers['Authorization'] = `Bearer ${it.data.user.HrApiConfig.access_token}`;
  }
  else if (it.data.shop && typeof it.data.shop === 'object') {
    it.finalConfig.headers['Authorization'] = `Bearer ${it.data.shop.authorize.access_token}`;
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

injectConfig({ service : OMNI, config : {
  baseUrl: hara_app.protocol + hara_app.host_name,
  json : true, 
  before : setHrHeader, 
  handler : handler, 
  isRetry : _is.retry 
}});
// ----------------- END HOOKS ------------------------

module.exports = { OMNI };