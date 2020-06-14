let path = require('path');
const mongoose = require('mongoose');

const config = require(path.resolve('./config/config'));
const ShopModel = mongoose.model(config.dbprefix + '_Shop');
const API = require(path.resolve('./modules/core/server/api'));

module.exports = function (app, appslug) {
  app.route('/' + appslug + '/api/customers/groups').get(async function (req, res) {
    try {
      let shop = await ShopModel.findOne({ orgid: req.session.orgid }).lean(true);
      let customer_groups = await API.call(API.OMNI.CUSTOMER.GROUP.LIST, { shop, noLog: true });
      res.json({ customer_groups });
    } catch (error) {
      res.json({ customer_groups: [] });
    }
  });
};