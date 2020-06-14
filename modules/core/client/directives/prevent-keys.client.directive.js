angular.module('core').directive('preventKeys', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      let keys = attrs.preventKeys.split(',').map(key => Number(key.trim()));

      element.bind('keydown', function (e) {
        if (keys.includes(e.which)) {
          e.preventDefault();
        }
      });
    }
  }
});