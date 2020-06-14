'use strict';

const path = require('path');
const appConfig = require(path.resolve('./config/config'));
const stringify = require('json-stringify-safe');
const request = require('request');
const _ = require('lodash');
const { asyncRetry, Timeout } = require('x-retry');

const f = {
  async callAPI(di, config, ...args) {
    let { transform } = config;
  
    let data = args[0] || {};
  
    if (typeof transform === 'function') {
      data = transform(...args);
    }
  
    let it = { config, data, finalConfig : { ...config, ...data }, started_at: Date.now() };
  
    if (it.data.params) {
      it.finalConfig.url = di.compile(it.finalConfig.url, it.data.params);
    }
    if (it.finalConfig.query && typeof it.finalConfig.query === 'string') {
      if (!it.finalConfig.query.startsWith('?')) {
        it.finalConfig.url = it.finalConfig.url + '?' + it.finalConfig.query;
      }
      else {
        it.finalConfig.url = it.finalConfig.url + it.finalConfig.query;
      }
      delete it.finalConfig.query;
    }
  
    f.removePrivateFields(di.privateFields, it.finalConfig);

    const maxRetry = data.maxRetry || config.maxRetry;

    if (maxRetry > 0) {
      const timeout = data.timeout || config.timeout || Timeout({ minTimeout : 100, maxTimeout : 10000 });
      const isRetry = data.isRetry || config.isRetry;

      return asyncRetry({
        actor: 'API',
        activity: 'call',
        func: f._callAPI,
        args: [di, config, it],
        maxRetry, isRetry, timeout
      });
    }
    else {
      return f._callAPI(di, config, it);
    }
  },
  async _callAPI(di, config, it) {
    const { before, after, handler, resPath } = config;
    try {      
      if (typeof before === 'function') {
        await before(it);
      }

      it.finalConfig = f.adaptInterface(it.finalConfig);
  
      it.res  = await f.requestPromise(it.finalConfig);
      it.time = Date.now() - it.started_at;
  
      if (!it.data.noLog) {
        di.writeSuccessLog(it);
      }
  
      if (typeof resPath === 'string') {
        it.res = _.get(it.res, resPath);
      }
  
      if (typeof after === 'function') {
        await after(it);
      }
  
      return it.res;
    }
    catch (error) {
      it.time = Date.now() - it.started_at;
      it.error = error;
  
      di.writeErrorLog(it);
  
      if (typeof handler === 'function') {
        return handler(it);
      }
  
      throw error;
    }
  },
  adaptInterface(config) {
    const adapter = { query : 'qs' };

    for (let from in adapter) {
      let to = adapter[from];

      if (!config[to] && config[from]) {
        config[to] = config[from];
        delete config[from];
      }
    }

    return config;
  },
  requestPromise(config) {
    return new Promise((resolve, reject) => {
      return request(config, (err, res) => {
        if (err) {
          return reject(err);
        }
        if (res.statusCode >= 400) {
          return reject({ response : res });
        }
        return resolve(res);
      });
    });
  },
  now() { return new Date().toLocaleDateString('en-US', {
    year   : 'numeric',
    month  : '2-digit',
    day    : 'numeric',
    hour   : 'numeric',
    minute : 'numeric',
    second : 'numeric'
  })},
  WriteSuccessLog(now) {
    return function writeSuccessLog({ res, time }) {
      if (!appConfig.verbose) { return }
      console.log(`[ OK  ] [${now()}] ${res.request.method.toUpperCase()} ${res.request.uri.href} ${res.statusCode} ${time}ms`);
    }
  },
  WriteErrorLog(now) {
    return function writeErrorLog({ error, finalConfig : config, time }) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        let res = error.response;
        console.log(`[ERROR] [${now()}] ${String(config.method).toUpperCase()} ${res.request.href} ${res.statusCode} ${time}ms ${res.statusMessage} ${JSON.stringify(res.body)} [DATA] ${JSON.stringify(config.body)}`);
    
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log(`[ERROR] [${now()}] ${config.method} ${config.baseUrl || '' + config.url} ${time}ms ${stringify(error)}`);
      }
    }
  },
  compile(template, data) {
    let result = template.toString ? template.toString() : '';
    result = result.replace(/{.+?}/g, function (matcher) {
      var path = matcher.slice(1, -1).trim();
      return data[path];
    });
    return result;
  },
  removePrivateFields(privateFields, config) {
    for (let field of privateFields) {
      delete config[field];
    }
  },
  injectConfig({ service, config, excludes = {}, root = '' }) {
    for (let api in service) {
      if (!(typeof service[api] === 'object')) { continue }
  
      let apiPath = [root, api].join('.');
  
      if (typeof service[api].url === 'string') {
        for (let field in config) {
          if (!service[api][field]) {
            if (!(Array.isArray(excludes[apiPath]) && excludes[apiPath].includes(field))) {
              service[api][field] = config[field];
            }
          }
        }
      }
      else {
        f.injectConfig({ service : service[api], config, excludes, root : apiPath });
      }
    }
  }
};

function CallAPI(di) {
  di = Object.assign({
    privateFields   : [
      'before', 'after', 'handler',
      'resPath', 'simple_data', 'user',
      'params', 'shop', 'isRetry'
    ],
    now             : f.now,
    compile         : f.compile,
  }, di);

  di.writeSuccessLog = di.writeSuccessLog || f.WriteSuccessLog(di.now);
  di.writeErrorLog   = di.writeErrorLog || f.WriteErrorLog(di.now);

  return function callAPI(...args) {
    return f.callAPI(di, ...args);
  }
}

const callAPI = CallAPI();

module.exports = Object.assign(callAPI, { callAPI, CallAPI, injectConfig : f.injectConfig, f });