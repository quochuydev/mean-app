'use strict';

angular.module('core').factory('Loading', ['$timeout',
  function ($timeout) {
    var _detectViewMode = function() {
      var el = $('aside.nav-xs');

      if(el.length) {
        return 'collapse';
      } else {
        return 'expand';
      }
    };

    var show = function(flag) {
      var loadingClass = 'loading-page';
      var processingClass = 'loading-processing';
      var completeClass = 'loading-complete';
      var fullWidthClass = 'full-width';

      if(flag) {
        if(_detectViewMode() == 'collapse') {
          $('body')
              .addClass(loadingClass)
              .addClass(fullWidthClass);

          $timeout(function() {
            $('body').addClass(processingClass);
          }, 100);
        } else {
          $('body')
              .addClass(loadingClass);

          $timeout(function() {
            $('body').addClass(processingClass);
          }, 100);
        }
      } else {
        $timeout(function() {
          $('body').addClass(completeClass);

          $timeout(function() {
            $('body')
                .removeClass(loadingClass)
                .removeClass(fullWidthClass)
                .removeClass(processingClass)
                .removeClass(completeClass);
          }, 1000);
        }, 500);
      }
    };

    var showMini = function(elem, flag, loadingTimeout) {
      var currentPosition = $(elem).css('position');

      if(currentPosition == 'static') {
        $(elem).css('position', 'relative');
      }

      if(flag) {
        $(elem).addClass('loading');
        $('<div class="cssload-container"><div class="cssload-speeding-wheel"></div></div>').appendTo(elem);
      } else {
        $timeout(function() {
          $('.cssload-container', elem).remove();
          $(elem).removeClass('loading');
        }, loadingTimeout);
      }
    };

    return {
      show: show,
      showMini: showMini
    };
  }
]);