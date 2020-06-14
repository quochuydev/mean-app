'use strict';

const _ = require('lodash');
const stringify = require('json-stringify-safe');

//-------------------- [START] Reactions -----------------------//
const REACTION = {
  LOG : 'LOG',
  FIX_DATA : 'FIX_DATA',
  RETRY : 'RETRY',
  RETRY_LATER : 'RETRY_LATER',
  SEND_QUEUE : 'SEND_QUEUE',
  FINISH : 'FINISH',
  TERMINATE : 'TERMINATE',
  EXIT_PROCESS : 'EXIT_PROCESS',
  CONTACT_ADMIN : 'CONTACT_ADMIN',
  REQUEST_GRANT_PERMISSION : 'REQUEST_GRANT_PERMISSION',
};
//-------------------- [END] Reactions -----------------------//

//-------------------- [START] Errors -----------------------//

class ERR extends Error {
  constructor(props) {
    super();
    if (props) { Object.assign(this, props) }

    this.code = this.code || ERR.CODE;
  }

  /**
   * Log error, auto add stack trace
   * @param {object} error 
   * @return {object} error, with stack trace
   */
  static log(error) {
    if (!(error.stack && error.stack.length > 0)) {
      error.stack = new Error().stack;
    }
    const view = logServerError(error);
    return view;
  }

  static stringify(error) {
    return stringify(ServerView(error));
  }

  log() {
    const view = logServerError(this);
    return view;
  }

  serverView() {
    return ServerView(this);
  }

  clientView() {
    return ClientView(this);
  }

  canRetry() {
    return Array.isArray(this.reactions) && this.reactions.some(reaction => /RETRY/gi.test(reaction));
  }

  static get CODE () {
    return 'ERR';
  }
}

class ERR_INVALID_QUERY extends ERR {
  constructor({ errors, entity }) {
    super();
    this.code      = 'ERR_INVALID_QUERY';
    this.entity    = entity;
    this.errors    = errors;
    this.reactions = [REACTION.FIX_DATA];
  }

  static get CODE () {
    return 'ERR_INVALID_QUERY';
  }
}

class ERR_EMPTY_DATA extends ERR {
  constructor(entity) {
    super();
    this.code      = 'ERR_EMPTY_DATA';
    this.reactions = [REACTION.FIX_DATA];
    this.entity    = entity;
  }

  static get CODE () {
    return 'ERR_EMPTY_DATA';
  }
}

class ERR_INVALID_DATA extends ERR {
  constructor(props) {
    super(props);
    this.code      = 'ERR_INVALID_DATA';
    this.reactions = [REACTION.FIX_DATA];
  }

  static get CODE () {
    return 'ERR_INVALID_DATA';
  }

  EtpAdapterView() {
    return {
      reaction: this.reactions[0],
      code: this.code,
      message: this.message,
      info: {
        dataPath: this.dataPath
      }
    };
  }
}

class ERR_VALIDATION_FAILED extends ERR {
  constructor({ entity, errors }) {
    super();
    this.code      = 'ERR_VALIDATION_FAILED';
    this.message   = `Invalid ${entity}`;
    this.entity    = entity;
    this.errors    = errors;
    this.reactions = [REACTION.FIX_DATA];
  }

  static get CODE () {
    return 'ERR_VALIDATION_FAILED';
  }

  EtpAdapterView() {
    return {
      reaction: this.reactions[0],
      code: this.code,
      message: 'Invalid data',
      info: {
        errors: this.errors.map(error => ({
          message: error.message,
          dataPath: error.dataPath,
          keyword: error.keyword
        }))
      }
    };
  }
}

class ERR_SERVICE_TEMPORARILY_UNAVAILABLE extends ERR {
  constructor({ service, error }) {
    super();
    this.code        = 'ERR_SERVICE_TEMPORARILY_UNAVAILABLE';
    this.reactions   = [REACTION.RETRY_LATER];
    this.service     = service;
    this.origin_error = error;
  }

  static get CODE () {
    return 'ERR_SERVICE_TEMPORARILY_UNAVAILABLE';
  }
} 

class ERR_SERVICE_FAILED extends ERR {
  constructor({ service, error }) {
    super();
    this.code        = 'ERR_SERVICE_FAILED';
    this.id          = String(Date.now());
    this.reactions   = [REACTION.CONTACT_ADMIN];
    this.service     = service;
    this.origin_error = error;
  }

  static get CODE () {
    return 'ERR_SERVICE_FAILED';
  }

  ClientView() {
    return _.pick(this, ['code', 'id', 'reactions', 'message', 'service']);
  }
} 

class ERR_SERVER_FAILED extends ERR {
  constructor(origin_error) {
    super();
    this.code        = 'ERR_SERVER_FAILED';
    this.id          = String(Date.now());
    this.reactions   = [REACTION.CONTACT_ADMIN];
    this.origin_error = origin_error;
    this.message     = `Server failed, please contact admin. Error ID : ${this.id}`;
  }

  static get CODE () {
    return 'ERR_SERVER_FAILED';
  }

  ClientView() {
    return _.pick(this, ['code', 'id', 'reactions', 'message']);
  }

  EtpAdapterView() {
    return {
      reaction: this.reactions[0],
      code: this.code,
      message: this.message,
      info: {
        id: this.id
      }
    };
  }
} 

class ERR_QUERY_SIZE_TOO_LARGE extends ERR {
  constructor(size) {
    super();
    this.code      = 'ERR_QUERY_SIZE_TOO_LARGE';
    this.size      = size;
    this.message   = `The query size is too large, (page - 1) * limit + limit must be <= 10000, but was ${this.size}`;
    this.reactions = [REACTION.FIX_DATA];
  }

  static get CODE () {
    return 'ERR_QUERY_SIZE_TOO_LARGE';
  }
}

class ERR_WEAK_PASSWORD extends ERR {
  constructor(additionalProps) {
    super(additionalProps);

    this.code = 'ERR_WEAK_PASSWORD';
    this.message = 'Mật khẩu phải dài ít nhất 8 kí tự, bao gồm các ký tự: in hoa, chữ thường, chữ số, ký tự đặc biệt.\n Không chấp nhận kí tự khoảng trắng.';
    this.reactions = [REACTION.FIX_DATA];
  }

  static get CODE () {
    return 'ERR_WEAK_PASSWORD';
  }
}

class ERR_NOT_PERMISSION extends ERR {
  constructor({ key, value, field, prevented_value }) {
    super({ key, value });
    this.code            = 'ERR_NOT_PERMISSION';
    this.field           = field;
    this.prevented_value = prevented_value;
    this.message         = `Can't see item has ${field} = ${prevented_value}`;
    this.reactions       = [REACTION.REQUEST_GRANT_PERMISSION];
  }

  static get CODE () {
    return 'ERR_NOT_PERMISSION';
  }
}

class ERR_ENTRY_NOT_FOUND extends ERR {
  constructor(props) {
    super(props);
    this.code = 'ERR_ENTRY_NOT_FOUND';
    this.reactions = [REACTION.FIX_DATA];
  }

  static get CODE () {
    return 'ERR_ENTRY_NOT_FOUND';
  }
}

class ERR_ORDER_AUTO_PROCESS_TOOL_FAILED extends ERR {
  constructor(props) {
    super(props);
    this.code = 'ERR_ORDER_AUTO_PROCESS_TOOL_FAILED';
    this.reactions = [REACTION.TERMINATE];
  }

  static get CODE () {
    return 'ERR_ORDER_AUTO_PROCESS_TOOL_FAILED';
  }
}

class ERR_REACHED_MAX_RETRY_COUNT extends ERR {
  constructor(props) {
    super(props);
    this.code = 'ERR_REACHED_MAX_RETRY_COUNT';
    this.reactions = [REACTION.TERMINATE];
  }

  static get CODE () {
    return 'ERR_REACHED_MAX_RETRY_COUNT';
  }
}

class ERR_CANNOT_RETRY extends ERR {
  constructor(props) {
    super(props);
    this.code = 'ERR_CANNOT_RETRY';
    this.reactions = [REACTION.TERMINATE];
  }

  static get CODE () {
    return 'ERR_CANNOT_RETRY';
  }
}

class DEBUG_ACTIVITY_FAILED extends ERR {
  constructor({ activity, started_at, args, failed_at, duration, error }) {
    super({ activity, started_at, args, failed_at, duration, error });
    this.message = `[DEBUG] activity ${activity} execute failed with error: ${error.message || error.code}`;
    this.code = 'DEBUG_ACTIVITY_FAILED';
    this.reactions = [REACTION.LOG];
  }

  static get CODE () {
    return 'DEBUG_ACTIVITY_FAILED';
  }
}

class ERR_NETWORK_FAILED extends ERR {
  constructor(origin_error) {
    super();
    this.origin_error = origin_error;
    this.code = ERR_NETWORK_FAILED.CODE;
    this.reactions = [REACTION.EXIT_PROCESS];
  }

  static get CODE () {
    return 'ERR_NETWORK_FAILED';
  }

  static get sysCodes() {
    return [
      'EAI_AGAIN', // dns can't resolve domain to ip address
      'EACCES',// (Permission denied): An attempt was made to access a file in a way forbidden by its file access permissions.
      'EADDRINUSE',// (Address already in use): An attempt to bind a server (net, http, or https) to a local address failed due to another server on the local system already occupying that address.
      'ECONNREFUSED',// (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.
      'ENOTFOUND',// (DNS lookup failed): Indicates a DNS failure of either EAI_NODATA or EAI_NONAME. This is not a standard POSIX error.
    ];
  }
}

class ERR_NETWORK_TEMPORARILY_FAILED extends ERR {
  constructor(origin_error) {
    super();
    this.origin_error = origin_error;
    this.code = ERR_NETWORK_TEMPORARILY_FAILED.CODE;
    this.reactions = [REACTION.RETRY_LATER];
  }

  static get CODE () {
    return 'ERR_NETWORK_TEMPORARILY_FAILED';
  }

  static get sysCodes() {
    return [
      'ECONNRESET',// (Connection reset by peer): A connection was forcibly closed by a peer. This normally results from a loss of the connection on the remote socket due to a timeout or reboot. Commonly encountered via the http and net modules.
      'EPIPE',// (Broken pipe): A write on a pipe, socket, or FIFO for which there is no process to read the data. Commonly encountered at the net and http layers, indicative that the remote side of the stream being written to has been closed.
      'ETIMEDOUT',// (Operation timed out): A connect or send request failed because the connected party did not properly respond after a period of time. Usually encountered by http or net — often a sign that a socket.end() was not properly called.
    ];
  }
}

class ERR_DNS_FAILED extends ERR {
  constructor(origin_error) {
    super();
    this.origin_error = origin_error;
    this.code = ERR_DNS_FAILED.CODE;
    this.reactions = [REACTION.EXIT_PROCESS];
  }

  static get CODE () {
    return 'ERR_DNS_FAILED';
  }
}

class ERR_CONNECT_TIMEOUT extends ERR {
  constructor(origin_error) {
    super();
    this.origin_error = origin_error;
    this.code = ERR_CONNECT_TIMEOUT.CODE;
    this.reactions = [REACTION.RETRY_LATER];
  }

  static get CODE () {
    return 'ERR_CONNECT_TIMEOUT';
  }
}

class ERR_MONGODB_DISCONNECTED extends ERR {
  constructor(origin_error) {
    super();
    this.origin_error = origin_error;
    this.code = ERR_MONGODB_DISCONNECTED.CODE;
    this.reactions = [REACTION.RETRY_LATER];
  }

  static get CODE () {
    return 'ERR_MONGODB_DISCONNECTED';
  }
}

class UNEXPECTED_ERROR extends ERR {
  constructor(props) {
    super(props);
    this.code = UNEXPECTED_ERROR.CODE;
    this.reactions = [REACTION.CONTACT_ADMIN];
  }

  static get CODE () {
    return 'UNEXPECTED_ERROR';
  }
}

//-------------------- [END] Errors -----------------------//


//-------------------- [START] Signals -----------------------//

class SIG_FINISH extends Error {
  constructor(result) {
    super('Finish');
    this.result    = result;
    this.code      = 'SIG_FINISH';
    this.reactions = [REACTION.FINISH];
  }

  static get CODE () {
    return 'SIG_FINISH';
  }
}

class SIG_TERMINATE extends Error {
  constructor(reason) {
    super('Finish');
    this.reason    = reason;
    this.code      = 'SIG_TERMINATE';
    this.reactions = [REACTION.TERMINATE];
  }

  static get CODE () {
    return 'SIG_TERMINATE';
  }
}

class SIG_MIS_CONDITION extends Error {
  constructor(condition) {
    super('Mis condition');
    this.condition = condition;
    this.code      = 'SIG_MIS_CONDITION';
    this.reactions = [REACTION.TERMINATE];
  }

  static get CODE () {
    return 'SIG_MIS_CONDITION';
  }
}

class SIG_RETRY extends Error {
  constructor(condition) {
    super('Retry');
    this.condition = condition;
    this.code      = 'SIG_RETRY';
    this.reactions = [REACTION.RETRY];
  }

  static get CODE () {
    return 'SIG_RETRY';
  }
}

//-------------------- [END] Signals -----------------------//

//-------------------- [START] Utils -----------------------//

/**
 * Convert object with hidden properties like getter, setter, prototypes to full plain object,
 * so their properties will includes in stringified string
 * 
 * @param {object} obj 
 * @param {string[]} hiddenProps getter, setter, prototypes
 * 
 * @return {object}
 */
function toFullPlainObject(obj, hiddenProps, ignoreValues = [undefined, '']) {
  let res = Object.assign({}, obj);

  for (let prop of hiddenProps) {
    if (!ignoreValues.includes(obj[prop])) {
      res[prop] = obj[prop];
    }
  }

  return res;
}

function ClientView(error) {
  let view = error;
  
  if (error && typeof error === 'object') {
    view = typeof error.ClientView === 'function' ? error.ClientView() : toFullPlainObject(error, ['message']);
    delete view.stack;
    view = SubErrorView({ view, GenView : ClientView });
  }

  return view;
}

function EtpAdapterView(error) {
  let view = error;
  
  if (error && typeof error === 'object') {
    view = typeof error.EtpAdapterView === 'function' ? error.EtpAdapterView() : toFullPlainObject(error, ['message']);
    delete view.stack;
    view = SubErrorView({ view, GenView : EtpAdapterView });
  }

  return view;
}

function ServerView(error) {
  let view = error;

  if (error && typeof error === 'object') {
    view = typeof error.ServerView === 'function' ? error.ServerView() : toFullPlainObject(error, ['message', 'stack']);

    view = SubErrorView({ view });  
  }

  return view;
}

/**
 * @note this method mutate view
 */
function SubErrorView({ view, sub_keys = ['error', 'err', 'origin_error'], GenView = ServerView }) {
  if (view && typeof view === 'object') {
    for (let sub of sub_keys) {
      if (view[sub] && typeof view[sub] === 'object') {
        view[sub] = GenView(view[sub]);
      }
    }
  }
  return view;
}

function logServerError(error) {
  const view = ServerView(error);
  
  if (process.env.NODE_ENV === 'development' && process.env.LOG_JSON_STRING !== 'true') {
    console.error(view);
  }
  else {
    console.log(stringify(view));
  }

  return view;
}

//-------------------- [END] Utils -----------------------//


module.exports = {
  ClientView, ServerView, EtpAdapterView, logServerError,
  log : logServerError,
  REACTION,
  ERR,
  ERR_INVALID_QUERY,
  ERR_EMPTY_DATA,
  ERR_INVALID_DATA,
  ERR_SERVER_FAILED,
  ERR_SERVICE_FAILED,
  ERR_VALIDATION_FAILED,
  ERR_SERVICE_TEMPORARILY_UNAVAILABLE,
  ERR_QUERY_SIZE_TOO_LARGE,
  ERR_WEAK_PASSWORD,
  ERR_NOT_PERMISSION,
  ERR_DNS_FAILED,
  ERR_MONGODB_DISCONNECTED,
  ERR_CONNECT_TIMEOUT,
  SIG_FINISH,
  SIG_RETRY,
  SIG_TERMINATE,
  SIG_MIS_CONDITION,
  ERR_ENTRY_NOT_FOUND,
  ERR_ORDER_AUTO_PROCESS_TOOL_FAILED,
  ERR_REACHED_MAX_RETRY_COUNT,
  ERR_CANNOT_RETRY,
  UNEXPECTED_ERROR,
  ERR_NETWORK_FAILED,
  ERR_NETWORK_TEMPORARILY_FAILED,
};
