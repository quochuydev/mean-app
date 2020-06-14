'use strict';

let request = require('request');
let url = require('url');
let swig = require('swig');
let path = require('path');
let config = require(path.resolve('./config/config'));

/**
 * Number.prototype.format(n, x, s, c)
 *
 * @param integer n: length of decimal
 * @param integer x: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 *
 * 12345678.9.format(2, 3, '.', ',');  // "12.345.678,90"
 * 123456.789.format(4, 4, ' ', ':');  // "12 3456:7890"
 * 12345678.9.format(0, 3, '-');       // "12-345-679"
 */
Number.prototype.format = function (n, x, s, c) {
  let re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
    num = this.toFixed(Math.max(0, ~~n));

  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

let calcTimezoneOffset = function (timezone) {
  let offset = 0;
  let v1 = "+";
  let v2 = "0";
  let v3 = "0";
  let time1 = timezone.match(/GMT([+-])([0-9]{1,2})(?::)?([0-9]{1,2})?/);
  if (time1[1]) v1 = time1[1];
  if (time1[2]) v2 = time1[2];
  if (time1[3]) v3 = time1[3];
  offset = v1 + v2 + "." + (v3 * 100 / 60);
  return offset;
};

let calcTime = function (dateObj, timezone) {
  let offset = calcTimezoneOffset(timezone);
  // dateObj = new Date();
  // convert to msec, add local time zone offset, get UTC time in msec
  let utc = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);

  // create new Date object for different city, using supplied offset
  let nd = new Date(utc + (3600000 * offset));
  return nd;
};



let EmailAPI = function () { };

EmailAPI.emailFixYahoo = function (email) {
  let newemail = email;
  if (email && email != '') {
    if (email.indexOf('+') != -1 && email.indexOf('yahoo') != -1) {
      let tmp = email.split('@');
      let tmp2 = tmp[0].split('+');
      newemail = tmp2[0] + '@' + tmp[1];
    }
  }
  return newemail;
};

EmailAPI.sendmail = function (FromName, FromAddress, ToName, ToAddress, Subject, EmailBody, callback) {
  let self = this;
  try {
    let mailerurl = config.mailer.options.service; //POST http://42.117.4.245:9000/mailer
    let FromName = FromName || "";
    let FromAddress = FromAddress || "";
    let ToName = ToName || "";
    let ToAddress = ToAddress || "";
    let Subject = Subject || "";
    let EmailBody = EmailBody || "";

    FromAddress = self.emailFixYahoo(FromAddress);
    ToAddress = self.emailFixYahoo(ToAddress);

    let postData = {
      "IsHtmlBody": true,
      "MailType": 0,
      "From": {
        "Address": FromAddress,
        "DisplayName": FromName
      },
      "To": [
        {
          "Address": ToAddress,
          "DisplayName": ToName
        }
      ],
      "CC": null,
      "BCC": null,
      "Subject": Subject,
      "Body": EmailBody,
      "AttachFileUrls": null,
      "Action": 100,
      "EventTypes": []
    };

    let bodyData = JSON.stringify(postData);
    let options = {
      url: mailerurl,
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
        'Content-Length': new Buffer(bodyData).length
      },
      body: bodyData
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        if (callback) callback(null, body);
      } else {
        if (callback) callback(error);
      }
    });
  } catch (e) {
    console.log(e);
    console.trace();
    if (callback) callback();
  }
};

EmailAPI.sendExportErrorTemplate = function (shopInfo) {
  let self = this;
  return new Promise((resolve, reject) => {
    if (shopInfo && shopInfo._id) {
      let FromName = "App google product feed";
      let FromAddress = config.mailer.from;
      let ToName = 'quochuydev1';
      let ToAddress = 'quochuydev1@gmail.com';
      let Subject = "Cập nhật dữ liệu Google Product Feed không thành công";
      let linkApp = config.protocol + shopInfo._id + '/adminv2/apps/';

      let viewData = {
        ToName: ToName,
        linkApp: linkApp,
      };

      let filename = path.resolve('./modules/emailservices/haravanemail/email-template', 'export_error.html');
      let template = swig.compileFile(filename);
      let EmailBody = template(viewData);

      self.sendmail(FromName, FromAddress, ToName, ToAddress, Subject, EmailBody, function (err, data) {
        if (err) { return reject({ err: err, fn: "sendExportErrorTemplate -> sendmail" }); }
        resolve();
      });
    } else {
      reject("Can Not Find Data Shop");
    }
  })
};

module.exports = EmailAPI;
