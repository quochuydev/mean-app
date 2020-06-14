const path = require('path');
const mongoose = require('mongoose');

const config = require(path.resolve('./config/config'));
const ShopModel = mongoose.model(config.dbprefix + '_Shop');
const API = require(path.resolve('./modules/core/server/api'));

async function getSellerProducts(req, res, next) {
  let { page, limit, title_product, title_variant, sku, searchq } = req.body;
  try {
    let shop = await ShopModel.findOne({ orgid: req.session.orgid }).lean(true);
    let query = formatSearchSellerProducts({ page, limit, title_product, title_variant, sku, searchq });
    let total = await API.call(API.OMNI.PRODUCTS.COUNT, { shop, query, noLog: true });
    if (!total) { throw { total: 0, products: [] } };
    let products = await API.call(API.OMNI.PRODUCTS.FIND, { shop, query, noLog: true });
    throw { total, products };
  } catch (signal) {
    let { products = [], total = 0 } = signal;
    res.json({ products, total, query_at: new Date(), title_product, title_variant, sku, searchq });
  }
}

function formatSearchSellerProducts({ page, limit, title_product, title_variant, sku, searchq }) {
  let apipath = '';
  if (!(page >= 0)) { page = 1 };
  if (!(limit >= 0)) { limit = 10 };
  apipath += `?page=${page}&limit=${limit}`;

  let searchFilter = '';
  if (title_product && title_product.trim()) {
    searchFilter += `(title:product**${encodeExpressionValue(title_product)})`;
  }

  if (title_variant && title_variant.trim()) {
    if (searchFilter.trim()) { searchFilter += '||'; }
    searchFilter += `(variant:product**${encodeExpressionValue(title_variant)})`;
  }

  if (sku && sku.trim()) {
    if (searchFilter.trim()) { searchFilter += '||'; }
    searchFilter += `(sku:product**${encodeExpressionValue(sku)})`;
  }

  if (searchFilter.trim()) {
    let q = `(${searchFilter})`;
    let q1 = encodeURIComponent(q);
    let q2 = encodeURIComponent(q1);
    apipath += "&query=filter=" + q2;
  } else if (searchq) {
    apipath += `&query=${encodeURIComponent(searchq)}`;
  }

  apipath += '&fields=id,handle,published_at,published_scope,created_at,updated_at,product_type,title,vendor,tags,images,image,options,variants';
  return apipath;
}

let ExpressionSpecialChars = [
  { key: '(', val: '%26' },
  { key: ')', val: '%27' },
  { key: '|', val: '%28' },
  { key: '-', val: '%29' },
  { key: '&', val: '%30' }
];

function encodeExpressionValue(val) {
  if (typeof val !== 'string' || val == null || val == '') { return val; }
  val = val.replace('%', '%25');
  for (let n = 0; n < ExpressionSpecialChars.length; n++) {
    let char = ExpressionSpecialChars[n];
    val = val.replace(char.key, char.val);
  }
  return val;
}

module.exports = { getSellerProducts }