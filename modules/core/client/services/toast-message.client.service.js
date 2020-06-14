'use strict';

angular
    .module('core')
    .factory('ToastMessage', ToastMessage);

ToastMessage.$inject = [
  '$timeout'
];

function ToastMessage($timeout) {
  return {
    info: info,
    error: error,
    success: success
  };

  // function _show(type, message) {
  //   if($window.parent) {
  //     $window.parent.postMessage({
  //       functionname: 'toastr',
  //       type: type,
  //       message: message
  //     }, '*');
  //   }
  // }

  function info(message, timeout) {
    _show('Info', message, timeout);
  }

  function error(message, timeout) {
    _show('Error', message, timeout);
  }

  function success(message, timeout) {
    _show('Success', message, timeout);
  }

  function _show(type, message, timeout) {
    var toastClass = type == 'Info' ? 'success' : 'error';
    var toastContainer = '#toast-container';
    var toastBlock = '<div style="display:none;" id="toast-container" class="toast-bottom-full-width"><div class="toast toast-' + toastClass + '"><div class="toast-message">' + message + '</div></div></div>';

    timeout = timeout || 4000;
    timeout = timeout < 1000 ? 1000 : timeout;

    $(toastBlock).appendTo('body').fadeIn(500);

    // $(toastContainer).on('click', function() {
    //   $timeout(function() {
    //     $(toastContainer).fadeOut(500);
    //     $timeout(function() {$(toastContainer).remove();}, 500)
    //   }, 500);
    // });

    $timeout(function() {
      $(toastContainer).fadeOut(500);
      $timeout(function() {$(toastContainer).remove();}, 500)
    }, timeout);
  }

}
