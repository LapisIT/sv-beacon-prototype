window.sv = {};
window.sv.isDebugMode = true;

window.sv.logs = (function () {
  var logs = [];
  if (window.console && console.log) {
    var oldInfo = console.info,
      oldLog = console.log,
      oldWarn = console.warn,
      oldError = console.error, maxLogLengths = 100;

    function logging(msg, colour, csl, thisArg, arguments) {
      if (window.sv.isDebugMode) {
        if (logs.length > maxLogLengths) {
          window.clearLogs();
        }
        try {
          logs.push('<div style="color: ' + colour + ';">' + (JSON.stringify(arguments)) + '</div>');
        } catch (e){
          console.error('json logger failed to log!');
        }
        csl.apply(thisArg, arguments);
        return;
      }
      if(!window.sv.isDebugMode && colour === 'red'){
        csl.apply(thisArg, arguments);
      }
    }

    console.info = function (msg) {
      logging(msg, 'blue', oldInfo, this, arguments);
    };
    console.log = function (msg) {
      logging(msg, 'black', oldLog, this, arguments);
    };
    console.warn = function (msg) {
      logging(msg, '#ff6600', oldWarn, this, arguments);
    };
    console.error = function (msg) {
      logging(msg, 'red', oldError, this, arguments);
    };

  }

  window.hideLogs = function () {
    document.getElementById('logger').style.display = 'none';
    window.clearLogs();
  };

  window.clearLogs = function () {
    window.sv.logs.splice(0, window.sv.logs.length);
    var logger = document.getElementById('logger');
    logger.innerHTML = '<button class="button button-balanced button-full button-highlight" ' +
      'onclick="hideLogs()">Hide logs </button> <button class="button button-assertive button-full"' +
      'onclick="clearLogs()">Clear logs </button> <br/> <br/>';

  };

  return logs;
})();
console.log('logs init? ', window.sv.logs);

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
    'svBeaconPrototype.googleAnalytics',
    'firebase',
    'ngDraggable'
  ])

  .run(function ($log, $rootScope, $window, Router, Cordovas) {
    $log.info('Welcome to SpeciesReporting...');

    $rootScope.isDebugMode = ($window.sv && $window.sv.isDebugMode);

    function init() {

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        cordova.plugins.Keyboard.disableScroll(true);

        cordova.getAppVersion(function (version) {
          $rootScope.appVersion = version;
        });

      }

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      if ($window.screen && $window.screen.lockOrientation) {
        $window.screen.lockOrientation('portrait');
      }
    }

    Cordovas.isAppReady().then(function(){
      Router.init($rootScope);
    });

    Cordovas.isPluginsReady().then(function () {
      init();
    })
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.swipeBackEnabled(false);
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'features/side-menu/side-menu.tpl.html',
        controller: 'SideMenuCtrl'
      })

      .state('app.home', {
        url: '/home',
        cache:false,
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

      .state('app.whereabout', {
        url: '/whereabout',
        cache:false,
        views: {
          'menuContent': {
            templateUrl: 'features/whereabout/whereabout.tpl.html',
            controller: 'WhereaboutCtrl'
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

      .state('app.game', {
        url: '/game',
        views: {
          'menuContent': {
            templateUrl: 'features/dnd-game/dnd-game.tpl.html',
            controller: 'DndGameCtrl'
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
