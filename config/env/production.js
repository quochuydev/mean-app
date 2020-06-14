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
    uri: process.env.MONGOHQ_URL,
    options: {
      user: '',
      pass: '',
      poolSize: 50,
      keepAlive: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000
    },
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
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
  sessionCookie: {
    maxAge: 24 * (60 * 60 * 1000),
    httpOnly: false,
    secure: false
  },
  sessionSecret: process.env.SESSION_SECRET || 'dlcapp',
  sessionKey: 'app',
  sessionCollection: 'app_sessions',
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
  apphost: 'https://dlcapp.herokuapp.com',
  apphostcartproxy: 'https://dlcapp.herokuapp.com',
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