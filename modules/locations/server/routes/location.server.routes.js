let path = require('path');
let mongoose = require('mongoose');
let config = require(path.resolve('./config/config'));
let LocationMD = mongoose.model(config.dbprefix + '_Location');

module.exports = function (app, appslug) {
  app.route('/' + appslug + '/api/locations').get(async function (req, res) {
    let orgid = req.session.orgid;
    let locations = await LocationMD.find({ orgid }, { id: 1, name: 1 });
    locations = locations.map(item => {
      item.value = item.id;
      return item;
    })
    res.json({ locations });
  });
};