'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  chalk = require('chalk'),
  glob = require('glob'),
  fs = require('fs'),
  path = require('path');

const fse = require('fs-extra');

/**
 * Get files by glob patterns
 */
var getGlobbedPaths = function (globPatterns, excludes) {
  // URL paths regex
  var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  // The output array
  var output = [];

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      var files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map(function (file) {
          if (_.isArray(excludes)) {
            for (var i in excludes) {
              file = file.replace(excludes[i], '');
            }
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }

  return output;
};

/**
 * Validate NODE_ENV existence
 */
var validateEnvironmentVariable = function () {
  var environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js');
  console.log();
  if (!environmentFiles.length) {
    if (process.env.NODE_ENV) {
      console.error(chalk.red('+ Error: No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead'));
    } else {
      console.error(chalk.red('+ Error: NODE_ENV is not defined! Using default development environment'));
    }
    process.env.NODE_ENV = 'development';
  }
  // Reset console color
  console.log(chalk.white(''));
};

/**
 * Validate Session Secret parameter is not set to default in production
 */
var validateSessionSecret = function (config, testing) {

  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  if (config.sessionSecret === 'MEAN') {
    if (!testing) {
      console.log(chalk.red('+ WARNING: It is strongly recommended that you change sessionSecret config while running in production!'));
      console.log(chalk.red('  Please add `sessionSecret: process.env.SESSION_SECRET || \'super amazing secret\'` to '));
      console.log(chalk.red('  `config/env/production.js` or `config/env/local.js`'));
      console.log();
    }
    return false;
  } else {
    return true;
  }
};

/**
 * Initialize global configuration files
 */
var initGlobalConfigFolders = function (config, assets) {
  // Appending files
  config.folders = {
    server: {},
    client: {}
  };

  // Setting globbed client paths
  config.folders.client = getGlobbedPaths(path.join(process.cwd(), 'modules/*/+(client|share)/'), process.cwd().replace(new RegExp(/\\/g), '/'));
};

/**
 * Initialize global configuration files
 */
var initGlobalConfigFiles = function (config, assets) {
  // Appending files
  config.files = {
    server: {},
    client: {},
    share : {},
  };

  // Setting Globbed model files
  config.files.server.models = getGlobbedPaths(assets.server.models);

  // Setting Globbed webhook files
  config.files.server.webhooks = getGlobbedPaths(assets.server.webhooks);

  // Setting Globbed emailservices files
  config.files.server.emailservices = getGlobbedPaths(assets.server.emailservices);

  // Setting Globbed route files
  config.files.server.routes = getGlobbedPaths(assets.server.routes);

  // Setting Globbed config files
  config.files.server.configs = getGlobbedPaths(assets.server.config);

  // Setting Globbed policies files
  config.files.server.policies = getGlobbedPaths(assets.server.policies);

  // Setting Globbed js files
  config.files.client.js = getGlobbedPaths(assets.client.lib.js, 'public/').concat(getGlobbedPaths(assets.client.js, ['public/']));

  // Setting Globbed css files
  config.files.client.css = getGlobbedPaths(assets.client.lib.css, 'public/').concat(getGlobbedPaths(assets.client.css, ['public/']));

  // Setting Globbed test files
  config.files.client.tests = getGlobbedPaths(assets.client.tests);

  // Setting Globbed locales files
  config.files.share.locales = getGlobbedPaths(assets.share.locales);
};

function initSharedFile(config) {
  let localesPath = path.join(path.resolve('./public'), '/share/locales');

  let locale_namespaces = new Set();

  fse.ensureDirSync(localesPath);

  if (Array.isArray(config.files.share.locales)) {
    for (let filePath of config.files.share.locales) {
      let language = path.basename(path.dirname(filePath));
      let languagePath = path.join(localesPath, language);
      fse.ensureDirSync(languagePath);

      let destPath = path.join(languagePath, path.basename(filePath));
      fs.copyFileSync(filePath, destPath);

      let ns = path.basename(filePath, path.extname(filePath));
      locale_namespaces.add(ns);
    }
  }

  config.localize = { ns : Array.from(locale_namespaces) };
}

/**
 * Initialize global configuration
 */
const loadConfigFile = function (linkFile) {
  if(!linkFile) return {};
  linkFile = path.join(process.cwd(), linkFile);
  if(fs.existsSync(path.resolve(linkFile))){
    return require(path.resolve(linkFile));
  }
  return  {};
};

var initGlobalConfig = function () {
  // Validate NODE_ENV existence
  validateEnvironmentVariable();

  // Get the default assets
  var defaultAssets = loadConfigFile('config/assets/default.js');

  // Get the current assets
  var environmentAssets = loadConfigFile(`config/assets/${process.env.NODE_ENV}.js`);

  // Merge assets
  var assets = _.merge(defaultAssets, environmentAssets);

  // Get the default config
  var defaultConfig =  loadConfigFile('config/env/default.js');
  // Get the current config
  var environmentConfig = loadConfigFile(`config/env/${process.env.NODE_ENV}.js`);

  // Merge config files
  var config = _.merge(defaultConfig, environmentConfig);
  // Get the current detail config
  let detailEnvironmentConfig = loadConfigFile(config.file_config_detail);
  if(typeof detailEnvironmentConfig != 'object' || (typeof detailEnvironmentConfig == 'object' && !Object.keys(detailEnvironmentConfig).length)){
    throw new Error(`Current config detail not found with path ${config.file_config_detail}`)
  }
  config = _.merge(detailEnvironmentConfig, config);
  // Extend the config object with the local-NODE_ENV.js custom/local environment. This will override any settings present in the local configuration.
  var localConfig =  loadConfigFile(`config/env/local-${process.env.NODE_ENV}.js`);
  config = _.merge(config, localConfig);

  // read package.json for MEAN.JS project information
  var pkg = require(path.resolve('./package.json'));
  config.meanjs = pkg;

  // Initialize global globbed files
  initGlobalConfigFiles(config, assets);

  // Initialize global globbed folders
  initGlobalConfigFolders(config, assets);

  // Validate session secret
  validateSessionSecret(config);

  initSharedFile(config);

  // Expose configuration utilities
  config.utils = {
    getGlobbedPaths: getGlobbedPaths,
    validateSessionSecret: validateSessionSecret
  };

  // rabbit : add prefix to queue name
  if (config.rabbit && config.rabbit.prefix && config.rabbit.queue && typeof config.rabbit.queue === 'object') {
    for (let key in config.rabbit.queue) {
      config.rabbit.queue[key].name = config.rabbit.prefix + config.rabbit.queue[key].name;
    }
  }

  return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();
