angular.module('svBeaconPrototype.offline',[])
  .factory('Offline',
    function ($window, $log, $http, $q) {
      'use strict';

      var Offlines = {};

      Offlines.getOnlineText = function () {
        return Offlines.isOnline() ? 'Online' : 'Offline';
      };

      Offlines.isOnline = function () {
        var deferred = $q.defer();
        $http.get('empty.json?nocache='+new Date()).then(function() {
          deferred.resolve(true);
        }, function() {
          deferred.resolve(false);
        })
        return deferred.promise;
      };

      Offlines.loadResources = function(resources) {
        var deferred = $q.defer();

        var chain = resources.forEach(function(r) {
          $log.info('Offlines.loadResources resources to load ', r);
          $http.get(r);
        });

        //chain.then(function () {
        //  deferred.resolve(resources);
        //},function(err) {
        //  deferred.reject(err);
        //});

        return deferred.promise;
      }

      //$window.applicationCache.onchecking = function (e) {
      //  $log.info('Checking for a new version of the application.');
      //};
      //$window.applicationCache.ondownloading = function (e) {
      //  $log.info('Downloading a new offline version of the application');
      //};
      //$window.applicationCache.oncached = function (e) {
      //  $log.info('The application is available offline.');
      //};
      $window.applicationCache.onerror = function (e) {
        $log.error('Something went wrong while updating the offline version  of the application. It will not be available offline.', e);
      };
      $window.applicationCache.onupdateready = function (e) {
        $window.applicationCache.swapCache();
        $log.info('The application was updated. Refresh for the changes to take place.');
        window.location.reload(true);
      };
      //$window.applicationCache.onnoupdate = function (e) {
      //  $log.info('The application is also available offline.');
      //};
      //$window.applicationCache.onobsolete = function (e) {
      //  $log.info('The application can not be updated, no manifest file was found.');
      //};

      return Offlines;
    });




