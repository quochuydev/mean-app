/**
 * @module ErrorAdapter
 */

'use strict';

const _ = require('lodash');
const assert = require('assert');
const path = require('path');
const { SERVICE_CODES } = require(path.resolve('./modules/core/share/lib/_CONST.lib.share'));

const { ErrorAdapter } = require('./error-adapters.server.lib');

const {
  ERR_NETWORK_FAILED,
  ERR_NETWORK_TEMPORARILY_FAILED,
  ERR_MONGODB_DISCONNECTED,
  ERR_SERVICE_FAILED,
  ERR_SERVICE_TEMPORARILY_UNAVAILABLE ,
} = require('./errors.server.lib');

describe('ErrorAdapter', () => {

  describe('System', () => {

    it ('should adapt dns error to ERR_NETWORK_FAILED', () => {

      const seller_dns_error = {
        "errno"    : "EAI_AGAIN",
        "code"     : "EAI_AGAIN",
        "syscall"  : "getaddrinfo",
        "hostname" : "shop.com",
        "host"     : "shop.com",
        "port"     : 443,
        "message"  : "getaddrinfo EAI_AGAIN shop.com:443",
        "stack"    : "Error: getaddrinfo EAI_AGAIN shop.com:443\n    at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:67:26)"
      };

      const actual_app_error = ErrorAdapter.System(seller_dns_error);

      const expected_app_error = new ERR_NETWORK_FAILED(seller_dns_error);

      assert.deepEqual(actual_app_error, expected_app_error);
    });

    it ('should adapt error ETIMEDOUT to ERR_NETWORK_TEMPORARILY_FAILED', () => {

      const error = {
        "errno": "ETIMEDOUT",
        "code": "ETIMEDOUT",
        "syscall": "connect",
        "address": "42.117.4.246",
        "port": 5000
      };

      const expected_app_error = new ERR_NETWORK_TEMPORARILY_FAILED(error);

      const actual_app_error = ErrorAdapter.System(error);

      assert.deepEqual(expected_app_error, actual_app_error);
    });

  });

  describe('Seller', () => {
    it ('should adapt error with status code 429, 502, 504 to ERR_SERVICE_TEMPORARILY_UNAVAILABLE', () => {
      const temporary_errors = [
        { statusCode : 429 },
        { message : 'API statusCode: 429, Too many requests' },
        { statusCode : 502 },
        { message : 'API statusCode: 502, <html>\r\n<head><title>502 Bad Gateway</title></head>\r\n<body bgcolor=\"white\">\r\n<center><h1>502 Bad Gateway</h1></center>\r\n<hr><center>nginx/1.10.1</center>\r\n</body>\r\n</html>\r\n' },
        { statusCode : 504 },
        { message : 'API statusCode: 504, <html>\r\n<head><title>504 Gateway Time-out</title></head>\r\n<body bgcolor=\"white\">\r\n<center><h1>504 Gateway Time-out</h1></center>\r\n<hr><center>nginx/1.10.1</center>\r\n</body>\r\n</html>\r\n' },
      ];

      for (let error of temporary_errors) {
        const actual_app_error = ErrorAdapter.Seller(error);
        const expected_app_error = new ERR_SERVICE_TEMPORARILY_UNAVAILABLE({ service : SERVICE_CODES.SELLER, error });

        assert.deepEqual(actual_app_error, expected_app_error);
      }
    });

    it ('should adapt error status code 500 to ERR_SERVICE_FAILED', () => {
      const service_errors = [
        { statusCode : 500 },
        { message : 'API statusCode: 500, <!DOCTYPE html>\r\n<html>\r\n    <head>\r\n        <title>Security Exception</title>\r\n        <meta name=\"viewport\" content=\"width=device-width\" />' },
      ];

      for (let error of service_errors) {
        const actual_app_error = ErrorAdapter.Seller(error);
        const expected_app_error = new ERR_SERVICE_FAILED({ service : SERVICE_CODES.SELLER, error });
        assert.ok(actual_app_error.id);
        assert.deepEqual(_.omit(actual_app_error, 'id'), _.omit(expected_app_error, 'id'));
      }
    })
  });

  describe('Mongoose', () => {

    it ('should adapt disconnect errors to ERR_MONGODB_DISCONNECTED', () => {

      const mongo_disconnect_errors = [
        {
          "name": "MongoError",
          "message": "interrupted at shutdown",
          "ok": 0,
          "errmsg": "interrupted at shutdown",
          "code": 11600,
          "codeName": "InterruptedAtShutdown",
          "stack": "MongoError: interrupted at shutdown\n    at Function.MongoError.create (h:\\knes1\\node_modules\\mongoose\\node_modules\\mongodb-core\\lib\\error.js:31:11)\n    at h:\\knes1\\node_modules\\mongoose\\node_modules\\mongodb-core\\lib\\connection\\pool.js:497:72\n    at authenticateStragglers (h:\\knes1\\node_modules\\mongoose\\node_modules\\mongodb-core\\lib\\connection\\pool.js:443:16)\n    at Connection.messageHandler (h:\\knes1\\node_modules\\mongoose\\node_modules\\mongodb-core\\lib\\connection\\pool.js:477:5)\n    at Socket.<anonymous> (h:\\knes1\\node_modules\\mongoose\\node_modules\\mongodb-core\\lib\\connection\\connection.js:333:22)\n    at Socket.emit (events.js:182:13)\n    at addChunk (_stream_readable.js:283:12)\n    at readableAddChunk (_stream_readable.js:264:11)\n    at Socket.Readable.push (_stream_readable.js:219:10)\n    at TCP.onStreamRead [as onread] (internal/stream_base_commons.js:94:17)"
        },
        {
          "name": "MongoError",
          "message": "read ECONNRESET",
          "stack": "Error: read ECONNRESET\n    at TCP.onStreamRead (internal/stream_base_commons.js:111:27)"
        },
        {
          "name": "MongoError",
          "message": "write ECONNRESET",
          "stack": "Error: write ECONNRESET\n    at afterWriteDispatched (internal/stream_base_commons.js:78:25)\n    at writeGeneric (internal/stream_base_commons.js:73:3)\n    at Socket._writeGeneric (net.js:717:5)\n    at Socket._write (net.js:729:8)\n    at doWrite (_stream_writable.js:410:12)\n    at writeOrBuffer (_stream_writable.js:394:5)\n    at Socket.Writable.write (_stream_writable.js:294:11)\n    at Connection.write (h:\\knes\\node_modules\\mongoose\\node_modules\\mongodb-core\\lib\\connection\\connection.js:543:23)\n    at h:\\knes\\node_modules\\mongoose\\node_modules\\mongodb-core\\lib\\connection\\pool.js:1298:44\n    at waitForAuth (h:\\knes\\node_modules\\mongoose\\node_modules\\mongodb-core\\lib\\connection\\pool.js:1156:39)\n    at h:\\knes\\node_modules\\mongoose\\node_modules\\mongodb-core\\lib\\connection\\pool.js:1164:5\n    at h:\\knes\\node_modules\\mongoose\\node_modules\\mongodb-core\\lib\\connection\\pool.js:1028:21\n    at process._tickCallback (internal/process/next_tick.js:61:11)"
        }
      ];

      for (let error of mongo_disconnect_errors) {
        const actual_app_error = ErrorAdapter.Mongoose(error);
        const expected_app_error = new ERR_MONGODB_DISCONNECTED(error);

        assert.deepEqual(expected_app_error, actual_app_error);
      }
    });

  });

});



