(function () {
  'use strict';

  angular.module('core').directive('headerTitle', headerTitle);

  headerTitle.$inject = ['Authentication', 'Shop', '$state'];

  function headerTitle(Authentication, Shop, $state) {
    var directive = {
      templateUrl: appslug + "/modules/core/client/directives/templates/header-title.client.view.html",
      retrict: 'A',
      scope: {
        pageTitle: '@',
        mainTitle: '@',
        mainHref: '@'
      },
      link: link
    };

    return directive;

    function link(scope) {
      scope.appslug = appslug;
      scope.authentication = Authentication;
      scope.userName = _do.joinS([Authentication.user.first_name, Authentication.user.last_name], ' ');
      scope.userEmail = Authentication.user.email;
      scope.userImage = scope.userName.substring(0, 2).toUpperCase();

      scope.isShow = false;

      scope.toggle = function () {
        scope.isShow = !scope.isShow;
      }

      scope.logout = function () {
        Authentication.clear();
        Shop.clear();
      }

      scope.showMobileMenu = function () {
        $('.mobile-menu').addClass('show-mobile-menu').removeClass('hide-mobile-menu');
      }

      $(document).on('click', function (e) {
        if ($(e.target).parents('.title-bar-user').length) { return }
        scope.$apply(function () { scope.isShow = false; });
      });
    }
  }
})();
