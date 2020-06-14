let path = require('path');
let config = require(path.resolve('./config/config'));
const mongoose = require('mongoose');
const UserModel = mongoose.model(config.dbprefix + '_User');

module.exports = function (app, appslug) {
  app.route('/' + appslug + '/api/users').get(async function (req, res) {
    try {
      let users = await UserModel.find({ orgid: req.session.orgid }, { id: 1, first_name: 1, last_name: 1, email: 1 });
      res.json({ users });
    } catch (error) {
      res.json({ users: [] });
    }
  });
};