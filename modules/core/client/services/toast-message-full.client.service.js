'use strict';

angular
    .module('core')
    .factory('ToastMessageFull', ToastMessage);

ToastMessage.$inject = [
  '$timeout'
];

function ToastMessage ($timeout) {
  return {
    info: info,
    error: error
  };

  function info (message, timeout) {
    _show('Info', message, timeout);
  }

  function error (message, timeout) {
    _show('Error', message, timeout);
  }

  function _show(type, message, timeout) {
    const toastOptions = {
      message: message,
      duration: timeout,
      isError: type == 'Error',
    };
    const toastNotice = Toast.create(app, toastOptions);
    toastNotice.dispatch(Toast.Action.SHOW);
  }
}
