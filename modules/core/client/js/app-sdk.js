(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("app-sdk", [], factory);
	else if(typeof exports === 'object')
		exports["app-sdk"] = factory();
	else
		root["app-sdk"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var package_json_1 = __importDefault(__webpack_require__(13));
var uuid_2 = __importDefault(__webpack_require__(14));
var uuid_1 = __importDefault(uuid_2.default);
var merge_1 = __importDefault(__webpack_require__(15));
function getVersion() {
    return package_json_1.default.version;
}
exports.getVersion = getVersion;
function actionWrapper(action) {
    return __assign({}, action, { version: getVersion(), clientInterface: {
            name: package_json_1.default.name,
            version: getVersion(),
        } });
}
exports.actionWrapper = actionWrapper;
var ActionSet = (function () {
    function ActionSet(app, type, group, id) {
        var _this = this;
        this.app = app;
        this.type = type;
        this.group = group;
        this.subgroups = [];
        if (!app) {
            throw new Error('Missing required `app`');
        }
        this.id = id || uuid_1.default();
        this.defaultGroup = group;
        var defaultSet = this.set;
        this.set = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return defaultSet.apply(_this, args);
        };
    }
    ActionSet.prototype.set = function () {
        var _ = [];
        for (var _a = 0; _a < arguments.length; _a++) {
            _[_a] = arguments[_a];
        }
        var _ = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _[_i] = arguments[_i];
        }
    };
    ActionSet.prototype.get = function () {
        return {
            id: this.id,
            type: this.type,
            subgroups: this.subgroups,
        };
    };
    return ActionSet;
}());
exports.ActionSet = ActionSet;
function getMergedProps(props, newProps) {
    var merged = merge_1.default(props, newProps);
    if (!merged) {
        var cloned = Object.assign(props, newProps);
        return cloned;
    }
    return merged;
}
exports.getMergedProps = getMergedProps;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Group;
(function (Group) {
    Group["Button"] = "Button";
    Group["ButtonGroup"] = "ButtonGroup";
    Group["Cart"] = "Cart";
    Group["Error"] = "Error";
    Group["Features"] = "Features";
    Group["Fullscreen"] = "Fullscreen";
    Group["Toast"] = "Toast";
    Group["Loading"] = "Loading";
    Group["Modal"] = "Modal";
    Group["Navigation"] = "Navigation";
    Group["Print"] = "Print";
    Group["TitleBar"] = "TitleBar";
    Group["ResourcePicker"] = "Resource_Picker";
    Group["ContextualSaveBar"] = "ContextualSaveBar";
    Group["Scanner"] = "Scanner";
    Group["Share"] = "Share";
})(Group = exports.Group || (exports.Group = {}));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var redirect_1 = __importStar(__webpack_require__(20));
var MessageTransport_1 = __importStar(__webpack_require__(6));
var types_1 = __importStar(__webpack_require__(7));
function redirectHandler(hostFrame, config) {
    var apiKey = config.apiKey, shopOrigin = config.shopOrigin, embedded = config.embedded, saleChannel = config.saleChannel;
    var location = redirect_1.getLocation();
    if (!location ||
        !apiKey ||
        !shopOrigin ||
        !embedded ||
        !redirect_1.shouldRedirect(hostFrame)) {
        return;
    }
    var pathApp = "apps";
    if (saleChannel)
        pathApp = "sale_channels/apps";
    var url = "https://" + shopOrigin + "/adminv2/" + pathApp + "/" + apiKey + location.pathname + (location.search || '');
    redirect_1.redirect(url);
}
function createApp(config) {
    var currentWindow = redirect_1.getWindow();
    return createAppWrapper(currentWindow.top)(config);
}
exports.createApp = createApp;
function createDispatcher(transport, config) {
    return function (type, payload) {
        transport.dispatch({
            payload: payload,
            source: config,
            type: type,
        });
    };
}
function createAppWrapper(frame, localOrigin, middleware) {
    if (middleware === void 0) {
        middleware = [];
    }
    if (!frame) {
        throw new Error("WINDOW_UNDEFINED");
    }
    var location = redirect_1.getLocation();
    var origin = localOrigin || (location && location.origin);
    if (!origin) {
        throw new Error("MISSING_LOCAL_ORIGIN");
    }
    var transport = MessageTransport_1.fromWindow(frame, origin);
    var appCreator = exports.createClientApp(transport, middleware);
    return appCreator;
}
exports.createAppWrapper = createAppWrapper;
function createClientApp(transport, middleware) {
    return function (config) {
        if (!config.shopOrigin) {
            throw new Error("INVALID_CONFIG: shopOrigin must be provided");
        }
        var protocol = /^https?:\/\//;
        if (protocol.test(config.shopOrigin)) {
            var message = "shopOrigin should not include protocol, please use: " + config.shopOrigin.replace(protocol, '');
            throw new Error("INVALID_CONFIG: " + message);
        }
        if (!config.apiKey) {
            throw new Error("INVALID_CONFIG: apiKey must be provided");
        }
        var dispatcher = createDispatcher(transport, config);
        function dispatch(action) {
            dispatcher(types_1.MessageType.Dispatch, action);
            return action;
        }
        redirectHandler(transport.hostFrame, config);
        var app = {
            localOrigin: transport.localOrigin,
            dispatch: function (action) {
                return dispatch(action);
            }
        };
        return app;
    };
}
exports.createClientApp = createClientApp;
exports.default = createApp;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Action;
(function (Action) {
    Action["ADMIN_PATH"] = "ADMIN::PATH";
    Action["ADMIN_SECTION"] = "ADMIN::SECTION";
    Action["REMOTE"] = "REMOTE";
    Action["APP"] = "APP";
})(Action = exports.Action || (exports.Action = {}));
var ActionType;
(function (ActionType) {
    ActionType["ADMIN_SECTION"] = "APP::NAVIGATION::REDIRECT::ADMIN::SECTION";
    ActionType["ADMIN_PATH"] = "APP::NAVIGATION::REDIRECT::ADMIN::PATH";
    ActionType["REMOTE"] = "APP::NAVIGATION::REDIRECT::REMOTE";
    ActionType["APP"] = "APP::NAVIGATION::REDIRECT::APP";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
var ResourceType;
(function (ResourceType) {
    ResourceType["Product"] = "products";
    ResourceType["Collection"] = "collections";
    ResourceType["Order"] = "orders";
    ResourceType["Customer"] = "customers";
    ResourceType["Discount"] = "discounts";
})(ResourceType = exports.ResourceType || (exports.ResourceType = {}));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ActionType;
(function (ActionType) {
    ActionType["START"] = "APP::LOADING::START";
    ActionType["STOP"] = "APP::LOADING::STOP";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
var Action;
(function (Action) {
    Action["START"] = "START";
    Action["STOP"] = "STOP";
})(Action = exports.Action || (exports.Action = {}));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ActionType;
(function (ActionType) {
    ActionType["SHOW"] = "APP::TOAST::SHOW";
    ActionType["CLEAR"] = "APP::TOAST::CLEAR";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
var Action;
(function (Action) {
    Action["SHOW"] = "SHOW";
    Action["CLEAR"] = "CLEAR";
})(Action = exports.Action || (exports.Action = {}));


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function fromWindow(contentWindow, localOrigin) {
    return {
        localOrigin: localOrigin,
        hostFrame: contentWindow,
        dispatch: function (message) {
            if (!message.source || !message.source.shopOrigin) {
                return;
            }
            var messageOrigin = "https://" + message.source.shopOrigin;
            contentWindow.postMessage(message, messageOrigin);
        }
    };
}
exports.fromWindow = fromWindow;
;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MessageType;
(function (MessageType) {
    MessageType["Dispatch"] = "dispatch";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var LifecycleHook;
(function (LifecycleHook) {
    LifecycleHook["UpdateAction"] = "UpdateAction";
    LifecycleHook["DispatchAction"] = "DispatchAction";
})(LifecycleHook = exports.LifecycleHook || (exports.LifecycleHook = {}));


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(9);


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var actions = __importStar(__webpack_require__(10));
exports.actions = actions;
__export(__webpack_require__(6));
var Client_1 = __webpack_require__(2);
exports.default = Client_1.createApp;
__export(__webpack_require__(21));


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Redirect = __importStar(__webpack_require__(11));
exports.Redirect = Redirect;
var Loading = __importStar(__webpack_require__(16));
exports.Loading = Loading;
var Toast = __importStar(__webpack_require__(18));
exports.Toast = Toast;
__export(__webpack_require__(1));


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(12));
__export(__webpack_require__(3));


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var helper_Actions = __importStar(__webpack_require__(0));
var types_Actions = __importStar(__webpack_require__(1));
var types_Redirect = __importStar(__webpack_require__(3));
var helper_1 = __webpack_require__(0);
function toRemote(payload) {
    return helper_Actions.actionWrapper({
        payload: payload,
        group: types_Actions.Group.Navigation,
        type: types_Redirect.ActionType.REMOTE,
    });
}
exports.toRemote = toRemote;
function isRemotePayload(payload) {
    return typeof payload === 'object' && payload.hasOwnProperty('url');
}
var Redirect = (function (_super) {
    __extends(Redirect, _super);
    function Redirect(app) {
        return _super.call(this, app, 'Redirect', types_Actions.Group.Navigation) || this;
    }
    Object.defineProperty(Redirect.prototype, "payload", {
        get: function () {
            return { id: this.id };
        },
        enumerable: true,
        configurable: true
    });
    Redirect.prototype.dispatch = function (action, payload) {
        switch (action) {
            case types_Redirect.Action.REMOTE:
                var remotePayload = isRemotePayload(payload) ? payload : { url: payload };
                this.app.dispatch(toRemote(__assign({}, this.payload, remotePayload)));
                break;
        }
        return this;
    };
    return Redirect;
}(helper_1.ActionSet));
exports.Redirect = Redirect;
function create(app) {
    return new Redirect(app);
}
exports.create = create;


/***/ }),
/* 13 */
/***/ (function(module) {

module.exports = JSON.parse("{\"name\":\"lublue_test\",\"version\":\"1.0.3\",\"description\":\"app-sdk\",\"main\":\"lib/index.js\",\"types\":\"lib/index.d.ts\",\"unpkg\":\"umd/index.js\",\"scripts\":{\"clean\":\"rm -rf ./lib & rm -rf ./umd\",\"build:all\":\"npm run clean && npm run build:tsc && npm run build:umd\",\"build:tsc\":\"NODE_ENV=production tsc\",\"build:umd\":\"NODE_ENV=production webpack -p\",\"start\":\"node lib/index.js\",\"prestart\":\"npm run build\",\"build\":\"npm run clean && tsc\"},\"keywords\":[],\"author\":{\"name\":\"Inc.\"},\"license\":\"MIT\",\"devDependencies\":{\"@types/node\":\"^12.12.0\",\"ts-loader\":\"^6.2.1\",\"typescript\":\"^3.6.4\",\"uglifyjs-webpack-plugin\":\"^2.2.0\",\"webpack\":\"^4.41.2\",\"webpack-cli\":\"^3.3.9\"},\"files\":[\"lib/**/*\",\"umd/**/*\"]}");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function asHex(value) {
    return Array.from(value)
        .map(function (i) { return ("00" + i.toString(16)).slice(-2); })
        .join('');
}
function getRandomBytes(size) {
    if (typeof Uint8Array === 'function' && window.crypto) {
        var buffer = new Uint8Array(size);
        var randomValues = window.crypto.getRandomValues(buffer);
        if (randomValues) {
            return randomValues;
        }
    }
    return Array.from(new Array(size), function () { return (Math.random() * 255) | 0; });
}
function generateUuid() {
    var version = 64;
    var clockSeqHiAndReserved = getRandomBytes(1);
    var timeHiAndVersion = getRandomBytes(2);
    clockSeqHiAndReserved[0] &= 63 | 128;
    timeHiAndVersion[0] &= 15 | version;
    return [
        asHex(getRandomBytes(4)),
        '-',
        asHex(getRandomBytes(2)),
        '-',
        asHex(timeHiAndVersion),
        '-',
        asHex(clockSeqHiAndReserved),
        asHex(getRandomBytes(1)),
        '-',
        asHex(getRandomBytes(6)),
    ].join('');
}
exports.generateUuid = generateUuid;
exports.default = generateUuid;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function mergeProps(obj, newObj) {
    if (newObj === undefined) {
        return undefined;
    }
    if (typeof obj === 'undefined' ||
        !Object.getPrototypeOf(obj).isPrototypeOf(newObj) ||
        (newObj.constructor.name !== 'Object' && newObj.constructor.name !== 'Array')) {
        return newObj;
    }
    var clone = {};
    Object.keys(newObj).forEach(function (key) {
        var exists = obj.hasOwnProperty(key);
        if (!exists) {
            clone[key] = newObj[key];
        }
        else {
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                clone[key] = mergeProps(obj[key], newObj[key]);
            }
            else {
                clone[key] = newObj[key];
            }
        }
    });
    Object.keys(obj).forEach(function (key) {
        var exists = newObj.hasOwnProperty(key);
        if (!exists) {
            clone[key] = obj[key];
        }
    });
    Object.setPrototypeOf(clone, Object.getPrototypeOf(obj));
    return clone;
}
exports.default = mergeProps;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(17));
__export(__webpack_require__(4));


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var helper_1 = __webpack_require__(0);
var types_1 = __webpack_require__(1);
var types_2 = __webpack_require__(4);
var helper_2 = __webpack_require__(0);
function start(payload) {
    return helper_1.actionWrapper({
        payload: payload,
        group: types_1.Group.Loading,
        type: types_2.ActionType.START,
    });
}
exports.start = start;
function stop(payload) {
    return helper_1.actionWrapper({
        payload: payload,
        group: types_1.Group.Loading,
        type: types_2.ActionType.STOP,
    });
}
exports.stop = stop;
function create(app) {
    return new Loading(app);
}
exports.create = create;
var Loading = (function (_super) {
    __extends(Loading, _super);
    function Loading(app) {
        return _super.call(this, app, types_1.Group.Loading, types_1.Group.Loading) || this;
    }
    Object.defineProperty(Loading.prototype, "payload", {
        get: function () {
            return { id: this.id };
        },
        enumerable: true,
        configurable: true
    });
    Loading.prototype.dispatch = function (action) {
        switch (action) {
            case types_2.Action.START:
                this.app.dispatch(start(this.payload));
                break;
            case types_2.Action.STOP:
                this.app.dispatch(stop(this.payload));
                break;
        }
        return this;
    };
    return Loading;
}(helper_2.ActionSet));
exports.Loading = Loading;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(19));
__export(__webpack_require__(5));


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var helper_1 = __webpack_require__(0);
var types_1 = __webpack_require__(1);
var types_2 = __webpack_require__(5);
var helper_2 = __webpack_require__(0);
function show(toastMessage) {
    return helper_1.actionWrapper({
        group: types_1.Group.Toast,
        payload: toastMessage,
        type: types_2.ActionType.SHOW,
    });
}
exports.show = show;
function clear(payload) {
    return helper_1.actionWrapper({
        payload: payload,
        group: types_1.Group.Toast,
        type: types_2.ActionType.CLEAR,
    });
}
exports.clear = clear;
function create(app, options) {
    return new Toast(app, options);
}
exports.create = create;
var Toast = (function (_super) {
    __extends(Toast, _super);
    function Toast(app, options) {
        var _this = _super.call(this, app, types_1.Group.Toast, types_1.Group.Toast) || this;
        _this.message = '';
        _this.duration = 5000;
        _this.set(options);
        return _this;
    }
    Object.defineProperty(Toast.prototype, "payload", {
        get: function () {
            return __assign({ id: this.id }, this.options);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Toast.prototype, "options", {
        get: function () {
            return {
                duration: this.duration,
                isError: this.isError,
                message: this.message,
            };
        },
        enumerable: true,
        configurable: true
    });
    Toast.prototype.set = function (options) {
        var mergedOptions = helper_1.getMergedProps(this.options, options);
        var message = mergedOptions.message, duration = mergedOptions.duration, isError = mergedOptions.isError;
        this.message = message;
        this.duration = duration;
        this.isError = isError;
        return this;
    };
    Toast.prototype.dispatch = function (action) {
        switch (action) {
            case types_2.Action.SHOW:
                var openAction = show(this.payload);
                this.app.dispatch(openAction);
                break;
            case types_2.Action.CLEAR:
                this.app.dispatch(clear({ id: this.id }));
                break;
        }
        return this;
    };
    return Toast;
}(helper_2.ActionSet));
exports.Toast = Toast;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function shouldRedirect(frame) {
    return frame === window;
}
exports.shouldRedirect = shouldRedirect;
function redirect(url) {
    var location = getLocation();
    if (!location) {
        return;
    }
    location.assign(url);
}
exports.redirect = redirect;
function getLocation() {
    return hasWindow() ? window.location : undefined;
}
exports.getLocation = getLocation;
function getWindow() {
    return hasWindow() ? window : undefined;
}
exports.getWindow = getWindow;
function hasWindow() {
    return typeof window !== 'undefined';
}


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(7));
__export(__webpack_require__(2));
var Client_1 = __webpack_require__(2);
exports.default = Client_1.createClientApp;


/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hcHAtc2RrL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9hcHAtc2RrL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2FwcC1zZGsvLi9zcmMvYWN0aW9ucy9oZWxwZXIudHMiLCJ3ZWJwYWNrOi8vYXBwLXNkay8uL3NyYy9hY3Rpb25zL3R5cGVzLnRzIiwid2VicGFjazovL2FwcC1zZGsvLi9zcmMvY2xpZW50L0NsaWVudC50cyIsIndlYnBhY2s6Ly9hcHAtc2RrLy4vc3JjL2FjdGlvbnMvTmF2aWdhdGlvbi9SZWRpcmVjdC90eXBlcy50cyIsIndlYnBhY2s6Ly9hcHAtc2RrLy4vc3JjL2FjdGlvbnMvTG9hZGluZy90eXBlcy50cyIsIndlYnBhY2s6Ly9hcHAtc2RrLy4vc3JjL2FjdGlvbnMvVG9hc3QvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vYXBwLXNkay8uL3NyYy91dGlsL01lc3NhZ2VUcmFuc3BvcnQudHMiLCJ3ZWJwYWNrOi8vYXBwLXNkay8uL3NyYy9jbGllbnQvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vYXBwLXNkay8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9hcHAtc2RrLy4vc3JjL2FjdGlvbnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vYXBwLXNkay8uL3NyYy9hY3Rpb25zL05hdmlnYXRpb24vUmVkaXJlY3QvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vYXBwLXNkay8uL3NyYy9hY3Rpb25zL05hdmlnYXRpb24vUmVkaXJlY3QvYWN0aW9ucy50cyIsIndlYnBhY2s6Ly9hcHAtc2RrLy4vc3JjL2FjdGlvbnMvdXVpZC50cyIsIndlYnBhY2s6Ly9hcHAtc2RrLy4vc3JjL2FjdGlvbnMvbWVyZ2UudHMiLCJ3ZWJwYWNrOi8vYXBwLXNkay8uL3NyYy9hY3Rpb25zL0xvYWRpbmcvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vYXBwLXNkay8uL3NyYy9hY3Rpb25zL0xvYWRpbmcvYWN0aW9ucy50cyIsIndlYnBhY2s6Ly9hcHAtc2RrLy4vc3JjL2FjdGlvbnMvVG9hc3QvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vYXBwLXNkay8uL3NyYy9hY3Rpb25zL1RvYXN0L2FjdGlvbnMudHMiLCJ3ZWJwYWNrOi8vYXBwLXNkay8uL3NyYy9jbGllbnQvcmVkaXJlY3QudHMiLCJ3ZWJwYWNrOi8vYXBwLXNkay8uL3NyYy9jbGllbnQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87UUNWQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkEsSUFBSSxTQUFTLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7SUFDekMsSUFBSSxhQUFhLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUM5QixhQUFhLEdBQUcsTUFBTSxDQUFDLGNBQWM7WUFD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QUN4QyxPQUFPLEtBQUssS0FBSyxNQUFNLENBQUM7QUFDNUIsQ0FBQztBQUZELHdDQUVDO0FBQ0QsU0FBZ0IsUUFBUSxDQUFDLEdBQVc7SUFDaEMsSUFBSSxRQUFRLEdBQUcsV0FBVyxFQUFFLENBQUM7SUFDN0IsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNYLE9BQU87S0FDVjtJQUNELFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQU5ELDRCQU1DO0FBQ0QsU0FBZ0IsV0FBVztJQUN2QixPQUFPLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDckQsQ0FBQztBQUZELGtDQUVDO0FBQ0QsU0FBZ0IsU0FBUztJQUNyQixPQUFPLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUM1QyxDQUFDO0FBRkQsOEJBRUM7QUFFRCxTQUFTLFNBQVM7SUFDZCxPQUFPLE9BQU8sTUFBTSxLQUFLLFdBQVcsQ0FBQztBQUN6QyxDQUFDOzs7Ozs7Ozs7Ozs7O0FDckJELGlDQUF3QjtBQUN4QixpQ0FBeUI7QUFFekIsc0NBQTJDO0FBQzNDLGtCQUFlLHdCQUFlLENBQUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcImFwcC1zZGtcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiYXBwLXNka1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJhcHAtc2RrXCJdID0gZmFjdG9yeSgpO1xufSkod2luZG93LCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gOCk7XG4iLCJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5cbmltcG9ydCBwYWNrYWdlSnNvbiBmcm9tICcuLi8uLi9wYWNrYWdlLmpzb24nOyBcbmltcG9ydCB7IEFjdGlvblNldEludGVyZmFjZSwgQ29tcG9uZW50fSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IENsaWVudEFwcGxpY2F0aW9uIH0gZnJvbSAnLi4vY2xpZW50L3R5cGVzJztcbmltcG9ydCB1dWlkMCBmcm9tICcuL3V1aWQnO1xuaW1wb3J0IHsgSW5kZXhhYmxlIH0gZnJvbSAnLi9tZXJnZSc7XG52YXIgdXVpZF8xID0gX19pbXBvcnREZWZhdWx0KHV1aWQwKTtcbnZhciBtZXJnZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL21lcmdlXCIpKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFZlcnNpb24oKTogYW55IHtcbiAgICByZXR1cm4gcGFja2FnZUpzb24udmVyc2lvbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGlvbldyYXBwZXIoYWN0aW9uOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBfX2Fzc2lnbih7fSwgYWN0aW9uLCB7IHZlcnNpb246IGdldFZlcnNpb24oKSwgY2xpZW50SW50ZXJmYWNlOiB7XG4gICAgICAgIG5hbWU6IHBhY2thZ2VKc29uLm5hbWUsXG4gICAgICAgIHZlcnNpb246IGdldFZlcnNpb24oKSxcbiAgICB9IH0pO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWN0aW9uU2V0IGltcGxlbWVudHMgQWN0aW9uU2V0SW50ZXJmYWNlIHtcbiAgICBhcHA6IENsaWVudEFwcGxpY2F0aW9uPGFueT47XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIGdyb3VwOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgaWQ6IHN0cmluZztcbiAgICByZWFkb25seSBkZWZhdWx0R3JvdXA6IHN0cmluZztcbiAgICBzdWJncm91cHM6IHN0cmluZ1tdO1xuICAgIHJlYWRvbmx5IGNvbXBvbmVudDogQ29tcG9uZW50O1xuICAgIGNvbnN0cnVjdG9yKGFwcDogQ2xpZW50QXBwbGljYXRpb248YW55PiwgdHlwZTogc3RyaW5nLCBncm91cDogc3RyaW5nLCBpZD86IHN0cmluZyl7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLmdyb3VwID0gZ3JvdXA7XG4gICAgICAgIHRoaXMuc3ViZ3JvdXBzID0gW107XG4gICAgICAgIGlmICghYXBwKSB7XG4gICAgICAgICAgICAvL0Vycm9yXzEudGhyb3dFcnJvcihFcnJvcl8xLkFjdGlvblR5cGUuSU5WQUxJRF9PUFRJT05TLCAnTWlzc2luZyByZXF1aXJlZCBgYXBwYCcpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHJlcXVpcmVkIGBhcHBgJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pZCA9IGlkIHx8IHV1aWRfMS5kZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuZGVmYXVsdEdyb3VwID0gZ3JvdXA7XG4gICAgICAgIHZhciBkZWZhdWx0U2V0ID0gdGhpcy5zZXQ7XG4gICAgICAgIHRoaXMuc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRTZXQuYXBwbHkoX3RoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgLy92YXIgX2E7XG4gICAgICAgICAgICAvL2lmICghX3RoaXMuYXBwLmhvb2tzKSB7XG4gICAgICAgICAgICAvLyAgICByZXR1cm4gZGVmYXVsdFNldC5hcHBseShfdGhpcywgYXJncyk7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIC8vcmV0dXJuIChfYSA9IF90aGlzLmFwcC5ob29rcykucnVuLmFwcGx5KF9hLCBbdHlwZXNfMS5MaWZlY3ljbGVIb29rLlVwZGF0ZUFjdGlvbiwgZGVmYXVsdFNldCwgX3RoaXNdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHNldCguLi5fOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICB2YXIgXyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgX1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCgpOiBDb21wb25lbnQge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICAgICAgICBzdWJncm91cHM6IHRoaXMuc3ViZ3JvdXBzLFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1lcmdlZFByb3BzPFByb3AgZXh0ZW5kcyBJbmRleGFibGU+KHByb3BzOiBQcm9wLCBuZXdQcm9wczogUGFydGlhbDxQcm9wPik6IFByb3Age1xuICAgIHZhciBtZXJnZWQgPSBtZXJnZV8xLmRlZmF1bHQocHJvcHMsIG5ld1Byb3BzKTtcbiAgICBpZiAoIW1lcmdlZCkge1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLW9iamVjdC1zcHJlYWRcbiAgICAgICAgdmFyIGNsb25lZCA9IE9iamVjdC5hc3NpZ24ocHJvcHMsIG5ld1Byb3BzKTtcbiAgICAgICAgcmV0dXJuIGNsb25lZDtcbiAgICB9XG4gICAgcmV0dXJuIG1lcmdlZDtcbn1cblxuIiwiaW1wb3J0IHsgQ2xpZW50QXBwbGljYXRpb24gfSBmcm9tICcuLi9jbGllbnQnO1xuaW1wb3J0IHsgQWN0aW9uU2V0IH0gZnJvbSAnLi9oZWxwZXInO1xuXG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbnlBY3Rpb24ge1xuICAgIHR5cGU6IGFueTtcbiAgICBbZXh0cmFQcm9wczogc3RyaW5nXTogYW55O1xufVxuZXhwb3J0IGludGVyZmFjZSBDbGllbnRJbnRlcmZhY2Uge1xuICAgIG5hbWU/OiBzdHJpbmc7XG4gICAgdmVyc2lvbj86IHN0cmluZztcbn1cbi8qKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIE1ldGFBY3Rpb24gZXh0ZW5kcyBBbnlBY3Rpb24ge1xuICAgIGNsaWVudEludGVyZmFjZT86IENsaWVudEludGVyZmFjZTtcbiAgICByZWFkb25seSB2ZXJzaW9uOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgZ3JvdXA6IHN0cmluZztcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcGF5bG9hZD86IGFueTtcbn1cblxuLyoqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBlbnVtIEdyb3VwIHtcbiAgICBCdXR0b24gPSBcIkJ1dHRvblwiLFxuICAgIEJ1dHRvbkdyb3VwID0gXCJCdXR0b25Hcm91cFwiLFxuICAgIENhcnQgPSBcIkNhcnRcIixcbiAgICBFcnJvciA9IFwiRXJyb3JcIixcbiAgICBGZWF0dXJlcyA9IFwiRmVhdHVyZXNcIixcbiAgICBGdWxsc2NyZWVuID0gXCJGdWxsc2NyZWVuXCIsXG4gICAgVG9hc3QgPSBcIlRvYXN0XCIsXG4gICAgTG9hZGluZyA9IFwiTG9hZGluZ1wiLFxuICAgIE1vZGFsID0gXCJNb2RhbFwiLFxuICAgIE5hdmlnYXRpb24gPSBcIk5hdmlnYXRpb25cIixcbiAgICBQcmludCA9IFwiUHJpbnRcIixcbiAgICBUaXRsZUJhciA9IFwiVGl0bGVCYXJcIixcbiAgICBSZXNvdXJjZVBpY2tlciA9IFwiUmVzb3VyY2VfUGlja2VyXCIsXG4gICAgQ29udGV4dHVhbFNhdmVCYXIgPSBcIkNvbnRleHR1YWxTYXZlQmFyXCIsXG4gICAgU2Nhbm5lciA9IFwiU2Nhbm5lclwiLFxuICAgIFNoYXJlID0gXCJTaGFyZVwiXG59XG5cbi8qKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudCB7XG4gICAgcmVhZG9ubHkgaWQ6IHN0cmluZztcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgc3ViZ3JvdXBzPzogc3RyaW5nW107XG59XG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBY3Rpb25TZXRJbnRlcmZhY2UgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHJlYWRvbmx5IGFwcDogQ2xpZW50QXBwbGljYXRpb248YW55PjtcbiAgICByZWFkb25seSBkZWZhdWx0R3JvdXA6IHN0cmluZztcbiAgICBncm91cDogc3RyaW5nO1xuICAgIGNvbXBvbmVudDogQ29tcG9uZW50O1xufVxuXG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEaXNwYXRjaDxfPiB7XG4gICAgPEEgZXh0ZW5kcyBBbnlBY3Rpb24+KGFjdGlvbjogQSk6IEE7XG59XG5cbi8qKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbXBsZXhEaXNwYXRjaDxQPiB7XG4gICAgZGlzcGF0Y2goYWN0aW9uOiBzdHJpbmcsIHBheWxvYWQ6IFApOiBBY3Rpb25TZXQ7XG59XG5cbi8qKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFNpbXBsZURpc3BhdGNoIHtcbiAgICBkaXNwYXRjaChhY3Rpb246IHN0cmluZyk6IEFjdGlvblNldDtcbn1cblxuLyoqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWN0aW9uU2V0UGF5bG9hZDxQPiBleHRlbmRzIFNpbXBsZURpc3BhdGNoIHtcbiAgICBwYXlsb2FkOiBQO1xufVxuXG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBY3Rpb25TZXRQcm9wczxULCBQPiBleHRlbmRzIFNpbXBsZURpc3BhdGNoIHtcbiAgICBvcHRpb25zOiBUO1xuICAgIHBheWxvYWQ6IFA7XG4gICAgc2V0KG9wdGlvbnM6IFBhcnRpYWw8VD4pOiBBY3Rpb25TZXQ7XG59XG5cbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5cbmltcG9ydCB7IEFwcENvbmZpZywgQXBwTWlkZGxld2FyZSwgQ2xpZW50QXBwbGljYXRpb24sIENsaWVudEFwcGxpY2F0aW9uQ3JlYXRvciwgQ2xpZW50QXBwbGljYXRpb25UcmFuc3BvcnRJbmplY3RvciwgUGFyYW1zIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgKiBhcyByZWRpcmVjdF8xIGZyb20gJy4vcmVkaXJlY3QnO1xuaW1wb3J0ICogYXMgTWVzc2FnZVRyYW5zcG9ydF8xIGZyb20gJy4uL3V0aWwvTWVzc2FnZVRyYW5zcG9ydCc7XG5pbXBvcnQgTWVzc2FnZVRyYW5zcG9ydCBmcm9tICcuLi91dGlsL01lc3NhZ2VUcmFuc3BvcnQnO1xuaW1wb3J0ICogYXMgdHlwZXNfMSBmcm9tICcuL3R5cGVzJztcblxuZnVuY3Rpb24gcmVkaXJlY3RIYW5kbGVyKGhvc3RGcmFtZTphbnksIGNvbmZpZzpBcHBDb25maWcpIHtcbiAgICB2YXIgYXBpS2V5ID0gY29uZmlnLmFwaUtleSwgc2hvcE9yaWdpbiA9IGNvbmZpZy5zaG9wT3JpZ2luLCBlbWJlZGRlZCA9IGNvbmZpZy5lbWJlZGRlZCwgc2FsZUNoYW5uZWwgPSBjb25maWcuc2FsZUNoYW5uZWw7XG4gICAgdmFyIGxvY2F0aW9uID0gcmVkaXJlY3RfMS5nZXRMb2NhdGlvbigpO1xuICAgIGlmIChcbiAgICAgICAgIWxvY2F0aW9uIHx8XG4gICAgICAgICFhcGlLZXkgfHxcbiAgICAgICAgIXNob3BPcmlnaW4gfHxcbiAgICAgICAgIWVtYmVkZGVkIHx8XG4gICAgICAgICFyZWRpcmVjdF8xLnNob3VsZFJlZGlyZWN0KGhvc3RGcmFtZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcGF0aEFwcCA9IFwiYXBwc1wiO1xuICAgIGlmKHNhbGVDaGFubmVsKSBwYXRoQXBwID0gXCJzYWxlX2NoYW5uZWxzL2FwcHNcIjtcbiAgICB2YXIgdXJsID0gXCJodHRwczovL1wiICsgc2hvcE9yaWdpbiArIFwiL2FkbWludjIvXCIgKyBwYXRoQXBwICsgXCIvXCIgKyBhcGlLZXkgKyBsb2NhdGlvbi5wYXRobmFtZSArIChsb2NhdGlvbi5zZWFyY2ggfHwgJycpO1xuICAgIHJlZGlyZWN0XzEucmVkaXJlY3QodXJsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFwcChjb25maWc6IEFwcENvbmZpZyk6IENsaWVudEFwcGxpY2F0aW9uPGFueT57XG4gICAgdmFyIGN1cnJlbnRXaW5kb3cgPSByZWRpcmVjdF8xLmdldFdpbmRvdygpO1xuICAgIHJldHVybiBjcmVhdGVBcHBXcmFwcGVyKGN1cnJlbnRXaW5kb3cudG9wKShjb25maWcpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVEaXNwYXRjaGVyKHRyYW5zcG9ydDpNZXNzYWdlVHJhbnNwb3J0LCBjb25maWc6IEFwcENvbmZpZykge1xuICAgIHJldHVybiBmdW5jdGlvbiAodHlwZTogYW55LCBwYXlsb2FkOiBhbnkpIHtcbiAgICAgICAgdHJhbnNwb3J0LmRpc3BhdGNoKHtcbiAgICAgICAgICAgIHBheWxvYWQ6IHBheWxvYWQsXG4gICAgICAgICAgICBzb3VyY2U6IGNvbmZpZyxcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIH0pO1xuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBcHBXcmFwcGVyKGZyYW1lOiBXaW5kb3csIGxvY2FsT3JpZ2luPzogc3RyaW5nLCBtaWRkbGV3YXJlPzogQXBwTWlkZGxld2FyZVtdKTogQ2xpZW50QXBwbGljYXRpb25DcmVhdG9ye1xuICAgIGlmIChtaWRkbGV3YXJlID09PSB2b2lkIDApIHsgbWlkZGxld2FyZSA9IFtdOyB9XG4gICAgaWYgKCFmcmFtZSkge1xuICAgICAgICAvL3Rocm93IEVycm9yXzEuZnJvbUFjdGlvbihleHBvcnRzLldJTkRPV19VTkRFRklORURfTUVTU0FHRSwgRXJyb3JfMS5BcHBBY3Rpb25UeXBlLldJTkRPV19VTkRFRklORUQpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXSU5ET1dfVU5ERUZJTkVEXCIpO1xuICAgIH1cbiAgICB2YXIgbG9jYXRpb24gPSByZWRpcmVjdF8xLmdldExvY2F0aW9uKCk7XG4gICAgdmFyIG9yaWdpbiA9IGxvY2FsT3JpZ2luIHx8IChsb2NhdGlvbiAmJiBsb2NhdGlvbi5vcmlnaW4pO1xuICAgIGlmICghb3JpZ2luKSB7XG4gICAgICAgIC8vdGhyb3cgRXJyb3JfMS5mcm9tQWN0aW9uKCdsb2NhbCBvcmlnaW4gY2Fubm90IGJlIGJsYW5rJywgRXJyb3JfMS5BcHBBY3Rpb25UeXBlLk1JU1NJTkdfTE9DQUxfT1JJR0lOKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTUlTU0lOR19MT0NBTF9PUklHSU5cIik7XG4gICAgfVxuICAgIHZhciB0cmFuc3BvcnQgPSBNZXNzYWdlVHJhbnNwb3J0XzEuZnJvbVdpbmRvdyhmcmFtZSwgb3JpZ2luKTtcbiAgICB2YXIgYXBwQ3JlYXRvciA9IGV4cG9ydHMuY3JlYXRlQ2xpZW50QXBwKHRyYW5zcG9ydCwgbWlkZGxld2FyZSk7XG4gICAgcmV0dXJuIGFwcENyZWF0b3I7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNsaWVudEFwcCh0cmFuc3BvcnQ6IE1lc3NhZ2VUcmFuc3BvcnQsIG1pZGRsZXdhcmU/OiBBcHBNaWRkbGV3YXJlW10pOiBDbGllbnRBcHBsaWNhdGlvbkNyZWF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAoY29uZmlnOkFwcENvbmZpZykge1xuICAgICAgICBpZiAoIWNvbmZpZy5zaG9wT3JpZ2luKSB7XG4gICAgICAgICAgICAvL3Rocm93IEVycm9yXzEuZnJvbUFjdGlvbignc2hvcE9yaWdpbiBtdXN0IGJlIHByb3ZpZGVkJywgRXJyb3JfMS5BcHBBY3Rpb25UeXBlLklOVkFMSURfQ09ORklHKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIklOVkFMSURfQ09ORklHOiBzaG9wT3JpZ2luIG11c3QgYmUgcHJvdmlkZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByb3RvY29sID0gL15odHRwcz86XFwvXFwvLztcbiAgICAgICAgaWYgKHByb3RvY29sLnRlc3QoY29uZmlnLnNob3BPcmlnaW4pKSB7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IFwic2hvcE9yaWdpbiBzaG91bGQgbm90IGluY2x1ZGUgcHJvdG9jb2wsIHBsZWFzZSB1c2U6IFwiICsgY29uZmlnLnNob3BPcmlnaW4ucmVwbGFjZShwcm90b2NvbCwgJycpO1xuICAgICAgICAgICAgLy90aHJvdyBFcnJvcl8xLmZyb21BY3Rpb24obWVzc2FnZSwgRXJyb3JfMS5BcHBBY3Rpb25UeXBlLklOVkFMSURfQ09ORklHKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIklOVkFMSURfQ09ORklHOiBcIiArIG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghY29uZmlnLmFwaUtleSkge1xuICAgICAgICAgICAgLy90aHJvdyBFcnJvcl8xLmZyb21BY3Rpb24oJ2FwaUtleSBtdXN0IGJlIHByb3ZpZGVkJywgRXJyb3JfMS5BcHBBY3Rpb25UeXBlLklOVkFMSURfQ09ORklHKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIklOVkFMSURfQ09ORklHOiBhcGlLZXkgbXVzdCBiZSBwcm92aWRlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGlzcGF0Y2hlciA9IGNyZWF0ZURpc3BhdGNoZXIodHJhbnNwb3J0LCBjb25maWcpO1xuICAgXG4gICAgICAgIGZ1bmN0aW9uIGRpc3BhdGNoKGFjdGlvbjogYW55KSB7XG4gICAgICAgICAgICBkaXNwYXRjaGVyKHR5cGVzXzEuTWVzc2FnZVR5cGUuRGlzcGF0Y2gsIGFjdGlvbik7XG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVkaXJlY3RIYW5kbGVyKHRyYW5zcG9ydC5ob3N0RnJhbWUsIGNvbmZpZyk7XG4gICAgXG4gICAgICAgIHZhciBhcHAgPSB7XG4gICAgICAgICAgICBsb2NhbE9yaWdpbjogdHJhbnNwb3J0LmxvY2FsT3JpZ2luLFxuICAgICAgICAgICAgZGlzcGF0Y2g6IGZ1bmN0aW9uIChhY3Rpb246IGFueSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkaXNwYXRjaChhY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gYXBwO1xuICAgIH07XG59XG5cblxuXG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUFwcDtcbiIsImV4cG9ydCBpbnRlcmZhY2UgQmFzZVBheWxvYWQge1xuICAgIGlkPzogc3RyaW5nO1xufVxuZXhwb3J0IGludGVyZmFjZSBCYXNlQWRtaW5QYXlsb2FkIGV4dGVuZHMgQmFzZVBheWxvYWQge1xuICAgIG5ld0NvbnRleHQ/OiBib29sZWFuO1xufVxuZXhwb3J0IGludGVyZmFjZSBBcHBQYXlsb2FkIGV4dGVuZHMgQmFzZVBheWxvYWQge1xuICAgIHBhdGg6IHN0cmluZztcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQWRtaW5QYXRoUGF5bG9hZCBleHRlbmRzIEJhc2VBZG1pblBheWxvYWQge1xuICAgIHBhdGg6IHN0cmluZztcbn1cbmV4cG9ydCBpbnRlcmZhY2UgUmVtb3RlUGF5bG9hZCBleHRlbmRzIEJhc2VBZG1pblBheWxvYWQge1xuICAgIHVybDogc3RyaW5nO1xufVxuZXhwb3J0IGludGVyZmFjZSBDcmVhdGVSZXNvdXJjZSB7XG4gICAgY3JlYXRlOiBib29sZWFuO1xufVxuZXhwb3J0IGludGVyZmFjZSBSZXNvdXJjZUluZm8ge1xuICAgIGlkOiBzdHJpbmc7XG59XG5leHBvcnQgaW50ZXJmYWNlIFNlY3Rpb24ge1xuICAgIG5hbWU6IFJlc291cmNlVHlwZTtcbiAgICByZXNvdXJjZT86IENyZWF0ZVJlc291cmNlIHwgUmVzb3VyY2VJbmZvIHwgUHJvZHVjdFZhcmlhbnRSZXNvdXJjZTtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQWRtaW5TZWN0aW9uUGF5bG9hZCBleHRlbmRzIEJhc2VBZG1pblBheWxvYWQge1xuICAgIHNlY3Rpb246IFNlY3Rpb247XG59XG5leHBvcnQgaW50ZXJmYWNlIFByb2R1Y3RWYXJpYW50UmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZUluZm8ge1xuICAgIHZhcmlhbnQ6IENyZWF0ZVJlc291cmNlIHwgUmVzb3VyY2VJbmZvO1xufVxuZXhwb3J0IGVudW0gQWN0aW9uIHtcbiAgICBBRE1JTl9QQVRIID0gXCJBRE1JTjo6UEFUSFwiLFxuICAgIEFETUlOX1NFQ1RJT04gPSBcIkFETUlOOjpTRUNUSU9OXCIsXG4gICAgUkVNT1RFID0gXCJSRU1PVEVcIixcbiAgICBBUFAgPSBcIkFQUFwiXG59XG5leHBvcnQgZW51bSBBY3Rpb25UeXBlIHtcbiAgICBBRE1JTl9TRUNUSU9OID0gXCJBUFA6Ok5BVklHQVRJT046OlJFRElSRUNUOjpBRE1JTjo6U0VDVElPTlwiLFxuICAgIEFETUlOX1BBVEggPSBcIkFQUDo6TkFWSUdBVElPTjo6UkVESVJFQ1Q6OkFETUlOOjpQQVRIXCIsXG4gICAgUkVNT1RFID0gXCJBUFA6Ok5BVklHQVRJT046OlJFRElSRUNUOjpSRU1PVEVcIixcbiAgICBBUFAgPSBcIkFQUDo6TkFWSUdBVElPTjo6UkVESVJFQ1Q6OkFQUFwiXG59XG5leHBvcnQgZW51bSBSZXNvdXJjZVR5cGUge1xuICAgIFByb2R1Y3QgPSBcInByb2R1Y3RzXCIsXG4gICAgQ29sbGVjdGlvbiA9IFwiY29sbGVjdGlvbnNcIixcbiAgICBPcmRlciA9IFwib3JkZXJzXCIsXG4gICAgQ3VzdG9tZXIgPSBcImN1c3RvbWVyc1wiLFxuICAgIERpc2NvdW50ID0gXCJkaXNjb3VudHNcIlxufSIsImV4cG9ydCBlbnVtIEFjdGlvblR5cGUge1xuICAgIFNUQVJUID0gXCJBUFA6OkxPQURJTkc6OlNUQVJUXCIsXG4gICAgU1RPUCA9IFwiQVBQOjpMT0FESU5HOjpTVE9QXCJcbn1cbmV4cG9ydCBlbnVtIEFjdGlvbiB7XG4gICAgU1RBUlQgPSBcIlNUQVJUXCIsXG4gICAgU1RPUCA9IFwiU1RPUFwiXG59XG5leHBvcnQgaW50ZXJmYWNlIFBheWxvYWQge1xuICAgIHJlYWRvbmx5IGlkPzogc3RyaW5nO1xufVxuIiwiZXhwb3J0IGVudW0gQWN0aW9uVHlwZSB7XG4gICAgU0hPVyA9IFwiQVBQOjpUT0FTVDo6U0hPV1wiLFxuICAgIENMRUFSID0gXCJBUFA6OlRPQVNUOjpDTEVBUlwiXG59XG5leHBvcnQgZW51bSBBY3Rpb24ge1xuICAgIFNIT1cgPSBcIlNIT1dcIixcbiAgICBDTEVBUiA9IFwiQ0xFQVJcIlxufVxuZXhwb3J0IGludGVyZmFjZSBPcHRpb25zIHtcbiAgICBkdXJhdGlvbjogbnVtYmVyO1xuICAgIGlzRXJyb3I/OiBib29sZWFuO1xuICAgIG1lc3NhZ2U6IHN0cmluZztcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQ2xlYXJQYXlsb2FkIHtcbiAgICByZWFkb25seSBpZD86IHN0cmluZztcbn1cbmV4cG9ydCBpbnRlcmZhY2UgUGF5bG9hZCBleHRlbmRzIE9wdGlvbnMge1xuICAgIHJlYWRvbmx5IGlkPzogc3RyaW5nO1xufVxuIiwiaW1wb3J0IHsgVHJhbnNwb3J0RGlzcGF0Y2ggfSBmcm9tICcuLi9jbGllbnQnO1xuXG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1lc3NhZ2VUcmFuc3BvcnQge1xuICAgIGxvY2FsT3JpZ2luOiBzdHJpbmc7XG4gICAgaG9zdEZyYW1lOiBXaW5kb3c7XG4gICAgZGlzcGF0Y2gobWVzc2FnZTogVHJhbnNwb3J0RGlzcGF0Y2gpOiB2b2lkO1xufVxuXG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbVdpbmRvdyhjb250ZW50V2luZG93OiBXaW5kb3csIGxvY2FsT3JpZ2luOiBzdHJpbmcpOiBNZXNzYWdlVHJhbnNwb3J0IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBsb2NhbE9yaWdpbjogbG9jYWxPcmlnaW4sXG4gICAgICAgIGhvc3RGcmFtZTogY29udGVudFdpbmRvdyxcbiAgICAgICAgZGlzcGF0Y2g6IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgICAgICBpZiAoIW1lc3NhZ2Uuc291cmNlIHx8ICFtZXNzYWdlLnNvdXJjZS5zaG9wT3JpZ2luKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1lc3NhZ2VPcmlnaW4gPSBcImh0dHBzOi8vXCIgKyBtZXNzYWdlLnNvdXJjZS5zaG9wT3JpZ2luO1xuICAgICAgICAgICAgLy93aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKG1lc3NhZ2UsIG1lc3NhZ2VPcmlnaW4pO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShtZXNzYWdlKSk7XG4gICAgICAgICAgICBjb250ZW50V2luZG93LnBvc3RNZXNzYWdlKG1lc3NhZ2UsIG1lc3NhZ2VPcmlnaW4pO1xuICAgICAgICB9XG4gICAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE1lc3NhZ2VUcmFuc3BvcnQ7IiwiaW1wb3J0IHsgQW55QWN0aW9uLCBEaXNwYXRjaCB9IGZyb20gJy4uL2FjdGlvbnMvdHlwZXMnO1xuaW1wb3J0IHsgTWVzc2FnZVRyYW5zcG9ydCB9IGZyb20gJy4uL3V0aWwvTWVzc2FnZVRyYW5zcG9ydCc7XG5cbi8qKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEFwcENvbmZpZyB7XG4gICAgYXBpS2V5OiBzdHJpbmc7XG4gICAgc2hvcE9yaWdpbjogc3RyaW5nO1xuICAgIGVtYmVkZGVkPzogYm9vbGVhbjtcbiAgICBzYWxlQ2hhbm5lbD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBlbnVtIE1lc3NhZ2VUeXBlIHtcbiAgICBEaXNwYXRjaCA9IFwiZGlzcGF0Y2hcIlxufVxuXG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zcG9ydERpc3BhdGNoIHtcbiAgICB0eXBlOiBNZXNzYWdlVHlwZTtcbiAgICBzb3VyY2U6IEFwcENvbmZpZztcbiAgICBwYXlsb2FkPzogQW55QWN0aW9uO1xufVxuXG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDbGllbnRBcHBsaWNhdGlvbjxTPiB7XG4gICAgZGlzcGF0Y2g6IERpc3BhdGNoPEFueUFjdGlvbj47XG4gICAgbG9jYWxPcmlnaW46IHN0cmluZztcbn1cbi8qKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudEFwcGxpY2F0aW9uQ3JlYXRvciB7XG4gICAgPFM+KGNvbmZpZzogQXBwQ29uZmlnKTogQ2xpZW50QXBwbGljYXRpb248Uz47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFyYW1zIHtcbiAgICBba2V5OiBzdHJpbmddOiBzdHJpbmc7XG59XG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGVudW0gTGlmZWN5Y2xlSG9vayB7XG4gICAgVXBkYXRlQWN0aW9uID0gXCJVcGRhdGVBY3Rpb25cIixcbiAgICBEaXNwYXRjaEFjdGlvbiA9IFwiRGlzcGF0Y2hBY3Rpb25cIlxufVxuXG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFwcE1pZGRsZXdhcmUge1xuICAgIC8vKGhvb2tzOiBIb29rc0ludGVyZmFjZSwgYXBwOiBDbGllbnRBcHBsaWNhdGlvbjxhbnk+KTogdm9pZDtcbiAgICAoaG9va3M6IGFueSwgYXBwOiBDbGllbnRBcHBsaWNhdGlvbjxhbnk+KTogdm9pZDtcbn1cblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDbGllbnRBcHBsaWNhdGlvblRyYW5zcG9ydEluamVjdG9yIHtcbiAgICAodHJhbnNwb3J0OiBNZXNzYWdlVHJhbnNwb3J0LCBtaWRkbGV3YXJlPzogQXBwTWlkZGxld2FyZVtdKTogQ2xpZW50QXBwbGljYXRpb25DcmVhdG9yO1xufVxuXG4iLCJpbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XG5leHBvcnQgeyBhY3Rpb25zIH07XG5cbmV4cG9ydCAqIGZyb20gJy4vdXRpbC9NZXNzYWdlVHJhbnNwb3J0JztcblxuaW1wb3J0IHsgY3JlYXRlQXBwIH0gZnJvbSAnLi9jbGllbnQvQ2xpZW50JztcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUFwcDtcblxuZXhwb3J0ICogZnJvbSAnLi9jbGllbnQnO1xuXG5cbiIsImltcG9ydCAqIGFzIFJlZGlyZWN0IGZyb20gJy4vTmF2aWdhdGlvbi9SZWRpcmVjdCc7XG5pbXBvcnQgKiBhcyBMb2FkaW5nIGZyb20gJy4vTG9hZGluZyc7XG5pbXBvcnQgKiBhcyBUb2FzdCBmcm9tICcuL1RvYXN0JztcblxuZXhwb3J0IHsgUmVkaXJlY3QsIExvYWRpbmcsIFRvYXN0IH07XG5leHBvcnQgKiBmcm9tICcuL3R5cGVzJzsiLCJleHBvcnQgKiBmcm9tICcuL2FjdGlvbnMnO1xuZXhwb3J0ICogZnJvbSAnLi90eXBlcyc7IiwiXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5cbmltcG9ydCB7IENvbXBsZXhEaXNwYXRjaCwgR3JvdXAsIE1ldGFBY3Rpb24gfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgeyBBY3Rpb24sIEFjdGlvblR5cGUsIEFkbWluUGF0aFBheWxvYWQsIEFkbWluU2VjdGlvblBheWxvYWQsIEFwcFBheWxvYWQsIENyZWF0ZVJlc291cmNlLCBQcm9kdWN0VmFyaWFudFJlc291cmNlLCBSZW1vdGVQYXlsb2FkLCBSZXNvdXJjZUluZm8sIFNlY3Rpb24gfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCAqIGFzIGhlbHBlcl9BY3Rpb25zIGZyb20gJy4uLy4uL2hlbHBlcic7ICAgLy9oZWxwZXJfMVxuaW1wb3J0ICogYXMgdHlwZXNfQWN0aW9ucyBmcm9tICcuLi8uLi90eXBlcyc7ICAgICAvL3R5cGVzXzFcbmltcG9ydCAqIGFzIHR5cGVzX1JlZGlyZWN0IGZyb20gJy4vdHlwZXMnOyAgICAgICAgLy90eXBlc18yXG5pbXBvcnQgeyBDbGllbnRBcHBsaWNhdGlvbiB9IGZyb20gJy4uLy4uLy4uL2NsaWVudCc7XG5pbXBvcnQgeyBBY3Rpb25TZXQgfSBmcm9tICcuLi8uLi9oZWxwZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFjdGlvbkJhc2UgZXh0ZW5kcyBNZXRhQWN0aW9uIHtcbiAgICByZWFkb25seSBncm91cDogdHlwZW9mIEdyb3VwLk5hdmlnYXRpb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVtb3RlQWN0aW9uIGV4dGVuZHMgQWN0aW9uQmFzZSB7XG4gICAgcmVhZG9ubHkgdHlwZTogdHlwZW9mIEFjdGlvblR5cGUuUkVNT1RFO1xuICAgIHJlYWRvbmx5IHBheWxvYWQ6IFJlbW90ZVBheWxvYWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1JlbW90ZShwYXlsb2FkOiBSZW1vdGVQYXlsb2FkKTogUmVtb3RlQWN0aW9uIHtcbiAgICByZXR1cm4gaGVscGVyX0FjdGlvbnMuYWN0aW9uV3JhcHBlcih7XG4gICAgICAgIHBheWxvYWQ6IHBheWxvYWQsXG4gICAgICAgIGdyb3VwOiB0eXBlc19BY3Rpb25zLkdyb3VwLk5hdmlnYXRpb24sXG4gICAgICAgIHR5cGU6IHR5cGVzX1JlZGlyZWN0LkFjdGlvblR5cGUuUkVNT1RFLFxuICAgIH0pO1xufVxuXG5cbmZ1bmN0aW9uIGlzUmVtb3RlUGF5bG9hZChwYXlsb2FkOiBhbnkpIHtcbiAgICByZXR1cm4gdHlwZW9mIHBheWxvYWQgPT09ICdvYmplY3QnICYmIHBheWxvYWQuaGFzT3duUHJvcGVydHkoJ3VybCcpO1xufVxuXG5leHBvcnQgY2xhc3MgUmVkaXJlY3QgZXh0ZW5kcyBBY3Rpb25TZXQgaW1wbGVtZW50cyBDb21wbGV4RGlzcGF0Y2g8U2VjdGlvbiB8IHN0cmluZz4ge1xuICAgIGNvbnN0cnVjdG9yKGFwcDogQ2xpZW50QXBwbGljYXRpb248YW55Pil7XG4gICAgICAgIHN1cGVyKGFwcCwgJ1JlZGlyZWN0JywgdHlwZXNfQWN0aW9ucy5Hcm91cC5OYXZpZ2F0aW9uKTtcbiAgICB9XG5cbiAgICBnZXQgcGF5bG9hZCgpOiB7aWQ6IHN0cmluZzt9IHtcbiAgICAgICAgcmV0dXJuIHsgaWQ6IHRoaXMuaWQgfTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaChhY3Rpb246IEFjdGlvbi5BRE1JTl9TRUNUSU9OLCBwYXlsb2FkOiBTZWN0aW9uIHwgQWRtaW5TZWN0aW9uUGF5bG9hZCk6IEFjdGlvblNldDtcbiAgICBkaXNwYXRjaChhY3Rpb246IEFjdGlvbi5BRE1JTl9QQVRILCBwYXlsb2FkOiBzdHJpbmcgfCBBZG1pblBhdGhQYXlsb2FkKTogQWN0aW9uU2V0O1xuICAgIGRpc3BhdGNoKGFjdGlvbjogQWN0aW9uLlJFTU9URSwgcGF5bG9hZDogc3RyaW5nIHwgUmVtb3RlUGF5bG9hZCk6IEFjdGlvblNldDtcbiAgICBkaXNwYXRjaChhY3Rpb246IEFjdGlvbi5BUFAsIHBheWxvYWQ6IHN0cmluZyk6IEFjdGlvblNldDtcblxuICAgIGRpc3BhdGNoKGFjdGlvbjogYW55LCBwYXlsb2FkOiBhbnkpOiBhbnkge1xuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgY2FzZSB0eXBlc19SZWRpcmVjdC5BY3Rpb24uUkVNT1RFOlxuICAgICAgICAgICAgICAgIHZhciByZW1vdGVQYXlsb2FkID0gaXNSZW1vdGVQYXlsb2FkKHBheWxvYWQpID8gcGF5bG9hZCA6IHsgdXJsOiBwYXlsb2FkIH07XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAuZGlzcGF0Y2godG9SZW1vdGUoX19hc3NpZ24oe30sIHRoaXMucGF5bG9hZCwgcmVtb3RlUGF5bG9hZCkpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoYXBwOiBDbGllbnRBcHBsaWNhdGlvbjxhbnk+KTogUmVkaXJlY3Qge1xuICAgIHJldHVybiBuZXcgUmVkaXJlY3QoYXBwKTtcbn1cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIENvbnZlcnQgYSBudW1iZXIgb3IgYXJyYXkgb2YgaW50ZWdlcnMgdG8gYSBzdHJpbmcgb2YgcGFkZGVkIGhleCBvY3RldHMuXG4gKi9cbmZ1bmN0aW9uIGFzSGV4KHZhbHVlKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odmFsdWUpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGkpIHsgcmV0dXJuIChcIjAwXCIgKyAoaSBhcyBudW1iZXIpLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpOyB9KVxuICAgICAgICAuam9pbignJyk7XG59XG4vKipcbiAqIEF0dGVtcHQgdG8gc2VjdXJlbHkgZ2VuZXJhdGUgcmFuZG9tIGJ5dGVzL1xuICovXG5mdW5jdGlvbiBnZXRSYW5kb21CeXRlcyhzaXplKSB7XG4gICAgLy8gU1BSTkdcbiAgICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgPT09ICdmdW5jdGlvbicgJiYgd2luZG93LmNyeXB0bykge1xuICAgICAgICB2YXIgYnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7XG4gICAgICAgIHZhciByYW5kb21WYWx1ZXMgPSB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhidWZmZXIpO1xuICAgICAgICBpZiAocmFuZG9tVmFsdWVzKSB7XG4gICAgICAgICAgICByZXR1cm4gcmFuZG9tVmFsdWVzO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEluc2VjdXJlIHJhbmRvbVxuICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBBcnJheShzaXplKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gKE1hdGgucmFuZG9tKCkgKiAyNTUpIHwgMDsgfSk7XG59XG4vKipcbiAqIEdlbmVyYXRlIGEgUkZDNDEyMi1jb21wbGlhbnQgdjQgVVVJRC5cbiAqXG4gKiBAc2VlIGh0dHA6Ly93d3cuaWV0Zi5vcmcvcmZjL3JmYzQxMjIudHh0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVV1aWQoKTogc3RyaW5nIHtcbiAgICB2YXIgdmVyc2lvbiA9IDY0O1xuICAgIHZhciBjbG9ja1NlcUhpQW5kUmVzZXJ2ZWQgPSBnZXRSYW5kb21CeXRlcygxKTtcbiAgICB2YXIgdGltZUhpQW5kVmVyc2lvbiA9IGdldFJhbmRvbUJ5dGVzKDIpO1xuICAgIGNsb2NrU2VxSGlBbmRSZXNlcnZlZFswXSAmPSA2MyB8IDEyODtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6YmluYXJ5LWV4cHJlc3Npb24tb3BlcmFuZC1vcmRlclxuICAgIHRpbWVIaUFuZFZlcnNpb25bMF0gJj0gMTUgfCB2ZXJzaW9uO1xuICAgIHJldHVybiBbXG4gICAgICAgIGFzSGV4KGdldFJhbmRvbUJ5dGVzKDQpKSxcbiAgICAgICAgJy0nLFxuICAgICAgICBhc0hleChnZXRSYW5kb21CeXRlcygyKSksXG4gICAgICAgICctJyxcbiAgICAgICAgYXNIZXgodGltZUhpQW5kVmVyc2lvbiksXG4gICAgICAgICctJyxcbiAgICAgICAgYXNIZXgoY2xvY2tTZXFIaUFuZFJlc2VydmVkKSxcbiAgICAgICAgYXNIZXgoZ2V0UmFuZG9tQnl0ZXMoMSkpLFxuICAgICAgICAnLScsXG4gICAgICAgIGFzSGV4KGdldFJhbmRvbUJ5dGVzKDYpKSxcbiAgICBdLmpvaW4oJycpO1xufVxuZXhwb3J0IGRlZmF1bHQgZ2VuZXJhdGVVdWlkO1xuIiwiZXhwb3J0IGludGVyZmFjZSBJbmRleGFibGUge1xuICAgIFtrZXk6IHN0cmluZ106IGFueTtcbn1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1lcmdlUHJvcHM8VCBleHRlbmRzIEluZGV4YWJsZSwgVDIgZXh0ZW5kcyBJbmRleGFibGU+KG9iajogVCwgbmV3T2JqOiBUMik6IFQgfCBUMiB8IHVuZGVmaW5lZCB8IHt9IHtcbiAgICBpZiAobmV3T2JqID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gSWYgc2V0dGluZyB0byBhIGRpZmZlcmVudCBwcm90b3R5cGUgb3IgYSBub24tb2JqZWN0IG9yIG5vbi1hcnJheSwgZG9uJ3QgbWVyZ2UgYW55IHByb3BzXG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAgICFPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKS5pc1Byb3RvdHlwZU9mKG5ld09iaikgfHxcbiAgICAgICAgKG5ld09iai5jb25zdHJ1Y3Rvci5uYW1lICE9PSAnT2JqZWN0JyAmJiBuZXdPYmouY29uc3RydWN0b3IubmFtZSAhPT0gJ0FycmF5JykpIHtcbiAgICAgICAgcmV0dXJuIG5ld09iajtcbiAgICB9XG4gICAgdmFyIGNsb25lID0ge307XG4gICAgT2JqZWN0LmtleXMobmV3T2JqKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIGV4aXN0cyA9IG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpO1xuICAgICAgICBpZiAoIWV4aXN0cykge1xuICAgICAgICAgICAgY2xvbmVba2V5XSA9IG5ld09ialtrZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkob2JqW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgY2xvbmVba2V5XSA9IG1lcmdlUHJvcHMob2JqW2tleV0sIG5ld09ialtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsb25lW2tleV0gPSBuZXdPYmpba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vIENvcHkgb2xkIHByb3BzIHRoYXQgYXJlIG5vdCBwcmVzZW50IGluIG5ldyBvYmplY3Qgb25seSBpZiB0aGlzIGlzIGEgc2ltcGxlIG9iamVjdFxuICAgIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHZhciBleGlzdHMgPSBuZXdPYmouaGFzT3duUHJvcGVydHkoa2V5KTtcbiAgICAgICAgaWYgKCFleGlzdHMpIHtcbiAgICAgICAgICAgIGNsb25lW2tleV0gPSBvYmpba2V5XTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vIFNldCBwcm90b3R5cGUgb2YgY2xvbmVkIG9iamVjdCB0byBtYXRjaCBvcmlnaW5hbFxuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihjbG9uZSwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaikpO1xuICAgIHJldHVybiBjbG9uZTtcbn1cbiIsImV4cG9ydCAqIGZyb20gJy4vYWN0aW9ucyc7XG5leHBvcnQgKiBmcm9tICcuL3R5cGVzJzsiLCJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBoZWxwZXJfMSA9IHJlcXVpcmUoXCIuLi9oZWxwZXJcIik7XG52YXIgdHlwZXNfMSA9IHJlcXVpcmUoXCIuLi90eXBlc1wiKTtcbnZhciB0eXBlc18yID0gcmVxdWlyZShcIi4vdHlwZXNcIik7XG5cbmltcG9ydCB7IENsaWVudEFwcGxpY2F0aW9uIH0gZnJvbSAnLi4vLi4vY2xpZW50JztcbmltcG9ydCB7IEFjdGlvblNldCB9IGZyb20gJy4uL2hlbHBlcic7XG5pbXBvcnQgeyBBY3Rpb25TZXRQYXlsb2FkLCBNZXRhQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgQWN0aW9uLCBQYXlsb2FkIH0gZnJvbSAnLi90eXBlcyc7XG5leHBvcnQgdHlwZSBMb2FkaW5nQWN0aW9uID0gTWV0YUFjdGlvbjtcblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0KHBheWxvYWQ/OiBQYXlsb2FkKTogTG9hZGluZ0FjdGlvbiB7XG4gICAgcmV0dXJuIGhlbHBlcl8xLmFjdGlvbldyYXBwZXIoe1xuICAgICAgICBwYXlsb2FkOiBwYXlsb2FkLFxuICAgICAgICBncm91cDogdHlwZXNfMS5Hcm91cC5Mb2FkaW5nLFxuICAgICAgICB0eXBlOiB0eXBlc18yLkFjdGlvblR5cGUuU1RBUlQsXG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdG9wKHBheWxvYWQ/OiBQYXlsb2FkKTogTG9hZGluZ0FjdGlvbiB7XG4gICAgcmV0dXJuIGhlbHBlcl8xLmFjdGlvbldyYXBwZXIoe1xuICAgICAgICBwYXlsb2FkOiBwYXlsb2FkLFxuICAgICAgICBncm91cDogdHlwZXNfMS5Hcm91cC5Mb2FkaW5nLFxuICAgICAgICB0eXBlOiB0eXBlc18yLkFjdGlvblR5cGUuU1RPUCxcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShhcHA6IENsaWVudEFwcGxpY2F0aW9uPGFueT4pOiBMb2FkaW5nIHtcbiAgICByZXR1cm4gbmV3IExvYWRpbmcoYXBwKTtcbn1cblxuZXhwb3J0IGNsYXNzIExvYWRpbmcgZXh0ZW5kcyBBY3Rpb25TZXQgaW1wbGVtZW50cyBBY3Rpb25TZXRQYXlsb2FkPFBheWxvYWQ+IHtcbiAgICBjb25zdHJ1Y3RvcihhcHA6IENsaWVudEFwcGxpY2F0aW9uPGFueT4pe1xuICAgICAgICBzdXBlcihhcHAsIHR5cGVzXzEuR3JvdXAuTG9hZGluZywgdHlwZXNfMS5Hcm91cC5Mb2FkaW5nKTtcbiAgICB9XG4gICAgZ2V0IHBheWxvYWQoKToge2lkOiBzdHJpbmc7fSB7XG4gICAgICAgIHJldHVybiB7IGlkOiB0aGlzLmlkIH07XG4gICAgfVxuICAgIGRpc3BhdGNoKGFjdGlvbjogQWN0aW9uKTogdGhpcyB7XG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIHR5cGVzXzIuQWN0aW9uLlNUQVJUOlxuICAgICAgICAgICAgICAgIHRoaXMuYXBwLmRpc3BhdGNoKHN0YXJ0KHRoaXMucGF5bG9hZCkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSB0eXBlc18yLkFjdGlvbi5TVE9QOlxuICAgICAgICAgICAgICAgIHRoaXMuYXBwLmRpc3BhdGNoKHN0b3AodGhpcy5wYXlsb2FkKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufSIsImV4cG9ydCAqIGZyb20gJy4vYWN0aW9ucyc7XG5leHBvcnQgKiBmcm9tICcuL3R5cGVzJzsiLCJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5cbnZhciBoZWxwZXJfMSA9IHJlcXVpcmUoXCIuLi9oZWxwZXJcIik7XG52YXIgdHlwZXNfMSA9IHJlcXVpcmUoXCIuLi90eXBlc1wiKTtcbnZhciB0eXBlc18yID0gcmVxdWlyZShcIi4vdHlwZXNcIik7XG5cbmltcG9ydCB7IENsaWVudEFwcGxpY2F0aW9uIH0gZnJvbSAnLi4vLi4vY2xpZW50JztcbmltcG9ydCB7IEFjdGlvblNldCB9IGZyb20gJy4uL2hlbHBlcic7XG5pbXBvcnQgeyBBY3Rpb25TZXRQcm9wcywgR3JvdXAsIE1ldGFBY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBBY3Rpb24sIEFjdGlvblR5cGUsIENsZWFyUGF5bG9hZCwgT3B0aW9ucywgUGF5bG9hZCB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFjdGlvbkJhc2UgZXh0ZW5kcyBNZXRhQWN0aW9uIHtcbiAgICByZWFkb25seSBncm91cDogdHlwZW9mIEdyb3VwLlRvYXN0O1xufVxuZXhwb3J0IGludGVyZmFjZSBTaG93QWN0aW9uIGV4dGVuZHMgQWN0aW9uQmFzZSB7XG4gICAgcmVhZG9ubHkgdHlwZTogdHlwZW9mIEFjdGlvblR5cGUuU0hPVztcbiAgICByZWFkb25seSBwYXlsb2FkOiBQYXlsb2FkO1xufVxuZXhwb3J0IGludGVyZmFjZSBDbGVhckFjdGlvbiBleHRlbmRzIEFjdGlvbkJhc2Uge1xuICAgIHJlYWRvbmx5IHR5cGU6IHR5cGVvZiBBY3Rpb25UeXBlLkNMRUFSO1xufVxuZXhwb3J0IHR5cGUgVG9hc3RBY3Rpb24gPSBTaG93QWN0aW9uIHwgQ2xlYXJBY3Rpb24gfCBNZXRhQWN0aW9uO1xuXG5leHBvcnQgZnVuY3Rpb24gc2hvdyh0b2FzdE1lc3NhZ2U6IFBheWxvYWQpOiBTaG93QWN0aW9uIHtcbiAgICByZXR1cm4gaGVscGVyXzEuYWN0aW9uV3JhcHBlcih7XG4gICAgICAgIGdyb3VwOiB0eXBlc18xLkdyb3VwLlRvYXN0LFxuICAgICAgICBwYXlsb2FkOiB0b2FzdE1lc3NhZ2UsXG4gICAgICAgIHR5cGU6IHR5cGVzXzIuQWN0aW9uVHlwZS5TSE9XLFxuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXIocGF5bG9hZDogQ2xlYXJQYXlsb2FkKTogQ2xlYXJBY3Rpb24ge1xuICAgIHJldHVybiBoZWxwZXJfMS5hY3Rpb25XcmFwcGVyKHtcbiAgICAgICAgcGF5bG9hZDogcGF5bG9hZCxcbiAgICAgICAgZ3JvdXA6IHR5cGVzXzEuR3JvdXAuVG9hc3QsXG4gICAgICAgIHR5cGU6IHR5cGVzXzIuQWN0aW9uVHlwZS5DTEVBUixcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShhcHA6IENsaWVudEFwcGxpY2F0aW9uPGFueT4sIG9wdGlvbnM6IE9wdGlvbnMpOiBUb2FzdCB7XG4gICAgcmV0dXJuIG5ldyBUb2FzdChhcHAsIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgY2xhc3MgVG9hc3QgZXh0ZW5kcyBBY3Rpb25TZXQgaW1wbGVtZW50cyBBY3Rpb25TZXRQcm9wczxPcHRpb25zLCBQYXlsb2FkPiB7XG4gICAgbWVzc2FnZTogc3RyaW5nO1xuICAgIGR1cmF0aW9uOiBudW1iZXI7XG4gICAgaXNFcnJvcj86IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IENsaWVudEFwcGxpY2F0aW9uPGFueT4sIG9wdGlvbnM6IE9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoYXBwLCB0eXBlc18xLkdyb3VwLlRvYXN0LCB0eXBlc18xLkdyb3VwLlRvYXN0KTtcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gJyc7XG4gICAgICAgIHRoaXMuZHVyYXRpb24gPSA1MDAwO1xuICAgICAgICB0aGlzLnNldChvcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXQgcGF5bG9hZCgpOiB7aWQ6IHN0cmluZywgZHVyYXRpb246IG51bWJlciwgaXNFcnJvciA6IGJvb2xlYW4sIG1lc3NhZ2U6IHN0cmluZ30ge1xuICAgICAgICByZXR1cm4gX19hc3NpZ24oeyBpZDogdGhpcy5pZCB9LCB0aGlzLm9wdGlvbnMpO1xuICAgIH1cblxuICAgIGdldCBvcHRpb25zKCk6IE9wdGlvbnMge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZHVyYXRpb246IHRoaXMuZHVyYXRpb24sXG4gICAgICAgICAgICBpc0Vycm9yOiB0aGlzLmlzRXJyb3IsXG4gICAgICAgICAgICBtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXG4gICAgICAgIH07XG4gICAgfVxuICBcbiAgICBzZXQgKG9wdGlvbnM6IFBhcnRpYWw8T3B0aW9ucz4pIDogQWN0aW9uU2V0e1xuICAgICAgICB2YXIgbWVyZ2VkT3B0aW9ucyA9IGhlbHBlcl8xLmdldE1lcmdlZFByb3BzKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAgIHZhciBtZXNzYWdlID0gbWVyZ2VkT3B0aW9ucy5tZXNzYWdlLCBkdXJhdGlvbiA9IG1lcmdlZE9wdGlvbnMuZHVyYXRpb24sIGlzRXJyb3IgPSBtZXJnZWRPcHRpb25zLmlzRXJyb3I7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgIHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvbjtcbiAgICAgICAgdGhpcy5pc0Vycm9yID0gaXNFcnJvcjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2goYWN0aW9uOiBBY3Rpb24pOiB0aGlzIHtcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgdHlwZXNfMi5BY3Rpb24uU0hPVzpcbiAgICAgICAgICAgICAgICB2YXIgb3BlbkFjdGlvbiA9IHNob3codGhpcy5wYXlsb2FkKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC5kaXNwYXRjaChvcGVuQWN0aW9uKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdHlwZXNfMi5BY3Rpb24uQ0xFQVI6XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAuZGlzcGF0Y2goY2xlYXIoeyBpZDogdGhpcy5pZCB9KSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG59XG5cblxuXG4iLCJcblxuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZFJlZGlyZWN0KGZyYW1lOiBXaW5kb3cpOiBib29sZWFue1xuICAgIHJldHVybiBmcmFtZSA9PT0gd2luZG93O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJlZGlyZWN0KHVybDogc3RyaW5nKTogdm9pZHtcbiAgICB2YXIgbG9jYXRpb24gPSBnZXRMb2NhdGlvbigpO1xuICAgIGlmICghbG9jYXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsb2NhdGlvbi5hc3NpZ24odXJsKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhdGlvbigpOiBMb2NhdGlvbiB8IHVuZGVmaW5lZHtcbiAgICByZXR1cm4gaGFzV2luZG93KCkgPyB3aW5kb3cubG9jYXRpb24gOiB1bmRlZmluZWQ7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0V2luZG93KCk6IFdpbmRvdyB8IHVuZGVmaW5lZHtcbiAgICByZXR1cm4gaGFzV2luZG93KCkgPyB3aW5kb3cgOiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGhhc1dpbmRvdygpIHtcbiAgICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG59XG4iLCJleHBvcnQgKiBmcm9tICcuL3R5cGVzJztcbmV4cG9ydCAqIGZyb20gJy4vQ2xpZW50JztcblxuaW1wb3J0IHsgY3JlYXRlQ2xpZW50QXBwIH0gZnJvbSAnLi9DbGllbnQnO1xuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQ2xpZW50QXBwOyJdLCJzb3VyY2VSb290IjoiIn0=