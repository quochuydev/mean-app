'use strict';

angular
  .module('core')
  .filter('formatMoney', formatMoney)
  .filter('formatVnDate', formatVnDate)
  .filter('formatVnDateTime', formatVnDateTime)
  .filter('formatVnDateHourMin', formatVnDateHourMin)
  .filter('currentDateTime', currentDateTime)
  .filter('countTinymceContent', countTinymceContent)
  .filter('selectDiscountTrigger', selectDiscountTrigger)
  .filter('selectDiscountRule', selectDiscountRule)
  .filter('cleanObject', cleanObject);

function formatMoney() {
  return _do.formatMoney;
}

function formatVnDate(dateFilter) {
  return function (input) {
    if (!input) { return ''; }
    var d = new Date(input);
    return dateFilter(d, 'dd/MM/yyyy');
  };
}

function formatVnDateTime(dateFilter) {
  return function (input) {
    if (!input) { return ''; }
    var d = new Date(input);
    return dateFilter(d, 'dd/MM/yyyy HH:mm:ss');
  };
}

function formatVnDateHourMin(dateFilter) {
  return function (input) {
    if (!input) { return ''; }
    var d = new Date(input);
    return dateFilter(d, 'dd/MM/yyyy HH:mm');
  };
}

function currentDateTime(dateFilter) {
  return function () {
    var d = new Date();
    return dateFilter(d, 'dd/MM/yyyy HH:mm');
  };
}

function countTinymceContent() {
  return function (input) {
    input = input || '';

    input = input.replace(/&Agrave;/ig, 'a');
    input = input.replace(/&Aacute;/ig, 'a');
    input = input.replace(/&Acirc;/ig, 'a');
    input = input.replace(/&Atilde;/ig, 'a');
    input = input.replace(/&Auml;/ig, 'a');
    input = input.replace(/&Aring;/ig, 'a');

    input = input.replace(/&Ccedil;/ig, 'c');

    input = input.replace(/&Egrave;/ig, 'e');
    input = input.replace(/&Eacute;/ig, 'e');
    input = input.replace(/&Ecirc;/ig, 'e');
    input = input.replace(/&Euml;/ig, 'e');

    input = input.replace(/&Igrave;/ig, 'i');
    input = input.replace(/&Iacute;/ig, 'i');
    input = input.replace(/&Icirc;/ig, 'i');
    input = input.replace(/&Iuml;/ig, 'i');

    input = input.replace(/&ETH;/ig, 'd');

    input = input.replace(/&Ntilde;/ig, 'n');

    input = input.replace(/&Oacute;/ig, 'o');
    input = input.replace(/&Ograve;/ig, 'o');
    input = input.replace(/&Ocirc;/ig, 'o');
    input = input.replace(/&Otilde;/ig, 'o');
    input = input.replace(/&Ouml;/ig, 'o');

    input = input.replace(/&Ugrave;/ig, 'u');
    input = input.replace(/&Uacute;/ig, 'u');
    input = input.replace(/&Ucirc;/ig, 'u');
    input = input.replace(/&Uuml;/ig, 'u');

    input = input.replace(/&Yacute;/ig, 'y');

    input = input.replace(/<("[^"]*"|'[^']*'|[^'">])*>/gi, '');
    input = input.replace(/^\s+|\s+$/g, '');
    input = input.replace(/&nbsp;/ig, "");

    return input.length;
  };
}

function selectDiscountTrigger() {
  return function (input) {
    var input = String(input);
    switch (input) {
      case "true":
        return "do not trigger the discount if other products outside the restriction are in the cart";
      case "false":
        return "trigger the discount if other products outside the restriction are in the cart";
      default:
        return input;
    }
  };
}

function selectDiscountRule() {
  return function (input) {
    var input = String(input);
    switch (input) {
      case "0":
        return "Amount ≥";
      case "1":
        return "Amount ≤";
      case "2":
        return "Weight ≥";
      case "3":
        return "Weight ≤";
      case "4":
        return "# of items ≥";
      case "5":
        return "# of items ≤";
      case "6":
        return "# of the same item ≥";
      case "7":
        return "# of the same item ≤";
      case "8":
        return "# of different items ≥";
      case "9":
        return "# of different items ≤";
      default:
        return input;
    }
  };
}

function cleanObject() {
  return function cleanObject(obj, deniedValues = ['', null, undefined], recursive = false) {
    for (let key in obj) {
      if (deniedValues.findIndex(v => _.isEqual(v, obj[key])) >= 0) {
        delete obj[key];
      }
      else if (typeof obj[key] === 'object') {
        if (Array.isArray(typeof obj[key])) {
          obj[key] = obj[key].filter(item => !deniedValues.includes(item));
        }
        else if (recursive) {
          obj[key] = cleanObject(obj[key], deniedValues, recursive);
        }
      }
    }
    return obj;
  };
}