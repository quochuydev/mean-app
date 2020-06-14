'use strict';

angular.module('core').directive('loading', ['$timeout', function($timeout) {
  return {
    scope: true,
    restrict: 'A',
    link: function(scope, elem, attrs) {
      var loadingTimeout = Number(attrs.loadingTimeout);
      var currentPosition = $(elem).css('position');

      if(currentPosition == 'static') {
        $(elem).css('position', 'relative');
      }

      scope.$watch(attrs.loading, function(newValue) {
        if(newValue) {
          $(elem).addClass('loading');
          $('<div class="cssload-container"><div class="cssload-speeding-wheel"></div></div>').appendTo(elem);
        } else {
          $timeout(function() {
            $('.cssload-container', elem).remove();
            $(elem).removeClass('loading');
          }, loadingTimeout);
        }
      });
    }
  };
}]);
