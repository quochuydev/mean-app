'use strict';

angular.module('core').directive('customValidate', [function() {
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
      scope.$watch(attrs.customValidate, function(value) {
        if(value) {
          $(elem).addClass('has-error');
        } else {
          $(elem).removeClass('has-error');
        }
      });
    }
  };
}]);
