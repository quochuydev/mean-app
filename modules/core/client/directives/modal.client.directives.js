'use strict';

angular.module('core').directive('modal', function() {
  var modalZIndex = 1050;

  return {
    template: '<div class="modal fade">' +
    '<div class="modal-dialog modal-{{ size }}" style="margin-top: {{ top }}px">' +
    '<div class="modal-content">' +
    '<div class="modal-header" ng-show="!notViewHeader">' +
    '<button type="button" class="close" ng-click="closeModal()" title="Đóng" data-dismiss="modal" aria-hidden="true">&times;</button>' +
    '<h4 class="modal-title">{{ title }}</h4>' +
    '</div>' +
    '<div class="modal-body" style="overflow-y: {{overflowY}}" ng-transclude></div>' +
    '</div>' +
    '</div>' +
    '</div>',
    restrict: 'E',
    transclude: true,
    replace:true,
    scope:true,
    link: function postLink(scope, element, attrs) {
      scope.title = attrs.titleModal;
      scope.notViewHeader = attrs.notViewHeader;
      scope.size = attrs.size;
      scope.top = attrs.top || 30;
      scope.overflowY = attrs.overflowY || 'auto';

      modalZIndex++;

      $(element).css('z-index', modalZIndex);
      $(element).attr('data-zindex', modalZIndex);

      scope.$watch(attrs.visible, function(value){
        if(value == true)
          $(element).modal('show');
        else
          $(element).modal('hide');
      });

      $(element).on('shown.bs.modal', function() {
        var modalIndex = Number($(element).attr('data-zindex'));

        var modalBackdrop = $('.modal-backdrop:not([data-indexed])');
        modalBackdrop.css('z-index', modalIndex - 1);
        modalBackdrop.attr('data-indexed', true);

        $(element).animate({ scrollTop: 0 }, 500);

        scope.$apply(function(){
          scope.$parent[attrs.visible] = true;
        });
      });

      $(element).on('hidden.bs.modal', function() {
        $('body').toggleClass('modal-open');

        scope.$apply(function(){
          scope.$parent[attrs.visible] = false;
        });
      });
    }
  };
});
