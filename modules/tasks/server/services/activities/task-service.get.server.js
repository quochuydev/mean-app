'use strict';

const path = require('path');

module.exports = ({ TaskModel }) => async function (data) {
  const result = {
    item: null
  };

  const { taskId } = params;

  let filter = { _id: taskId }

  result.item = await TaskModel.findOne(filter).lean(true);

  return result;
}