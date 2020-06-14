'use strict';

var path = require('path');
var _ = require('lodash');
var config = require(path.resolve('./config/config'));

/*
 levels = ['nlogger_error', 'nlogger_warn', 'nlogger_info']
 nlogger_error : code xử lý logic, nội bộ app
 nlogger_warn: error when request api
 nlogger_info: ghi thông tin để theo dõi.
 */

var nlogger = function () {
};

nlogger.NLOGGER_ERROR = "nlogger_error";
nlogger.NLOGGER_WARN = "nlogger_warn";
nlogger.NLOGGER_INFO = "nlogger_info";

nlogger.debugLevel = config.debugLevel || nlogger.NLOGGER_ERROR;
nlogger.levels = [nlogger.NLOGGER_ERROR, nlogger.NLOGGER_WARN, nlogger.NLOGGER_INFO];

nlogger.writelog = function (level, error, message) {
  var autoTrace = new Error("auto create stack trace");
  var _this = this;
  var dataString = '';
  var stackTrace = '';
  var hasTrace = true;

  try {
    level = level || nlogger.NLOGGER_ERROR;

    if (_this.levels.indexOf(level) >= _this.levels.indexOf(_this.debugLevel) ) {
      if (message && typeof message !== 'string') {
        message = JSON.stringify(message);
      }

      var timeStamp = new Date();
      dataString = "[" + level + "]";
      dataString += "[" + timeStamp.toLocaleString() + "]";

      if (message) {
        dataString += message.toString();
      }

      if (error && error instanceof Error) {
        hasTrace = false;
        stackTrace = error.stack;
        stackTrace = _.split(stackTrace, '\n');
        stackTrace = _.slice(stackTrace, 0, stackTrace.length - 2);
        stackTrace = _.join(stackTrace, ',');
      } else if (error && typeof error !== 'string' ) {
        stackTrace = JSON.stringify(error);
      } else if (error && error) {
        stackTrace = error.toString();
      }

      if (stackTrace) {
        dataString += '. Trace: ' + stackTrace.toString();
      }

      if (hasTrace) {
        var LstTrace1 = autoTrace.stack;
        var LstTrace2 = _.split(LstTrace1, '\n');
        var LstTrace3 = _.slice(LstTrace2, 2, LstTrace2.length - 2);
        var LstTrace4 = _.join(LstTrace3, ',');
        dataString += '.  autoTrace:' + LstTrace4;
      }

      console.log(dataString);
    }
  } catch(e) {
    console.log(e);
    console.trace();
  }
};

module.exports = nlogger;
