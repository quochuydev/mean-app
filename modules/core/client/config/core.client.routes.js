'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
      .state('home', {
        url: '/' + appslug + '/',
        templateUrl: appslug + '/' + 'modules/core/client/views/home.client.view.html',
        params: {
          message: null
        }
      })
      .state('redirecting', {
        url: '/' + appslug + '/login/redirecting',
        controller: 'RedirectingController',
        templateUrl: appslug + '/' + 'modules/core/client/views/redirecting.client.view.html'
      })
      .state('not-found', {
        url: '/' + appslug + '/not-found',
        templateUrl: appslug + '/' + 'modules/core/client/views/404.client.view.html',
        data: {
          ignoreState: true,
          pageTitle: 'Not-Found'
        }
      })
      .state('bad-request', {
        url: '/' + appslug + '/bad-request',
        templateUrl: appslug + '/' + 'modules/core/client/views/400.client.view.html',
        data: {
          ignoreState: true,
          pageTitle: 'Bad-Request'
        }
      })
      .state('forbidden', {
        url: '/' + appslug + '/forbidden',
        templateUrl: appslug + '/' + 'modules/core/client/views/403.client.view.html',
        data: {
          ignoreState: true,
          pageTitle: 'Forbidden'
        }
      })
      .state('server-error', {
        url: '/' + appslug + '/server-error',
        templateUrl: appslug + '/' + 'modules/core/client/views/500.client.view.html',
        data: {
          ignoreState: true,
          pageTitle: 'Server Error'
        }
      });
  }
]);
