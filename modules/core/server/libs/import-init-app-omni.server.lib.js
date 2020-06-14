const mongoose = require('mongoose');
const path = require('path');
const config = require(path.resolve('./config/config'));
const nlogger = require(path.resolve('./config/lib/nlogger'));
const API = require(path.resolve('./modules/core/server/api/index'));
const UserMD = mongoose.model(config.dbprefix + '_User');
const LocationMD = mongoose.model(config.dbprefix + '_Location');
const ShopMD = mongoose.model(config.dbprefix + '_Shop');

class ImportInitAppOmni {
  constructor(shop) {
    this.shop = shop;
  }

  startImportUser() {
    let _this = this;
    return new Promise(async (resolve, reject) => {
      try {
        let shop = this.shop;
        let users = await API.call(API.OMNI.USERS.FIND, { shop });
        if(!users || (users && !users.length)) return resolve();
        for(let user of users){
          user.shop = shop._id;
          user.orgid = shop.orgid;
          user.is_deleted = false;
          await UserMD.findOneAndUpdate({id: user.id, orgid: shop.orgid}, {$set: user}, {upsert: true, setDefaultOnInsert: true});
        }
        resolve()
      } catch (error) {
        nlogger.writelog(nlogger.NLOGGER_ERROR, error, { filename: __filename, fn: 'startImportUser', shop: _this.shop });
        reject(error)
      }
    })
  }

  startImportLocation() {
    let _this = this;
    return new Promise(async (resolve, reject) => {
      try {
        let shop = this.shop;
        let locations = await API.call(API.OMNI.LOCATIONS.FIND, { shop });
        if(!locations || (locations && !locations.length)) return resolve();
        for(let location of locations){
          location.shop = shop._id;
          location.orgid = shop.orgid;
          location.is_deleted = false;
          await LocationMD.findOneAndUpdate({id: location.id, orgid: shop.orgid}, {$set: location}, {upsert: true, setDefaultOnInsert: true});
        }
        resolve();
      } catch (error) {
        nlogger.writelog(nlogger.NLOGGER_ERROR, error, { filename: __filename, fn: 'startImportLocation' }, { data: _this.shop });
        reject(error);
      }
    })
  }

  registerCartProxy(){
    let _this = this;
    return new Promise(async (resolve, reject) => {
      try {
        resolve();
      } catch (error) {
        nlogger.writelog(nlogger.NLOGGER_ERROR, error, { filename: __filename, fn: 'registerCartProxy' }, { data: _this.shop });
        reject(error);
      }
    })
  }
}

module.exports = ImportInitAppOmni;