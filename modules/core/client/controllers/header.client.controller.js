'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication',
  function ($scope, $state, Authentication) {
    $scope.authentication = Authentication;
    $scope.pageTitle = $state.$current && $state.$current.data ? $state.$current.data.pageTitle : '';
  }
]);
