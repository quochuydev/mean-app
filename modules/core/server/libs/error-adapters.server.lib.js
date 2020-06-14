/**
 * @module ErrorAdapter
 */

'use strict';

const _ = require('lodash');
const path = require('path');
const { SERVICE_CODES } = require(path.resolve('./modules/core/share/lib/_CONST.lib.share'));

const {
  REACTION,
  ERR,
  ERR_NETWORK_FAILED,
  ERR_NETWORK_TEMPORARILY_FAILED,
  ERR_SERVICE_TEMPORARILY_UNAVAILABLE,
  ERR_INVALID_DATA,
  ERR_SERVICE_FAILED,
  ERR_MONGODB_DISCONNECTED,
  ERR_SERVER_FAILED,
  ERR_ENTRY_NOT_FOUND,
} = require('./errors.server.lib');

const SubErrorAdapter = {
  System : {
    ERR_NETWORK_FAILED : {
      match : (error) => ERR_NETWORK_FAILED.sysCodes.some(sysCode => error.code === sysCode || error.message.includes(sysCode)),
      do : (error) => new ERR_NETWORK_FAILED(error),
    },
    ERR_NETWORK_TEMPORARILY_FAILED : {
      match : (error) => ERR_NETWORK_TEMPORARILY_FAILED.sysCodes.some(sysCode => error.code === sysCode || error.message.includes(sysCode)),
      do : (error) => new ERR_NETWORK_TEMPORARILY_FAILED(error),
    },
  },
  Seller : {
    ERR_SERVICE_TEMPORARILY_UNAVAILABLE : {
      match : (error) => {
        const expected_status_codes = [429, 502, 504];
        const actual_status_code = error.statusCode || error.status;

        return expected_status_codes.includes(actual_status_code)
        || expected_status_codes.includes(actual_status_code)
        || expected_status_codes.some(status => new RegExp(`status.+${status}`, 'gi').test(error.message))
      },
      do : (error) => new ERR_SERVICE_TEMPORARILY_UNAVAILABLE({ service : SERVICE_CODES.SELLER, error }),
    },
    ERR_ENTRY_NOT_FOUND : {
      match : (error) => {
        return error.statusCode === 404 
        || error.status === 404 
        || /status.+404/gi.test(error.message)
      },
      do : (error) => new ERR_ENTRY_NOT_FOUND({ service : SERVICE_CODES.SELLER, error }),
    },
    ERR_INVALID_DATA : {
      match : (error) => {
        const actual_status_code = error.statusCode || error.status;

        return actual_status_code >= 400 && actual_status_code < 500
        || [400, 422, 404].some(status => new RegExp(`status.+${status}`, 'gi').test(error.message))
      },
      do : (error) => new ERR_INVALID_DATA({ 
        service : SERVICE_CODES.SELLER, error,
        message : _.get(error, 'body.errors', error.message)  
      }),
    },
    ERR_SERVICE_FAILED : {
      match : (error) => {
        return error.statusCode === 500 
        || error.status === 500 
        || /status.+500/gi.test(error.message)
      },
      do : (error) => new ERR_SERVICE_FAILED({ service : SERVICE_CODES.SELLER, error }),
    },
  },
  Mongoose : {
    ERR_MONGODB_DISCONNECTED : {
      match : error => {
        return error.name === 'MongoError' && (
          error.message.includes('ECONNRESET')
          || error.code === 11600
          || error.codeName === "InterruptedAtShutdown"
          || error.message.includes('interrupted at shutdown')
        )
      },
      do : error => new ERR_MONGODB_DISCONNECTED(error)
    }
  },
  UnExpected : {
    match : () => true,
    do    : (error, data) => new ERR_SERVER_FAILED({ error, data })
  }
};

const SubErrorAdapterList = {
  System : Object.values(SubErrorAdapter.System),
  Seller : Object.values(SubErrorAdapter.Seller),
  Mongoose : Object.values(SubErrorAdapter.Mongoose),
  UnExpected : SubErrorAdapter.UnExpected,
};

const ErrorAdapter = {
  System : ErrorAdapterFactory({ SubErrorAdapterList : [...SubErrorAdapterList.System, SubErrorAdapterList.UnExpected] }),
  Seller : ErrorAdapterFactory({ SubErrorAdapterList : [...SubErrorAdapterList.Seller, SubErrorAdapterList.UnExpected] }),
  Mongoose : ErrorAdapterFactory({ SubErrorAdapterList : [...SubErrorAdapterList.Mongoose, SubErrorAdapterList.UnExpected] }),
  Guess : ErrorAdapterFactory({ SubErrorAdapterList : [
    ...SubErrorAdapterList.Mongoose,
    ...SubErrorAdapterList.System,
    ...SubErrorAdapterList.Seller,
    SubErrorAdapterList.UnExpected
  ]})
};

function ErrorAdapterFactory({ SubErrorAdapterList }) {
  return function adaptError(error, data) {
    let app_error = null;

    if (error instanceof ERR || Array.isArray(error.reactions)) {
      app_error = error;
    }
    else {
      if (typeof error === 'string') {
        error = new Error(error);
      }
      error.message = error.message || '';
  
      for (let adapter of SubErrorAdapterList) {
        if (adapter.match(error, data)) {
          app_error = adapter.do(error, data);
          break;
        }
      }
    }

    if (app_error && app_error.reactions.includes(REACTION.EXIT_PROCESS)) {
      // app_error.log();
      // return process.exit(1);
      console.log('[EXIT_PROCESS] in the future');
    }

    return app_error;
  }
}

module.exports = { ErrorAdapter, SubErrorAdapter, SubErrorAdapterList };

