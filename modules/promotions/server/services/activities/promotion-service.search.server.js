'use strict';

const path = require('path');
const mongoose = require('mongoose');
const _do = require(path.resolve('./modules/core/share/lib/_do.lib.share.js'));
const { remoteMongoJoin } = require(path.resolve('./modules/core/server/libs/common.server.lib'));
const config = require(path.resolve('./config/config'));
const UserModel = mongoose.model(config.dbprefix + '_User');

module.exports = ({ PromotionModel }) => async function (data) {
  const result = {
    total: 0,
    items: []
  };
  try {
    const { orgid, query } = data;

    let { filter, fields, skip, limit, sort = { created_at: -1 } } = _do.parseQuery({ query });
    filter = { ...filter, orgid, is_deleted: PromotionModel.IS_NOT_DELETED };

    const total = await PromotionModel.count(filter);

    if (total > 0) {
      result.total = total;
      result.items = await PromotionModel.find(filter, fields).skip(skip).limit(limit).sort(sort).lean(true);
      await remoteMongoJoin({
        source: {
          items: result.items,
          key: 'user_created',
          assign: (item, _user_created) => item._user_created = _user_created
        },
        dest: {
          key: 'id',
          filter: keys => ({ id: { $eq: keys }, orgid }),
          model: UserModel
        }
      })
    }
    return result;
  } catch (error) {
    console.log(error);
    return result;
  }
}