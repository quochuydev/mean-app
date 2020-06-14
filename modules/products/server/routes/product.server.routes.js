let path = require('path');
let { ProductModel } = require(path.resolve('./modules/products/server/models/products.server.model.js'));
let { getSellerProducts } = require('../controllers/product.server.controller');

module.exports = function (app, appslug) {
  app.route('/' + appslug + '/api/seller-products').post(getSellerProducts);

  app.route('/' + appslug + '/api/products').get(async function (req, res) {
    let total = 0;
    let products = [];
    res.json({ products, total });
  });

  app.route('/' + appslug + '/api/products/groups').get(function (req, res) {
    let custom_collections = [];
    res.json({ groups: custom_collections })
  })

  app.route('/' + appslug + '/api/variants').get(function (req, res) {
    let variants = [];
    res.json({ variants })
  })

  app.route('/' + appslug + '/api/variants/:productid').get(function (req, res) {
    let variants = [];
    res.json({ variants })
  })
}