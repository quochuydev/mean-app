'use strict';

angular.module('core').factory('CoreService', ['$resource',
  function ($resource) {
    return $resource(appslug, {
      id: '@id'
    }, {

    });
  }
]);
