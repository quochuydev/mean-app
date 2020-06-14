'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      id: 'promotions',
      title: 'Khuyến mãi',
      state: 'admin.promotions',
      type: 'dropdown',
      roles: ['*'],
      groups: ['admin.promotions'],
      permission: '*',
      icon: null
    });
    Menus.addMenuItem('topbar', {
      id: 'tasks',
      title: 'Tasks',
      state: 'admin.tasks',
      type: 'dropdown',
      roles: ['*'],
      groups: ['admin.tasks'],
      permission: '*',
      icon: null
    });
  }
]);
