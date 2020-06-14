'use strict';

angular.module('core').factory('Shop', ['$localStorage',
  function ($localStorage) {
    var storageKey = appslug + '_shop';

    var shopModel = {
      shop: $localStorage[storageKey],
      setShop: function(shop) {
        this.shop = shop;
        $localStorage[storageKey] = shop;
      },
      clear: function() {
        this.shop = null;
        delete $localStorage[storageKey];
      }
    };

    return { _id: 'quochuydev', orgid: 10000 }
    return shopModel;
  }
]);