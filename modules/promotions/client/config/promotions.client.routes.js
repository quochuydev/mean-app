'use strict';

angular.module('promotions.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.promotions', {
        url: '/promotions',
        templateUrl: appslug + '/' + 'modules/promotions/client/views/list.client.view.html',
        controller: 'PromotionController',
        data: {
          pageTitle: 'Danh sách khuyến mãi'
        }
      })
      .state('admin.promotions-create', {
        url: '/promotions/create',
        templateUrl: appslug + '/' + 'modules/promotions/client/views/create.client.view.html',
        controller: 'PromotionCreateController',
        data: {
          pageTitle: 'Tạo khuyến mãi'
        }
      })
      .state('admin.promotions-detail', {
        url: '/promotions/detail/:promotionId',
        templateUrl: appslug + '/' + 'modules/promotions/client/views/detail.client.view.html',
        controller: 'PromotionDetailController',
        data: {
          pageTitle: 'Chi tiết khuyến mãi'
        }
      })
  }
]);