'use strict';

angular.module('tasks.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin.tasks', {
      title: 'Task',
      state: 'admin.tasks',
      roles: ['*'],
      permission: 'view',
      icon: null
    });

    Menus.addSubMenuItem('topbar', 'admin.tasks', {
      title: 'Tạo task',
      state: 'admin.tasks-create',
      roles: ['*'],
      permission: 'view',
      icon: null
    });

    Menus.addSubMenuItem('topbar', 'admin.tasks', {
      title: 'Chi tiết khuyến mãi',
      state: 'admin.tasks-detail',
      roles: ['*'],
      permission: 'view',
      icon: null
    });
  }
]);