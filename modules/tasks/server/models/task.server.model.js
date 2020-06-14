/*
const { TaskModel } = require(path.resolve('./modules/tasks/server/models/task.server.model.js'));
*/

'use strict';

const path = require('path');
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require(path.resolve('./config/config'));
const { Schema } = mongoose;

const PromotionSchema = new Schema({
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  is_deleted: { type: Boolean, default: false },
  status: { type: Number, default: null },
  title: { type: String, default: null },
  description: { type: String, default: null },
});

const TaskModel = mongoose.model(config.dbprefix + '_Task', PromotionSchema);

module.exports = { TaskModel };