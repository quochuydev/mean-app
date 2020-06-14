'use strict';

const config = {
  secure: {
    ssl: false
  },
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  app: {
    title: 'dlcapp',
    description: 'dlcapp',
    version: '1.0.1'
  },
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/dlcapp',
    options: {
      user: '',
      pass: '',
      poolSize: 50,
      keepAlive: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: process.env.LOG_FORMAT || 'dev'
  },
  mailer: {
    from: process.env.MAILER_FROM,
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER,
      auth: {
        user: process.env.MAILER_EMAIL_ID || '',
        pass: process.env.MAILER_PASSWORD || ''
      }
    }
  },
  templateEngine: 'swig',
  // Session Cookie products
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: false,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'dlcapp',
  // sessionKey is set to the generic sessionId key used by PHP applications
  // for obsecurity reasons
  sessionKey: 'app',
  sessionCollection: 'app_sessions',
  // Lusca config
  csrf: {
    csrf: false,
    csp: false,
    xframe: 'ALLOWALL',
    p3p: 'ABCDEF',
    hsts: {
      maxAge: 31536000, // Forces HTTPS for one year
      includeSubDomains: true,
      preload: true
    },
    xssProtection: false,
    nosniff: false
  },
  etag: true,
  logo: {
    embed: 'modules/core/client/img/brand/logo.svg'
  },
  favicon: {
    embed: 'modules/core/client/img/brand/favicon.ico'
  },
  appslug: 'dlcapp',
  appslugadmin: 'dlcapp/admin',
  appslugfrontend: 'dlcapp/frontend',
  apphost: 'http://localhost:3000',
  apphostcartproxy: 'https://a3c84256.ngrok.io',
  dbprefix: 'dlcapp',
  embed: false,
  verbose: true,
  protocol: 'https://',
  cron_time: {
    sync_product: '0 0,30 * * * *',
    sync_order: '0 0,30 * * * *'
  },
  cron_active: {
    sync_product: false,
    sync_order: false
  },
  rabbit: {
    active: true,
    publisher_active: true,
    consumer_active: true,
    prefix: 'dlcapp_',
    queue: {
      product: {
        name: 'product',
        limit: 5,
        active: true,
        retry: true
      },
      order: {
        name: 'order',
        limit: 5,
        active: true,
        retry: true
      }
    },
    user: 'guest',
    pass: 'guest',
    host: '',
    port: 5672,
    vhost: '',
    prefetch: 1,
    ttl: 2 * 24 * 60 * 60 * 1000, // 48h
    time_retry_consumer: 10 * 60 * 1000,
    time_reconnect: 30 * 1000
  },
  file_cloud: {
    folder: 'es',
    long_term: {
      host: 'https://static.hara.vn',
      auth: 'Basic 2661e0eda6b94a75a2405da4e20e26d4',
      upload_dir: 'uploads',
    },
    short_term: {
      host: 'https://tmp.hara.vn',
      auth: 'Basic cNevGHkJzbXrGKjmsJqVgGiYnADyqpNn',
      import_dir: 'import',
      export_dir: 'export',
    },
  },
  file_config_detail: 'config/evn_detail/default.detail.js'
};

module.exports = config;