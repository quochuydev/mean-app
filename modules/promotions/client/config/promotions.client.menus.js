'use strict';

angular.module('promotions.admin').run(['Menus',
    function(Menus) {
        Menus.addSubMenuItem('topbar', 'admin.promotions', {
            title: 'Khuyến mãi',
            state: 'admin.promotions',
            roles: ['*'],
            permission: 'view',
            position: 1,
            icon: null
        });

        Menus.addSubMenuItem('topbar', 'admin.promotions', {
            title: 'Tạo khuyến mãi',
            state: 'admin.promotions-create',
            roles: ['*'],
            permission: 'view',
            position: 2,
            icon: null
        });

        Menus.addSubMenuItem('topbar', 'admin.promotions', {
            title: 'Chi tiết khuyến mãi',
            state: 'admin.promotions-detail',
            roles: ['*'],
            permission: 'view',
            position: 3,
            icon: null
        });
    }
]);