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
  }
]);
