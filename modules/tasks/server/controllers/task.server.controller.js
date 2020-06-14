'use strict';

const _ = require('lodash');
const path = require('path');
const escapeStringRegexp = require('escape-string-regexp');
const { TaskService } = require(path.resolve('./modules/tasks/server/services/task-service.server.js'));
const _CONST = require(path.resolve('./modules/core/share/lib/_CONST.lib.share'));

async function search(req, res, next) {
  let criteria = {};
  let result = await TaskService.search({ query: criteria });
  res.json(result);
}

async function detail(req, res, next) {
  let { params } = req;
  let result = await TaskService.get({ params });
  res.json(result);
}

async function write(req, res, next) {
  try {
    let { body } = req;
    let result = await TaskService.write({ body });
    res.json(result);
  } catch (error) {
    res.status(400).send(error);
  }
}

async function changeStatus(req, res, next) {
  let { body, user, params } = req;
  let result = await TaskService.changeStatus({ body, user, orgid: req.session.orgid, shop: req.session.shop, promotionId: params.promotionId });
  res.json(result);
}

async function deleteOne(req, res, next) {
  try {
    let { params, user } = req;
    let result = await TaskService.delete({ params, user, orgid: req.session.orgid, shop: req.session.shop });
    res.json(result);
  } catch (error) {
    res.status(400).send(error);
  }
}

module.exports = { search, detail, write, changeStatus, deleteOne };