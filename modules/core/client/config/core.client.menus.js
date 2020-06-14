(function () {
    'use strict';

    angular
        .module('core')
        .run(MenuConfig);

    MenuConfig.$inject = ['Menus'];

    function MenuConfig(Menus) {

    }

})();
