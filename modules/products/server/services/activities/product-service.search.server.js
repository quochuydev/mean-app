'use strict';

const path = require('path');
const _do = require(path.resolve('./modules/core/share/lib/_do.lib.share.js'));

module.exports = ({ ProductModel }) => async function searchProduct(data) {
  const { orgid, query } = data;

  const result = {
    total: 0,
    items: []
  };

  const { filter, fields, skip, limit, sort = { updated_at: -1 } } = _do.parseQuery({ query });

  filter.orgid = orgid;

  const total = await ProductModel.count(filter);

  if (total > 0) {
    result.total = total;
    result.items = await ProductModel.find(filter, fields).skip(skip).limit(limit).sort(sort).lean(true);
  }

  return result;
}

