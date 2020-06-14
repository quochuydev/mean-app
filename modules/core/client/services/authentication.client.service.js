'use strict';

angular.module('core').factory('Authentication', ['$localStorage',
  function ($localStorage) {
    var storageKey = appslug + '_user';

    var auth = {
      user: $localStorage[storageKey],
      getUser: function () {
        this.user = $localStorage[storageKey];

        return $localStorage[storageKey];
      },
      setUser: function(user) {
        this.user = user;
        $localStorage[storageKey] = user;
      },
      clear: function() {
        delete $localStorage[storageKey];
      }
    };

    auth = { user: { first_name: 'Huy', last_name: 'Pham', email: 'quochuy.dev@gmail.com' } };
    return auth;
  }
]);