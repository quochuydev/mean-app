angular
    .module('core')
    .directive('currencyInput', currencyInput)
    .directive('currencyFormat', currencyFormat)
    .directive('currencyMask', currencyMask)
    .directive('addMinus', addMinus)
    .directive('onlyNumber', onlyNumber)
    .directive('restockAbleQuantity', restockAbleQuantity);

currencyInput.$inject = [
    '$filter'
];
function currencyInput($filter) {
    return {
        restrict: 'A',
        scope: {
            amount: '@'
        },
        link: function (scope, el, attrs) {
            // scope.amount = el.val();
            el.val($filter('currency')(scope.amount));


            scope.$watch('amount', function () {
                if (isNaN(scope.amount)) {
                    el.val(0);
                } else {
                    el.val(scope.amount);
                }

            });
            el.bind('focus', function () {
                el.val(scope.amount);
            });

            el.bind('input', function () {
                scope.amount = el.val();
                scope.$apply();
            });

            el.bind('blur', function () {
                el.val($filter('currency')(scope.amount, '', 0));
            });
        }
    }
}

function currencyFormat() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModelController) {
      // Run formatting on keyup
      var numberWithCommas = function (value, addExtraZero) {
        if (addExtraZero == undefined)
          addExtraZero = false;
        value = value.toString();
        var value_length = value.length;
        for (var i=0; i < value_length; i++){
          if (value[0] == '0' && value.length == 1){

          }
          else if (value[0] == '0') {
            value = value.substring(1);
          }
        }
        value = value.replace(/[^0-9\.]/g, "");
        var parts = value.split('.');
        parts[0] = parts[0].replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,");
        if (parts[1] && parts[1].length > 2) {
          parts[1] = parts[1].substring(0, 2);
        }
        if (addExtraZero && parts[1] && (parts[1].length === 1)) {
          parts[1] = parts[1] + "0"
        }
        return parts.join(".");
      };

      var applyFormatting = function () {
        var value = element.val();
        if (value == ''){
          value = '0';
        }
        var original = value;
        if (!value || value.length == 0) {
          value = 0;
          element.val(value);
          return
        }
        value = numberWithCommas(value);
        if (value != original) {
          element.val(value);
          element.triggerHandler('input')
        }
      };

      var numberWithCommasActive = function (value, addExtraZero) {
        value = value.toString();
        // if (value[0] == '0' && value.length > 0) {
        //   value = value.substring(1);
        // }
        /*value = value.replace(/[^0-9\.]/g, "");*/
        value = value.replace(/[^0-9]/g, "");
        var parts = value.split('.');

        return parts.join(".");
      };
      var applyFormattingActive = function () {
        var value = element.val();
        var original = value;
        if (!value || value.length == 0) {
          return
        }
        value = numberWithCommasActive(value);
        if (value != original) {
          element.val(value);
          element.triggerHandler('input');
          if (value == '0') {
            element.val('');
            element.triggerHandler('input');
          }
        }else if (value == '0'){
          element.val('');
          element.triggerHandler('input');
        }
      };
      element.bind('focus', function (e) {
        applyFormattingActive();
      });

      element.bind('keyup', function (e) {
        var keycode = e.keyCode;
        var isTextInputKey =
          (keycode > 47 && keycode < 58) || // number keys
          keycode == 32 || keycode == 8 || // spacebar or backspace
          (keycode > 64 && keycode < 91) || // letter keys
          (keycode > 95 && keycode < 112) || // numpad keys
          (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
          (keycode > 218 && keycode < 223);   // [\]' (in order)
        if (isTextInputKey) {
          applyFormattingActive();
        }
      });

      ngModelController.$parsers.push(function (value) {
        if (!value || value.length == 0) {
          return value;
        }
        value = value.toString();
        value = value.replace(/[^0-9\.]/g, "");
        return value;
      });
      ngModelController.$formatters.push(function (value) {
        if (value){
          value = value.toString();
          if (!value || value.length == 0) {
            return value;
          }
          value = Math.round(value);
          value = numberWithCommas(value, true);
          return value;
        }
      });
      element.bind('blur', function (e) {
        applyFormatting();
      });

      var numberWithCommasFocus = function (value, addExtraZero) {
        if (addExtraZero == undefined)
          addExtraZero = false;
        value = value.toString();
        if (value[0] == '0' && value.length > 0) {
          value = value.substring(1);
        }
        value = value.replace(/[^0-9\.]/g, "");
        var parts = value.split('.');
        parts[0] = parts[0].replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&");
        if (parts[1] && parts[1].length > 2) {
          parts[1] = parts[1].substring(0, 2);
        }
        if (addExtraZero && parts[1] && (parts[1].length === 1)) {
          parts[1] = parts[1] + "0"
        }
        return parts.join(".");
      };
      var applyFocusFormatting = function () {
        var value = element.val();
        var original = value;
        if (!value || value.length == 0) {
          return
        }
        value = numberWithCommasFocus(value);
        if (value != original) {
          element.val(value);
          element.triggerHandler('input')
        }
      };

      angular.element('#input-focus').click(function (event) {

        applyFocusFormatting(event);

      });
    }


  };
}

function currencyMask() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModelController) {
      // Run formatting on keyup
      var numberWithCommas = function (value, addExtraZero) {
        if (addExtraZero == undefined)
          addExtraZero = false;
        value = value.toString();
        var value_length = value.length;
        for (var i=0; i < value_length; i++){
          if (value[0] == '0' && value.length == 1){

          }
          else if (value[0] == '0') {
            value = value.substring(1);
          }
        }
        value = value.replace(/[^0-9\.]/g, "");
        var parts = value.split('.');
        parts[0] = parts[0].replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,");
        parts[0] += ' ₫';
        if (parts[1] && parts[1].length > 2) {
          parts[1] = parts[1].substring(0, 2);
        }
        if (addExtraZero && parts[1] && (parts[1].length === 1)) {
          parts[1] = parts[1] + "0"
        }
        return parts.join(".");
      };

      var applyFormatting = function () {
        var value = element.val();
        if (value == ''){
          value = '0';
        }
        var original = value;
        if (!value || value.length == 0) {
          value = 0;
          element.val(value);
          return
        }
        value = numberWithCommas(value);
        if(value == '') {
          value = 0;
        }
        if (value != original) {
          element.val(value);
          element.triggerHandler('input')
        }
      };

      var numberWithCommasActive = function (value, addExtraZero) {
        value = value.toString();
        // if (value[0] == '0' && value.length > 0) {
        //   value = value.substring(1);
        // }
        /*value = value.replace(/[^0-9\.]/g, "");*/
        value = value.replace(/[^0-9]/g, "");
        var parts = value.split('.');

        return parts.join(".");
      };
      var applyFormattingActive = function () {
        var value = element.val();
        var original = value;
        if (!value || value.length == 0) {
          return
        }
        value = numberWithCommasActive(value);
        if (value != original) {
          element.val(value);
          element.triggerHandler('input');
          if (value == '0') {
            element.val('');
            element.triggerHandler('input');
          }
        }else if (value == '0'){
          element.val('0');
          element.triggerHandler('input');
        }
      };
      element.bind('focus', function (e) {
        applyFormattingActive();
      });

      element.bind('keyup', function (e) {
        var keycode = e.keyCode;
        var isTextInputKey =
          (keycode > 47 && keycode < 58) || // number keys
          keycode == 32 || keycode == 8 || // spacebar or backspace
          (keycode > 64 && keycode < 91) || // letter keys
          (keycode > 95 && keycode < 112) || // numpad keys
          (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
          (keycode > 218 && keycode < 223);   // [\]' (in order)
        if (isTextInputKey) {
          applyFormattingActive();
        }
      });

      ngModelController.$parsers.push(function (value) {
        if (!value || value.length == 0) {
          return value;
        }
        value = value.toString();
        value = value.replace(/[^0-9\.]/g, "");
        return value;
      });
      ngModelController.$formatters.push(function (value) {
        if (value){
          value = value.toString();
          if (!value || value.length == 0) {
            return value;
          }
          value = Math.round(value);
          value = numberWithCommas(value, true);
          return value;
        }
      });
      element.bind('blur', function (e) {
        /*var keycode = e.keyCode;
        var isTextInputKey =
            (keycode > 47 && keycode < 58) || // number keys
            keycode == 32 || keycode == 8 || // spacebar or backspace
            (keycode > 64 && keycode < 91) || // letter keys
            (keycode > 95 && keycode < 112) || // numpad keys
            (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
            (keycode > 218 && keycode < 223);   // [\]' (in order)
        // if (isTextInputKey) {
        //     applyFormatting();
        // }*/
        applyFormatting();
      });

      var numberWithCommasFocus = function (value, addExtraZero) {
        if (addExtraZero == undefined)
          addExtraZero = false;
        value = value.toString();
        if (value[0] == '0' && value.length > 0) {
          value = value.substring(1);
        }
        value = value.replace(/[^0-9\.]/g, "");
        var parts = value.split('.');
        parts[0] = parts[0].replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&");
        if (parts[1] && parts[1].length > 2) {
          parts[1] = parts[1].substring(0, 2);
        }
        if (addExtraZero && parts[1] && (parts[1].length === 1)) {
          parts[1] = parts[1] + "0"
        }
        return parts.join(".");
      };
      var applyFocusFormatting = function () {
        var value = element.val();
        var original = value;
        if (!value || value.length == 0) {
          return
        }
        value = numberWithCommasFocus(value);
        if (value != original) {
          element.val(value);
          element.triggerHandler('input')
        }
      };

      angular.element('#input-focus').click(function (event) {

        applyFocusFormatting(event);

      });
    }


  };
}

function addMinus() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModelController) {
      // Run formatting on keyup
      var numberWithCommas = function (value, addExtraZero) {
        if (addExtraZero == undefined)
          addExtraZero = false;
        value = value.toString();
        var value_length = value.length;
        for (var i=0; i < value_length; i++){
          if (value[0] == '0') {
            value = value.substring(1);
          }
        }
        value = value.replace(/[^0-9\.]/g, "");
        var parts = value.split('.');
        parts[0] = parts[0].replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,");
        if (parts[1] && parts[1].length > 2) {
          parts[1] = parts[1].substring(0, 2);
        }
        if (addExtraZero && parts[1] && (parts[1].length === 1)) {
          parts[1] = parts[1] + "0"
        }
        return parts.join(".");
      };

      var applyFormatting = function () {
        var value = element.val();
        var original = value;
        if (!value || value.length == 0) {
          value = 0;
          element.val(value);
          return
        }
        value = numberWithCommas(value);
        if(parseInt(value) > 0){
          value = '-' + value;
        }
        if(value == '') {
          value = 0;
        }
        if (value != original) {
          element.val(value);
          element.triggerHandler('input')
        }
      };

      var numberWithCommasActive = function (value, addExtraZero) {
        value = value.toString();
        // if (value[0] == '0' && value.length > 0) {
        //   value = value.substring(1);
        // }
        value = value.replace(/[^0-9\.]/g, "");
        var parts = value.split('.');

        return parts.join(".");
      };
      var applyFormattingActive = function () {
        var value = element.val();
        var original = value;
        if (!value || value.length == 0) {
          return
        }
        value = numberWithCommasActive(value);
        if (value != original) {
          if(parseInt(value) > 0){
            value = '-' + value;
          }
          element.val(value);
          element.triggerHandler('input')
        }
      };
      element.bind('focus', function (e) {
        applyFormattingActive();
      });

      element.bind('keyup', function (e) {
        var keycode = e.keyCode;
        var isTextInputKey =
          (keycode > 47 && keycode < 58) || // number keys
          keycode == 32 || keycode == 8 || // spacebar or backspace
          (keycode > 64 && keycode < 91) || // letter keys
          (keycode > 95 && keycode < 112) || // numpad keys
          (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
          (keycode > 218 && keycode < 223);   // [\]' (in order)
        if (isTextInputKey) {
          applyFormattingActive();
        }
      });

      ngModelController.$parsers.push(function (value) {
        if (!value || value.length == 0) {
          return value;
        }
        value = value.toString();
        value = value.replace(/[^0-9\.]/g, "");
        return value;
      });
      ngModelController.$formatters.push(function (value) {
        if (!value || value.length == 0) {
          if(parseInt(value) > 0){
            value = '-' + value;
          }
          return value;
        }
        value = numberWithCommas(value, true);
        if(parseInt(value) > 0){
          value = '-' + value;
        }
        return value;
      });
      element.bind('blur', function (e) {
        var keycode = e.keyCode;
        var isTextInputKey =
          (keycode > 47 && keycode < 58) || // number keys
          keycode == 32 || keycode == 8 || // spacebar or backspace
          (keycode > 64 && keycode < 91) || // letter keys
          (keycode > 95 && keycode < 112) || // numpad keys
          (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
          (keycode > 218 && keycode < 223);   // [\]' (in order)
        // if (isTextInputKey) {
        //     applyFormatting();
        // }
        applyFormatting();
      });

      var numberWithCommasFocus = function (value, addExtraZero) {
        if (addExtraZero == undefined)
          addExtraZero = false;
        value = value.toString();
        if (value[0] == '0' && value.length > 0) {
          value = value.substring(1);
        }
        value = value.replace(/[^0-9\.]/g, "");
        var parts = value.split('.');
        parts[0] = parts[0].replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&");
        if (parts[1] && parts[1].length > 2) {
          parts[1] = parts[1].substring(0, 2);
        }
        if (addExtraZero && parts[1] && (parts[1].length === 1)) {
          parts[1] = parts[1] + "0"
        }
        return parts.join(".");
      };
      var applyFocusFormatting = function () {
        var value = element.val();
        var original = value;
        if (!value || value.length == 0) {
          return
        }
        value = numberWithCommasFocus(value);
        if (value != original) {
          element.val(value);
          element.triggerHandler('input')
        }
      };

      angular.element('#input-focus').click(function (event) {

        applyFocusFormatting(event);

      });
    }


  };
}

function onlyNumber() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModelController) {
      // Run formatting on keyup


      function inputFormat(text){
        if (text){
          text = text.toString();
          var text_length = text.length;
          for (var i=0; i < text_length; i++){
            if (text[0] == '0' && text.length == 1){

            }
            else if (text[0] == '0') {
              text = text.substring(1);
            }
          }
        }
        if (text) {
          var transformedInput = text.replace(/[^0-9]/g, '');
          if (text == '0'){
            return transformedInput;
          }
          if (transformedInput !== text) {
            ngModelController.$setViewValue(transformedInput);
            ngModelController.$render();
          }
          return transformedInput;
        }
        return undefined;
      }
      ngModelController.$parsers.push(inputFormat);

      element.bind('blur', function (e) {
        /*var keycode = e.keyCode;
        var isTextInputKey =
            (keycode > 47 && keycode < 58) || // number keys
            keycode == 32 || keycode == 8 || // spacebar or backspace
            (keycode > 64 && keycode < 91) || // letter keys
            (keycode > 95 && keycode < 112) || // numpad keys
            (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
            (keycode > 218 && keycode < 223);   // [\]' (in order)
        // if (isTextInputKey) {
        //     applyFormatting();
        // }*/
        applyFormatting();
      });
      var applyFormatting = function () {
        var value = element.val();
        if (!value){
          value = '0';
        }
        var original = value;
        if (!value || value.length == 0) {
          value = 0;
          element.val(value);
          return
        }
        value = numberWithCommas(value);
        if(value == '') {
          value = 0;
        }
        if (value != original) {
          element.val(value);
          element.triggerHandler('input')
        }
      };

      var numberWithCommas = function (value, addExtraZero) {
        if (addExtraZero == undefined)
          addExtraZero = false;
        value = value.toString();
        var value_length = value.length;
        for (var i=0; i < value_length; i++){
          if (value[0] == '0' && value.length == 1){

          }
          else if (value[0] == '0') {
            value = value.substring(1);
          }
        }
        value = value.replace(/[^0-9\.]/g, "");
        var parts = value.split('.');
        /*parts[0] = parts[0].replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,");
        parts[0] += ' đ';*/
        if (parts[1] && parts[1].length > 2) {
          parts[1] = parts[1].substring(0, 2);
        }
        if (addExtraZero && parts[1] && (parts[1].length === 1)) {
          parts[1] = parts[1] + "0"
        }
        return parts.join(".");
      };

    }
  };
}

function restockAbleQuantity() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModelController) {
      // Run formatting on keyup
      scope.dataInput = attrs["restockAbleQuantity"];
      var numberWithCommasActive = function (value, addExtraZero) {
        value = value.toString();
        // if (value[0] == '0' && value.length > 1) {
        //   value = value.substring(1);
        // }
        value = value.replace(/[^0-9]/g, "");
        var parts = value.split('.');

        return parts.join(".");
      };

      var applyFormattingActive = function () {
        var value = element.val();

        var original = value;
        if (!value || value.length == 0) {
          return
        }

        value = numberWithCommasActive(value);

        if(parseInt(value) > parseInt(scope.dataInput)) {
          value = scope.dataInput;
        }

        if (value != original) {
          element.val(value);
          element.triggerHandler('input')
        }
      };


      element.bind('keyup', function (e) {
        var keycode = e.keyCode;
        var isTextInputKey =
          (keycode > 47 && keycode < 58) || // number keys
          keycode == 32 || keycode == 8 || // spacebar or backspace
          (keycode > 64 && keycode < 91) || // letter keys
          (keycode > 95 && keycode < 112) || // numpad keys
          (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
          (keycode > 218 && keycode < 223);   // [\]' (in order)
        if (isTextInputKey) {
          applyFormattingActive();
        }
      });

      element.bind('blur', function (e) {
        var keycode = e.keyCode;
        var isTextInputKey =
          (keycode > 47 && keycode < 58) || // number keys
          keycode == 32 || keycode == 8 || // spacebar or backspace
          (keycode > 64 && keycode < 91) || // letter keys
          (keycode > 95 && keycode < 112) || // numpad keys
          (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
          (keycode > 218 && keycode < 223);   // [\]' (in order)
        // if (isTextInputKey) {
        //     applyFormatting();
        // }
        applyFormatting();
      });

      var applyFormatting = function () {
        var value = element.val();
        var original = value;
        var value_length = value.length;
        if (!value || value.length == 0) {
          value = 0;
          element.val(value);
          return
        }

        for (var i=0; i < value_length; i++){
          if (value[0] == '0') {
            value = value.substring(1);
          }
        }

        if(value == '') {
          value = 0;
        }
        if (value != original) {
          element.val(value);
          element.triggerHandler('input')
        }
      };
    }


  };
}
