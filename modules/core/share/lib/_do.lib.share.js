(function () {

  const Module = {
    name: '_do',
    version: '1.0',
    dependencies: {
      _: { name: 'lodash' },
      _is: { name: '_is' },
      _CONST: { name: '_CONST' }
    },
    factory: function (di) {
      const _ = di._;

      const _do = {
        randomPassword: function randomPassword() {
          const chars = [
            _.random(65, 90), // A-Z
            _.random(35, 126), // random
            _.random(35, 38), // special
            _.random(97, 122), // a-z
            _.random(48, 57), // 0 - 9
          ];

          const length = Math.ceil(8 + Math.random() * 42);

          for (let i = chars.length; i < length; i++) {
            chars.push(_.random(35, 126));
          }

          let pass = chars.map(char => String.fromCharCode(char)).join('');

          if (di._is.strongPassword(pass)) { return pass }
          else { return _do.randomPassword() }
        },
        date: {
          cast: (val) => {
            if (val instanceof Date) { return val }
            if (typeof val === 'number' || typeof val === 'string') {
              val = new Date(val);
            }
            if (Number.isNaN(val)) { throw new TypeError('Invalid date ', val) }
            return val;
          },
          min: function (date1, date2) {
            date1 = _do.date.cast(date1);
            date2 = _do.date.cast(date2);

            return date1 < date2 ? date1 : date2;
          },
          max: function (date1, date2) {
            date1 = _do.date.cast(date1);
            date2 = _do.date.cast(date2);

            return date1 > date2 ? date1 : date2;
          }
        },
        Compile(matchingPattern) {
          return function compile(template, data) {
            if (!(data && typeof data === 'object')) {
              return template;
            }
            let result = template.toString ? template.toString() : '';
            result = result.replace(matchingPattern, function (matcher) {
              var path = matcher.slice(1, -1).trim();
              return data[path];
            });
            return result;
          }
        },
        delay(ms) {
          return new Promise(resolve => {
            if (ms > 0) {
              setTimeout(resolve, ms);
            }
            return resolve();
          })
        },
        parseEventName(eventName) {
          let topic = null, action = null;

          if (typeof eventName !== 'string') {
            return [topic, action];
          }

          topic = action = '*';

          const name_paths = eventName.split('.');

          action = name_paths.pop();

          if (name_paths.length > 0) {
            topic = name_paths.join('.');
          }

          return [topic, action];
        },
        waitEvent({ emitter, resolveEvent, rejectEvents }) {
          return new Promise((resolve, reject) => {
            if (resolveEvent) {
              emitter.once(resolveEvent, data => {
                return resolve(data);
              })
            }
            if (rejectEvents) {
              for (let rejectEvent of rejectEvents) {
                emitter.once(rejectEvent, error => {
                  return reject(error);
                });
              }
            }
          })
        },
        traverse({ source = {}, match, work, paths = [], maxDepth = 10, curDepth = 0 }) {
          if (curDepth >= maxDepth) {
            throw new Error(`Reached max depth ${maxDepth}`);
          }

          if (source && typeof source === 'object') {
            for (let key in source) {
              let value = source[key];
              if (match({ source, paths, source, key, value })) {
                work({ source, paths, source, key, value });
              }
              else {
                _do.traverse({ source: value, match, work, paths: [...paths, key], maxDepth, curDepth: curDepth + 1 });
              }
            }
          }
        },
        parseQuery: function parseQuery({ query, defaults = { page: 1, limit: 20, fields: '' }, maxLimit = 1000 }) {
          let { page = 1, limit = 20, fields, sort, ...filter } = { ...defaults, ...query };

          page = Number(page);
          limit = Math.min(Number(limit), maxLimit);
          let skip = (page - 1) * limit;

          return { page, skip, limit, filter, sort, fields };
        },
        /**
         * Join list strings
         * @param {string[]} strings list strings will be joined
         *
         * @return {string} joined string
         *
         * @example
         * joins(['Dinh', 'Hoang']) => 'Dinh Hoang'
         * joinS([null, 'Hoang']) => 'Hoang'
         * joinS([null, undefined]) => ''
         */
        joinS(strings, delimiter = ' ', deniedValues = [null, undefined, '']) {
          let validStrings = [];
          if (Array.isArray(strings)) {
            strings.forEach(s => {
              if (!deniedValues.includes(s)) {
                validStrings.push(s);
              }
            });
          }
          return validStrings.join(delimiter);
        },
        floatToStringFormat(numeric, decimals) {
          var amount = numeric.toFixed(decimals).toString();
          amount.replace('.', '.');
          if (amount.match('^[\.' + '.' + ']\d+')) {
            return "0" + amount;
          }
          else {
            return amount;
          }
        },
        addCommasToMoneyString(moneyString) {
          return moneyString.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + ',');
        },
        formatMoney(input) {
          var cents = input;
          if (typeof cents == 'string') cents = cents.replace(',', '');
          cents = Number(cents);

          var value = '';

          value = _do.addCommasToMoneyString(_do.floatToStringFormat(cents, 0));

          return value;
        }
      };

      _do.compile = _do.Compile(/{.+?}/g);

      return _do;
    }
  };

  let di = {};

  if (typeof module === 'object' && module.exports) {
    di._ = require('lodash');
    di._is = require('./_is.lib.share.js');
    di._CONST = require('./_CONST.lib.share.js');
    module.exports = Module.factory(di);
  }
  else if (typeof window === 'object') {
    di = window;
    window[Module.name] = Module.factory(di);
  }
})();