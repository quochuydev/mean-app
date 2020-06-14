'use strict';

angular.module('core').directive('formDatetimePicker', formDatetimePicker);

function formDatetimePicker() {
  var template = `
    <div class="form-group input-group" show-errors>
      <input id="{{id}}" name="{{name}}" datetime-picker="{{ format }}" placeholder="{{placeHolder}}" style="font-size: {{fz}}px; padding-left: {{pdl}}px; padding-right: {{pdr}}px" ng-disabled="disabled" type="text" ng-model="currentDate" is-open="showPopup" 
        datepicker-options="datePickerOptions" timepicker-options="timePickerOptions" button-bar="buttonBar" enable-date="enableDate" enable-time="enableTime" ng-change="handleStringInput()"
        class="form-control input-sm" ng-required="isRequired" autocomplete="off"/>
      <span class="input-group-btn">
        <button ng-disabled="disabled" type="button" class="btn btn-sm btn-default" ng-click="popupToggle()" style="padding: {{pdb}}px"><i class="{{classIcon}}" style="font-size: {{fzb}}px; "></i></button>
      </span>
    </div>
  `;

  return {
    scope: {
      initDate: '=',
      isNotValidNull: '=?',
      disabled: '=',
      placeHolder: '=',
      formatDate: '=',
      fz: '=',
      fzb: '=',
      pdb: '=',
      pdl: '=',
      pdr: '=',
      isRequired: '=?'
    },
    template: template,
    restrict: 'E',
    replace: true,
    require: 'ngModel',
    compile: compile
  };

  function compile() {
    return {
      pre: pre
    };
  }

  function pre(scope, elem, attrs, ngModel) {
    (function dateTimeToggle() {
      let id = _.cloneDeep(attrs.id);
      scope.id = id;
      scope.name = id;

      scope.enableDate = attrs.enableDate !== undefined ? attrs.enableDate == 'true' : true;
      scope.enableTime = attrs.enableTime !== undefined ? attrs.enableTime == 'true' : true;

      if (scope.enableDate && !scope.enableTime) {
        scope.format = scope.formatDate || 'dd-MM-yyyy';
      } else if (!scope.enableDate && scope.enableTime) {
        scope.format = 'HH:mm';
      } else {
        scope.format = 'dd-MM-yyyy HH:mm'
      }
    }());
    scope.classIcon = attrs.classIcon ? attrs.classIcon : 'glyphicon glyphicon-calendar';
    scope.showPopup = false;
    scope.datePickerOptions = {
      formatDayTitle: 'MM yyyy',
      formatMonth: 'MM',
      formatMonthTitle: 'MM',
      showWeeks: false
    };
    scope.timePickerOptions = {
      showMeridian: false
    };
    scope.buttonBar = {
      show: attrs.hiddenButtonBar ? !attrs.hiddenButtonBar : true,
      now: {
        show: true,
        text: 'Giờ hiện tại'
      },
      today: {
        show: true,
        text: 'Ngày hiện tại'
      },
      clear: {
        show: true,
        text: 'Xoá'
      },
      date: {
        show: true,
        text: 'Ngày'
      },
      time: {
        show: true,
        text: 'Giờ'
      },
      close: {
        show: true,
        text: 'Đóng'
      }
    };
    scope.currentDate = null;

    scope.popupToggle = function () {
      scope.showPopup = true;
    };

    scope.handleStringInput = function () {
      var val = scope.currentDate;
      if (val === undefined) {
        scope.isNotValidNull = true;
      } else if (val === null) {
        scope.isNotValidNull = false;
      } else if (val) {
        scope.isNotValidNull = false;
      }
    };

    ngModel.$render = function () {
      ngModel.$setViewValue(scope.currentDate);
    };

    scope.$watch('initDate', function (newValue) {
      if (newValue) {
        scope.currentDate = newValue;
        if (scope.currentDate instanceof Date) {
          scope.currentDate.setSeconds(0);
        }
      } else if (newValue == null) {
        scope.currentDate = null;
      }
    }, true);

    scope.$watch('currentDate', function (newValue) {
      if (angular.isDate(newValue) || newValue === null) {
        ngModel.$setViewValue(newValue);
      }
    });
  }
}
