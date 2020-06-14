'use strict';

angular.module('core').controller('MainController', ['$scope', '$http', '$state', 'Authentication',
  function ($scope, $http, $state, Authentication) {
    $scope.authentication = Authentication;
    $state.go('admin.promotions');
  }
]);
