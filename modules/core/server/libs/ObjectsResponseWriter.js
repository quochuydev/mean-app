'use strict';

var ObjectsResponseWriter = function (res) {
  var _this = this;

  res.set('Content-Type', 'application/json; charset=utf-8');

  _this.res = res;
  _this._index = 0;
};

ObjectsResponseWriter.prototype.writeLine = function (data, total) {
  var _this = this;

  try {
    var json = '';

    if (_this._index == 0) {
      json += '{ "total": ' + total + ', "data": [';
    }

    if (_this._index) {
      json += ', ';
    }

    json += JSON.stringify(data);

    _this.res.write(json);

    _this._index++;
  } catch (e) {
    console.log(e);
    console.trace();

    _this._index++;
  }
};

ObjectsResponseWriter.prototype.writeEnd = function () {
  var _this = this;

  _this.res.end(']}');
};

module.exports = ObjectsResponseWriter;
