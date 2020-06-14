'use strict';

angular.module('promotions.admin').controller('PromotionDetailController',
  ['$scope', 'Product', 'Promotion', '$state', 'Loading',
    async function ($scope, Product, Promotion, $state, Loading) {
      $scope._do = _do;
      $scope._CONST = _CONST;
      $scope.PromotionUtil = PromotionUtil;

      $scope.elem = {
        promotion: {
          reset: function () {

          },
          init: function () {
            Loading.show(true);
            Promotion.get({ promotionId: $state.params.promotionId }, function (data) {
              let promotion = data.item;
              if (promotion && promotion.locations) {
                promotion._locations = promotion.locations.map(e => e.name).join(', ');
              }
              if (promotion && promotion.customer_groups) {
                promotion._customer_groups = promotion.customer_groups.map(e => e.name).join('\n');
              }
              if (promotion && promotion.source_names) {
                promotion._source_names = promotion.source_names.map(e => e.name).join(', ');
              }
              $scope.promotion = PromotionUtil.renderClient(promotion);
              Loading.show(false);
            }, function () {
              Loading.show(false);
            })
          },
          config: function () {

          }
        }
      }

      common.mcm.invoke($scope.elem, 'reset');
      common.mcm.invoke($scope.elem, 'init');
      common.mcm.invoke($scope.elem, 'config');
    }]);