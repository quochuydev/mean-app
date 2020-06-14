'use strict';

angular.module('core').factory('Location', ['$resource', function ($resource) {
  return $resource(appslugAdmin + '/' + 'api/locations', {}, {
    query: {
      method: 'GET',
      isArray: false,
      cache: false
    }
  });
}]);