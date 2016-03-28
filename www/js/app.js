// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('svBeaconPrototype', [
    'ionic',
    'ngCordova',
    'ngStorage',
    'svBeaconPrototype.validations',
    'svBeaconPrototype.router',
    'svBeaconPrototype.messages',
    'svBeaconPrototype.offline',
    'svBeaconPrototype.network',
    'svBeaconPrototype.audio',
    'svBeaconPrototype.date',
    'svBeaconPrototype.photo',
    'svBeaconPrototype.messages',
    'svBeaconPrototype.googleGeocode',
    'svBeaconPrototype.validations',
    'svBeaconPrototype.location',
    'svBeaconPrototype.googleAnalytics'
  ])

  .run(function ($ionicPlatform, $rootScope, Router) {
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

    	Router.init($rootScope);
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'features/side-menu/side-menu.tpl.html',
        controller: 'SideMenuCtrl'
      })

      .state('app.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'features/home/home.tpl.html',
            controller: 'HomeCtrl'
          }
        }
      })

      .state('app.range', {
        url: '/range',
        views: {
          'menuContent': {
            templateUrl: 'features/range/range.tpl.html',
            controller: 'RangeCtrl'
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

      .state('app.my-details', {
        url: '/my-details',
        views: {
          'menuContent': {
            templateUrl: 'features/my-details/my-details.tpl.html',
            controller: 'MyDetailsCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');

  });
