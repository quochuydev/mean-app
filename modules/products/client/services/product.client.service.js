'use strict';

angular.module('core').factory('Product', ['$resource', function ($resource) {
  return $resource(appslugAdmin + '/' + 'api/products', {}, {
    query: {
      method: 'GET',
      isArray: false,
      cache: false
    },
    groups: {
      url: appslugAdmin + '/api/products/groups',
      method: 'GET',
      isArray: false,
      cache: false
    },
    getVariants: {
      url: appslugAdmin + '/api/variants',
      method: 'GET',
      isArray: false,
      cache: false
    },
    getVariantsByProductId: {
      url: appslugAdmin + '/api/variants/:productid',
      method: 'GET',
      isArray: false,
      cache: false
    },
    getSellerProducts: {
      url: appslugAdmin + '/api/seller-products',
      cache: false,
      method: 'POST'
    },
  });
}]);
