'use strict';

angular.module('core').directive('buttonGoToTop', ['$window', function($window) {

  var template="";
  template += "<div class='go-to-top' >";
  template += "   <i class='fa fa-arrow-up'></i>";
  template += "</div>";

  return {
    template: template,
    replace: true,
    restrict: 'E',
    link: function(scope, elem, attrs) {
      if($('.vbox-content').scrollTop() <= 0){
        $(elem).fadeOut();
      }

      var container = angular.element('.vbox-content');
      container.bind("scroll", function(event) {
        if (container[0].scrollTop <= 0) {
          $(elem).fadeOut();
        }else {
          $(elem).fadeIn();
        }
      });

      elem.on('click', function() {
        var pos = $('.vbox-content').scrollTop();
        if(pos > 0){
          $('.vbox-content').animate({ scrollTop: 0 }, 500);
        }
      });
    }
  };
}]);
