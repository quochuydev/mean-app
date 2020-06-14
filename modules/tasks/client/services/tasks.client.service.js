'use strict';

angular.module('core').factory('Task', ['$resource', function ($resource) {
  return $resource(appslugAdmin + '/' + 'api/tasks/create', {}, {
    create: {
      method: 'POST',
      isArray: false,
      cache: false
    },
    get: {
      url: appslugAdmin + '/api/tasks/:taskId',
      params: {
        taskId: '@taskId'
      },
      method: 'GET',
      isArray: false,
      cache: false
    },
    delete: {
      url: appslugAdmin + '/api/tasks/:taskId',
      params: {
        taskId: '@taskId'
      },
      method: 'DELETE',
      isArray: false,
      cache: false
    },
    search: {
      url: appslugAdmin + '/api/tasks/search',
      method: 'POST',
      isArray: false,
      cache: false
    },
    changeStatus: {
      url: appslugAdmin + '/api/tasks/change-status/:taskId',
      params: {
        taskId: '@taskId'
      },
      method: 'PUT',
      isArray: false,
      cache: false
    },
  });
}]);
