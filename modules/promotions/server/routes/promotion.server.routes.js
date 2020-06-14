let path = require('path');
let config = require(path.resolve('./config/config'));
let { search, detail, write, changeStatus, deleteOne, calculateCart } = require('../controllers/promotion.server.controller');

module.exports = function (app, appslug) {
  app.route('/' + config.appslug + '/cart-promotion').post(calculateCart);

  app.route('/' + appslug + '/api/promotions/search').post(search);
  app.route('/' + appslug + '/api/promotions/:promotionId').get(detail);
  app.route('/' + appslug + '/api/promotions/create').post(write);
  app.route('/' + appslug + '/api/promotions/change-status/:promotionId').put(changeStatus);
  app.route('/' + appslug + '/api/promotions/:promotionId').delete(deleteOne);
};