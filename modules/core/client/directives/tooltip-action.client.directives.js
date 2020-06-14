'use strict';

angular.module('core')
  .directive('tooltipAction', tooltipAction);

tooltipAction.$inject = ['$timeout'];

function tooltipAction($timeout) {
  return {
    templateUrl: appslug + "/modules/core/client/directives/templates/tooltip-action.client.view.html",
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      func: '='
    },
    link: function (scope) {
      scope.isShow = false;

      scope.action = {
        active: function (id) {
          scope.func.active(id);
        },
        inactive: function (id) {
          scope.func.inactive(id);
        },
        delete: function (id) {
          scope.func.showDelete(id);
        }
      }
      scope.tooltip_size = ($('.width_header_tooltip').width()) / 2 - 235;

      scope.showOptions = function () {
        $('.tooltip-action_options').addClass('ng-hide');
        scope.isShow = !scope.isShow;
      }

      $(document).on('click', function (e) {
        if (!$(e.target).parents('.tooltip-icon-toggle').length) {
          scope.$apply(function () {
            scope.isShow = false;
          });
        }
      });
    }
  };
}