'use strict';

angular.module('core').factory('Promotion', ['$resource', function ($resource) {
  return $resource(appslugAdmin + '/' + 'api/promotions/create', {}, {
    create: {
      method: 'POST',
      isArray: false,
      cache: false
    },
    get: {
      url: appslugAdmin + '/api/promotions/:promotionId',
      params: {
        promotionId: '@promotionId'
      },
      method: 'GET',
      isArray: false,
      cache: false
    },
    delete: {
      url: appslugAdmin + '/api/promotions/:promotionId',
      params: {
        promotionId: '@promotionId'
      },
      method: 'DELETE',
      isArray: false,
      cache: false
    },
    search: {
      url: appslugAdmin + '/api/promotions/search',
      method: 'POST',
      isArray: false,
      cache: false
    },
    changeStatus: {
      url: appslugAdmin + '/api/promotions/change-status/:promotionId',
      params: {
        promotionId: '@promotionId'
      },
      method: 'PUT',
      isArray: false,
      cache: false
    },
  });
}]);
