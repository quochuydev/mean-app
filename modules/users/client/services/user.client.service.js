'use strict';

angular.module('core').factory('User', ['$resource', function ($resource) {
  return $resource(appslugAdmin + '/api/users', {}, {
    query: {
      method: 'GET',
      isArray: false,
      cache: false
    }
  });
}]);
