'use strict';

const path = require('path');
const { ClientView, logServerError, ERR_SERVER_FAILED } = require(path.resolve('./modules/core/server/libs/errors.server.lib.js'));

const ErrorHandlers = [
  {
    match : (err) => err.code === 'ERR_NOT_PERMISSION' || Array.isArray(err.reactions) && err.reactions.includes('REQUEST_GRANT_PERMISSION'),
    do    : (err, req, res, ErrorView) => res.status(403).json(ErrorView(err))
  },
  {
    match : err => Array.isArray(err.errors) && err.errors.filter(e => e.code === 'ERR_NOT_PERMISSION'),
    do    : (err, req, res, ErrorView) => res.status(403).json(ErrorView(err))
  },
  {
    match : err => err.code === 'ERR_INVALID_QUERY',
    do    : (err, req, res, ErrorView) => { err.message = err.message || 'Thông tin tìm kiếm không hợp lệ'; res.status(400).json(ErrorView(err)); }
  },
  {
    match : (err) => Array.isArray(err.reactions) && err.reactions.includes('FIX_DATA'),
    do    : (err, req, res, ErrorView) => res.status(400).json(ErrorView(err))
  },
  {
    match : (err) => Array.isArray(err.reactions) && err.reactions.includes('RETRY_LATER'),
    do    : (err, req, res, ErrorView) => {
      logServerError(err);
      res.status(503).json(ErrorView(err));
    }
  },
  {
    match : (err) => Array.isArray(err.reactions) && err.reactions.includes('CONTACT_ADMIN'),
    do    : (err, req, res, ErrorView) => {
      logServerError(err);
      res.status(500).json(ErrorView(err));
    }
  },
  {
    match : (err) => true,
    do    : (err, req, res, ErrorView) => {
      let server_error = new ERR_SERVER_FAILED(err);
      logServerError(server_error);
      return res.status(500).json(ErrorView(server_error));
    }
  }

];

function ErrorHandlerMiddleware(err, req, res, next) {

  if (!err) { next() }

  const ErrorView = req.ErrorView || ClientView;

  for (let handler of ErrorHandlers) {
    if (handler.match(err)) {
      return handler.do(err, req, res, ErrorView);
    }
  }
}

module.exports = ErrorHandlerMiddleware;