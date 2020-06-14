'use strict';

const path = require('path');
const passport = require('passport');
const CustomStrategy = require('passport-custom');
const config = require(path.resolve('./config/config'));
const mongoose = require('mongoose');
const UserMD = mongoose.model(config.dbprefix + '_User');
const ShopMD = mongoose.model(config.dbprefix + '_Shop');
const { OAuth2 } = require('oauth');
const jwt = require('jsonwebtoken');
const nlogger = require(path.resolve('./config/lib/nlogger'));

module.exports = function () {
  passport.use('HARA_ACCOUNT', new CustomStrategy(async (req, done) => {
    try {
      let code = req.query.code;
      if (!code) return done(true, null);
      let { responseParams } = await getHrToken(code);
      let userHR = jwt.decode(responseParams.id_token);
      if (!userHR || !userHR.sub) return done(null, false, { code: 'ERR_STEP_DECODE', message: 'ERR NOT AVAILABLE USER!' });
      userHR.id = userHR.sub;
      let foundShop = await ShopMD.findOne({ orgid: userHR.orgid }).lean(true);
      if (!foundShop) return done(null, false, { code: 'ERR_NOT_FOUND_SHOP', message: 'ERR NOT FOUND SHOP!' });
      if (!foundShop.status) return done(null, false, { code: 'ERR_UNINSTALLED', message: 'ERR UNINSTALLED!' });
      let user = await UserMD.findOne({ id: userHR.id, is_deleted: false }).lean(true);
      if (!user || !user.id) return done(null, false, { code: 'ERR_STEP_FIND_USER', message: 'ERR NOT FOUND USER!' });
      done(null, user, { shop: foundShop });
    } catch (error) {
      nlogger.writelog(nlogger.NLOGGER_ERROR, 'Authen HARA_ACCOUNT failed', { filename: __filename, fn: 'SIGNIN_HARA_ACCOUNT' });
      done(true, null);
    }
  }));
}

const getHrToken = (code) => {
  return new Promise((resolve, reject) => {
    return resolve({});
    let params = {};
    params.grant_type = 'authorization_code';
    params.redirect_uri = config.apphost + '/' + config.appslug + config.hara_app.login_callback_url;
    let _oauth2 = new OAuth2(
      config.hara_app.app_id,
      config.hara_app.app_secret,
      '',
      config.hara_app.url_authorize,
      config.hara_app.url_connect_token,
      ''
    );
    _oauth2.getOAuthAccessToken(code, params, (err, accessToken, refreshToken, responseParams) => {
      if (err) { reject(err); }
      else { resolve({ accessToken, refreshToken, responseParams }); }
    });
  });
};