'use strict';

angular.module('core').controller('MenuController', ['$scope', '$state', 'Menus',
  function ($scope, $state, Menus) {
    $scope.$state = $state;
    $scope.appslug = appslug;
    $scope.logo = logo;
    $scope.menu = Menus.getMenu('topbar');
    $scope.activeMenu = function (stateCurrent, stateSubs){
      return stateSubs.find(elm => elm.state == stateCurrent);
    };

    $scope.hideMobileMenu = function () {
      $('.mobile-menu').removeClass('show-mobile-menu').addClass('hide-mobile-menu');
    }
  }
]);
