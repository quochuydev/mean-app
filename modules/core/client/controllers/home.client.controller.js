'use strict';

angular.module('core').controller('HomeController', HomeController);

HomeController.$inject = ['$state'];

function HomeController($state) {
  $state.go('admin.promotions');
}
