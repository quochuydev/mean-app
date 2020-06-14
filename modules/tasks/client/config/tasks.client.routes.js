'use strict';

angular.module('tasks.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.tasks', {
        url: '/tasks',
        templateUrl: appslug + '/' + 'modules/tasks/client/views/list.client.view.html',
        controller: 'TaskController',
        data: {
          pageTitle: 'Danh sách task'
        }
      })
      .state('admin.tasks-create', {
        url: '/tasks/create',
        templateUrl: appslug + '/' + 'modules/tasks/client/views/create.client.view.html',
        controller: 'TaskCreateController',
        data: {
          pageTitle: 'Tạo task'
        }
      })
      .state('admin.tasks-detail', {
        url: '/tasks/detail/:taskId',
        templateUrl: appslug + '/' + 'modules/tasks/client/views/detail.client.view.html',
        controller: 'TaskDetailController',
        data: {
          pageTitle: 'Chi tiết task'
        }
      })
  }
]);