'use strict';

angular.module('core')
  .directive('multiSelectBox', multiSelectBox);

function multiSelectBox() {

  var template = '';
  template += '<isteven-multi-select ';
  template += 'id="{{id}}" ';
  template += 'name="{{id}}" ';
  template += 'input-model="items" ';
  template += 'output-model="selectedItems" ';
  template += 'button-label="{{buttonLabel}}" ';
  template += 'item-label="{{itemLabel}}" ';
  template += 'tick-property="ticked" ';
  template += 'is-disabled="disabled" ';
  template += 'translation="istevenTranslation" ';
  template += 'helper-elements="{{ helperElements }}" ';
  template += 'output-properties="{{ outputProperties }}" ';
  template += 'max-labels="{{maxLabel}}" ';
  template += 'on-open="istevenOpened()" ';
  template += 'class="btn-fz-{{ fz }}"';
  template += '/>';

  return {
    scope: {
      initItems: '=',
      initSelectedItems: '=',
      nothingSelected: '=',
      changeWith: '=',
      fz: '=?',
      disabled: '=?',
      itemLabel: '@',
      buttonLabel: '@',
    },
    template: template,
    restrict: 'E',
    require: 'ngModel',
    compile: compile
  };

  function compile() {
    return {
      pre: pre
    }
  }

  function pre(scope, elem, attrs, ngModel) {
    scope.initItems = _.cloneDeep(scope.initItems);
    scope.fz = scope.fz ? scope.fz : '13';
    scope.istevenTranslation = {
      selectAll: 'Chọn tất cả',
      selectNone: 'Bỏ chọn',
      reset: 'Mặc định',
      search: 'Tìm kiếm',
      nothingSelected: scope.nothingSelected || 'Tất cả'
    };

    scope.helperElements = attrs.helperElements || 'all none filter';
    scope.outputProperties = attrs.outputProperties || 'value';

    scope.itemLabel = scope.itemLabel || 'name';
    scope.buttonLabel = scope.buttonLabel || 'name';

    scope.maxLabel = attrs.maxLabel || 1;
    scope.id = attrs.id || Math.random().toString(36).substring(7);

    if (scope.changeWith) {
      $('.multiSelect > button').css({
        'height': 'auto',
        'border-radius': '5px',
        'font-size': '13px'
      });

      angular.element(document).ready(function () {
        $('.multiSelect > button').css({
          'font-size': '13px'
        });
      });
    }

    scope.istevenOpened = function () {
      var id = scope.id;
      var className = id ? `#${id} .multiSelect > button` : '.multiSelect > button';
      var widthOuter = $(className).outerWidth();
      var classNameCurrent = id ? `#${id} .multiSelect > .checkboxLayer` : '.multiSelect > .checkboxLayer';
      var classNameCurrentParent = id ? `#${id} .multiSelect` : '.multiSelect';
      var widthOuterCurrent = $(classNameCurrent).outerWidth();
      var minWidth = widthOuter && attrs.minWidth ? widthOuter * (attrs.minWidth / 100) : widthOuter;
      var maxWidth = widthOuter && attrs.maxWidth ? widthOuter * (attrs.maxWidth / 100) : widthOuter * 2.5;
      var cssUpdate = {};
      if (minWidth) cssUpdate['min-width'] = minWidth;
      if (maxWidth) cssUpdate['max-width'] = maxWidth;
      if (widthOuterCurrent > minWidth && widthOuterCurrent < maxWidth) cssUpdate['min-width'] = widthOuterCurrent;
      if (cssUpdate['min-width'] > cssUpdate['max-width']) cssUpdate['max-width'] = cssUpdate['min-width'];
      var alignBox = attrs.alignBox;
      if (alignBox && alignBox == 'right') cssUpdate.right = 0;
      $(classNameCurrentParent).css({ position: "relative" });
      $(classNameCurrent).css(cssUpdate);
    };

    ngModel.$render = function () {
      ngModel.$setViewValue(scope.selectedItems);
    };

    scope.$watch('initItems', function (items) {
      if (items) {
        scope.items = items;
      }
    }, true);

    scope.$watch('initSelectedItems', function (items) {
      if (items) {
        scope.selectedItems = items;
      }
    }, true);

    scope.$watch('selectedItems', function (items) {
      items = _.cloneDeep(items);
      if (!items || (items && !items.length)) {
        if (scope.items) {
          scope.items.forEach(function (item) {
            item.ticked = false;
          });
        }
      }
      ngModel.$setViewValue(items);
    });

  }

}
