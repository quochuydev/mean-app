'use strict';

angular.module('core').factory('CustomerGroup', ['$resource', function ($resource) {
  return $resource(appslugAdmin + '/' + 'api/customers/groups', {}, {
    query: {
      method: 'GET',
      isArray: false,
      cache: false
    },
    get: {
      url: appslugAdmin + '/api/products/groups/:customerGroupId',
      method: 'GET',
      isArray: false,
      cache: false
    }
  });
}]);
