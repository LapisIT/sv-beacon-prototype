// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('svBeaconPrototype', ['ionic', 'ngCordova', 'ngStorage'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

        cordova.getAppVersion(function (version) {
          $rootScope.appVersion = version;
        });

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'features/side-menu/side-menu.tpl.html',
        controller: 'SideMenuCtrl'
      })

      .state('app.notification', {
        url: '/notification',
        views: {
          'menuContent': {
            templateUrl: 'features/range/range.tpl.html',
            controller: 'NotificationCtrl'
          }
        }
      })

      .state('app.register', {
        url: '/register',
        views: {
          'menuContent': {
            templateUrl: 'features/register/register.tpl.html',
            controller: 'RegisterCtrl'
          }
        }
      })

      .state('app.myDetails', {
        url: '/my-details',
        views: {
          'menuContent': {
            templateUrl: 'features/my-details/my-details.tpl.html',
            controller: 'MyDetailsCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/notification');

  });
