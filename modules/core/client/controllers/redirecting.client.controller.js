'use strict';

angular.module('core').controller('RedirectingController', ['$scope', '$state', 'Authentication', 'Shop', '$window', '$localStorage', 'CoreService',
  function ($scope, $state, Authentication, Shop, $window, $localStorage, CoreService) {
    Authentication.clear();
    Shop.clear();

    // Authentication.setUser({})
    // Shop.setShop({})

    $scope.authentication = Authentication;
    Shop.setShop(Shop);
    $state.go('admin.promotions');
  }
])