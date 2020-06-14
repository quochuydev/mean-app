'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var path = require('path');

var config = require(path.resolve('./config/config'));
var ShopMD = mongoose.model(config.dbprefix + '_Shop');

const ShopBus = {
  installApp: async function (shop, auth) {
    let expires_time = new Date();
    expires_time.setTime(expires_time.getTime() + Number(auth.expires_in));
    auth.expires_time = expires_time;
    let shopName = shop.domain.replace('https://', '');
    shopName = shopName.replace('http://', '');
    var updateData = {
      _id: shopName,
      authorize: auth,
      settings: shop,
      orgid: shop.id,
      install_date: new Date(),
      status: ShopMD.STATUS_ACTIVE,
    };
    let shopSaved = await ShopMD.findOneAndUpdate({ orgid: shop.id }, { $set: updateData }, { new: true, upsert: true, lean: true, setDefaultOnInsert: true });
    return shopSaved;
  },
  load: async function (orgid) {
    if (!orgid) return null;
    let criteria = {
      orgid,
      status: ShopMD.STATUS_ACTIVE
    };
    return await ShopMD.findOne(criteria);
  },
  update: async function (orgid, shop) {
    if (!orgid) return null;
    let criteria = {
      orgid,
      status: ShopMD.STATUS_ACTIVE
    };
    return await ShopMD.findOneAndUpdate(criteria, { $set: { settings: shop } }, { new: true });
  },
  unInstallApp: async function (orgid) {
    let criteria = {
      orgid,
      status: ShopMD.STATUS_ACTIVE
    };
    var updateData = {
      authorize: {
        'access_token': null,
        'refresh_token': null,
        'expires_in': 0,
        'expires_time': null,
        'id_token': null,
        'token_type': null,
        'scope': null
      },
      uninstall_date: new Date(),
      status: ShopMD.STATUS_DEACTIVE
    };
    return await ShopMD.findOneAndUpdate(criteria, { $set: updateData }, { new: true });
  },
  login: function (req, res, next) {
    return async function authenticate(err, user, info) {
      if (err || !user) {
        if (info && info.code && ['ERR_NOT_FOUND_SHOP', 'ERR_UNINSTALLED'].includes(info.code)) {
          return res.json({ error: false, code: 'REDIRECT', url: '/' });
        }
        return res.redirect('/' + config.appslug + '/permission')
      }
      let userIP = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress || null;

      user.password = undefined;
      user.salt = undefined;
      let shop = info.shop;
      req.session.user = user;
      req.session.shop = shop._id;
      req.session.orgid = shop.orgid;
      req.session.access_token = shop.authorize.access_token;
      req.session.save(function () {
        req.login(user, function (err) {
          if (err) return res.status(400).send({ error: true, message: 'Something wrong!' });
          delete shop.authorize;
          res.json({
            user: user,
            shop: shop
          });
        })
      })

    }
  }
};
module.exports = { ShopBus };