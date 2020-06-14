let { search, detail, write, changeStatus, deleteOne } = require('../controllers/task.server.controller');

module.exports = function (app, appslug) {
  app.route('/' + appslug + '/api/tasks/search').post(search);
  app.route('/' + appslug + '/api/tasks/:taskId').get(detail);
  app.route('/' + appslug + '/api/tasks/create').post(write);
  app.route('/' + appslug + '/api/tasks/change-status/:taskId').put(changeStatus);
  app.route('/' + appslug + '/api/tasks/:taskId').delete(deleteOne);
};