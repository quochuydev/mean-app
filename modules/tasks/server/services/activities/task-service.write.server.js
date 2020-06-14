'use strict';

module.exports = ({ TaskModel, MSG }) => async function writePromotion(data) {
  let { body } = data;
  let new_task = { ...body }
  let task = (await TaskModel.create(new_task)).toJSON();
  let result = { task };
  return result;
}