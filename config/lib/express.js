'use strict';

/**
 * Module dependencies.
 */
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var consolidate = require('consolidate');
var express = require('express');
var favicon = require('serve-favicon');
var helmet = require('helmet');
var lusca = require('lusca');
var methodOverride = require('method-override');
var morgan = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

var config = require('../config');
var cron = require('./cron');
var logger = require('./logger');
var nlogger = require(path.resolve('./config/lib/nlogger'));
var rabbitmqStartConsumer = require(path.resolve('./config/lib/rabbit/rabbitmq.start.consumer'));

var appslug = config.appslug;
var appslugEmbed = config.appslugembed;
var appslugAdmin = config.appslugadmin;

var coreModule = 'modules';
var embedModule = 'modules';

var ErrorHandlerMiddleware = require(path.resolve('./modules/core/server/middlewares/error-handler.server.middleware.js'));


/**
 * Initialize local variables
 */
module.exports.initLocalVariables = function (app) {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  if (config.secure && config.secure.ssl === true) {
    app.locals.secure = config.secure.ssl;
  }
  app.locals.env = process.env.NODE_ENV;
  app.locals.jsFiles = config.files.client.js;
  app.locals.cssFiles = config.files.client.css;
  app.locals.logo = config.logo.embed;
  app.locals.favicon = config.favicon.embed;
  app.locals.appslug = appslug;
  app.locals.appslugEmbed = appslugEmbed;
  app.locals.appslugAdmin = appslugAdmin;
  app.locals.appversion = config.app.version;
  app.locals.apphost = config.apphost;

  // Passing the request url to environment locals
  app.use(function (req, res, next) {
    res.locals.host = req.protocol + '://' + req.hostname;
    res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
    next();
  });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
  // Showing stack errors
  app.set('showStackError', true);

  //Disable etag
  if (!config.etag) {
    app.disable('etag');
  }

  // Enable jsonp
  app.enable('jsonp callback');

  // Initialize favicon middleware
  app.use(favicon(app.locals.favicon));

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Disable views cache
    app.set('view cache', false);

    // Enable logger (morgan)
    app.use(morgan(logger.getFormat(), logger.getOptions()));
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  }));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(methodOverride());

  // Add the cookie parser middleware
  app.use(cookieParser());

  // Set app version for all requests
  app.use(function (req, res, next) {
    res.set('appversion', config.app.version);

    next();
  });
  app.disable('x-powered-by');
};

/**
 * Configure view engine
 */
module.exports.initViewEngine = function (app) {
  // Set swig as the template engine
  app.engine('server.view.html', consolidate[config.templateEngine]);

  // Set views path and view engine
  app.set('view engine', 'server.view.html');
  app.set('views', './');
};

/**
 * Configure Express session
 */
module.exports.initSession = function (app, db) {
  // Express MongoDB session storage
  app.set('trust proxy', 1);
  app.use(session({
    name : config.appslug,
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    cookie: {
      maxAge: config.sessionCookie.maxAge,
      httpOnly: config.sessionCookie.httpOnly,
      secure: config.sessionCookie.secure && config.secure.ssl,
      sameSite: 'none'
    },
    key: config.sessionKey,
    store: new MongoStore({
      mongooseConnection: db.connection,
      collection: config.sessionCollection,
      stringify: false
    })
  }));

  // Add Lusca CSRF Middleware
  app.use(lusca(config.csrf));
};

/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = function (app, db) {
  config.files.server.configs.forEach(function (configPath) {
    require(path.resolve(configPath))(app, db);
  });
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function (app) {
  // Setting the app router and static folder
  app.use('/' + appslug + '/', express.static(path.resolve('./public')));
  app.use('/' + appslug + '/media/', express.static(path.resolve('./media')));

  config.folders.client.forEach(function (staticPath) {
    app.use('/' + appslug + staticPath, express.static(path.resolve('./' + staticPath)));
  });
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = function (app) {
  // Globbing routing files
  config.files.server.routes.forEach(function (routePath) {
    if (routePath.indexOf(coreModule) != -1) {
      require(path.resolve(routePath))(app, appslugAdmin);
    }
  });
};

/**
 * Configure CronJob
 */
module.exports.initCrons = function () {
  cron.start();
};

/**
 * Configure Rabbit
 */
module.exports.initRabbitConsumers = function () {
  rabbitmqStartConsumer.start();
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function (app) {
  app.use(ErrorHandlerMiddleware);
};

/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
  // Initialize express app
  var app = express();

  // Initialize local variables
  this.initLocalVariables(app);

  // Initialize Express middleware
  this.initMiddleware(app);

  // Initialize Express view engine
  this.initViewEngine(app);

  // Initialize modules static client routes, before session!
  this.initModulesClientRoutes(app);

  // Initialize Express session
  this.initSession(app, db);

  // Initialize Modules configuration
  this.initModulesConfiguration(app);

  // Initialize modules server routes
  this.initModulesServerRoutes(app);

  // Initialize CronJob
  this.initCrons();

  // Initialize Rabbit Consumers
  this.initRabbitConsumers();

  // Initialize error routes
  this.initErrorRoutes(app);

  return app;
};
