/**
 * @exports corsMiddleWare that check client origin depended on config.white_lists
 * 
 * @example
 * 
 * config = {
 *   white_lists : {
 *     frontend_api : [],
 *     adapter_api : ['http://abc.com']
 *   }
 * }
 * 
 * // From http://abc.com server, call
 * GET es/adapter-api/... 
 * => ok
 * GET es/frontend/...
 * => 
 * status 403
 * {
 *     "code": "ERR_CORS_NOT_ALLOWED",
 *     "message": "Not allowed by CORS",
 *     "reactions": [
 *         "REQUEST_GRANT_PERMISSION"
 *     ]
 * }
 */

'use strict';

const _ = require('lodash');
const path = require('path');
const config = require(path.resolve('./config/config'));
const cors = require('cors');
const { ERR, REACTION } = require(path.resolve('./modules/core/server/libs/errors.server.lib.js'));

const cors_configs = [
  {
    name : 'frontend api',
    isMatch : url => new RegExp(`${config.appslug}/frontend`, 'gi').test(url),
    white_lists : _.get(config, 'white_lists.frontend_api')
  },
  {
    name : 'adapter api',
    isMatch : url => new RegExp(`${config.appslug}/adapter-api`, 'gi').test(url),
    white_lists : _.get(config, 'white_lists.adapter_api')
  }
];

const corsOptionsDelegate = function (req, callback) {
  let is_allowed_origin = true;
  let error = null;

  if (config.white_lists) {
    const origin = req.header('Origin');
    const url = req.url;

    for (let { isMatch, white_lists } of cors_configs) {
      if (Array.isArray(white_lists)) {
        if (isMatch(url)) {
          if (!white_lists.includes(origin)) {
            is_allowed_origin = false;
            break;
          }
        }
      }
    }

    if (!is_allowed_origin) {
      error = new ERR({ code : 'ERR_CORS_NOT_ALLOWED', message : 'Not allowed by CORS', reactions : [REACTION.REQUEST_GRANT_PERMISSION]});
    }

    return callback(error, { origin : is_allowed_origin });
  }
}

const corsMiddleWare = cors(corsOptionsDelegate);

module.exports = { corsMiddleWare };