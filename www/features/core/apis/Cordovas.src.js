/**
 * @author Parham
 * @since 31/03/2016
 */

angular.module('svBeaconPrototype')

  .factory('Cordovas', function ($ionicPlatform, $log, $window, $interval, $q, Validations) {
    var _isDefined = Validations.isDefined,
      _isArray = Validations.isArray,
      interval = 10000, INITIS = {READY: 'READY', INTERVAL: 'INTERVAL'}, intervalCount = 0,
      timer = $interval(function () {
        intervalCount++;
        $log.info('interval, calling init(INITIS.INTERVAL) ', intervalCount);
        //we need to stop and tell

        _init(INITIS.INTERVAL);
      }, interval),
      deferred = $q.defer();


    function _checkPluginsAvailability(plugins) {
      var deferred = $q.defer();

      angular.forEach(plugins, function (plugin) {
        if (!_isDefined($window.cordova.plugins[plugin])) {
          deferred.reject(plugin);
        }
      });

      deferred.resolve(plugins);

      return deferred.promise;
    }

    function _isReallyReady(calledBy, cordova) {
      return ((calledBy === INITIS.READY) && cordova && cordova.plugins);
    }

    function _init(calledBy) {
      $log.info('init cordova available? ', calledBy, $window.cordova);

      if (!_isReallyReady(calledBy, $window.cordova)) {
        $log.info('window.cordova is not available, stop init and wait the next ');
        return;
      }

      $log.info('cordova is ready, cancel the interval and init...');
      deferred.resolve();
      $interval.cancel(timer);

    }

    function _isPluginsReady(plugins) {
      $log.info('Cordovas, Checking app and plugis ready status...', plugins);

      if(_isDefined(plugins) && !_isArray(plugins)){
        throw Error('Cordovas.isPluginsReady() expects an array of plugins!')
      }

      if (_isDefined(plugins) && plugins.length > 0) {
        return deferred.promise.then(function(){
          return _checkPluginsAvailability(plugins);
        });
      }

      return deferred.promise;
    }

    function _isAppReady(){
      var deferred = $q.defer();
      $ionicPlatform.ready(function(){
        deferred.resolve();
      })
      return deferred.promise;
    }

    $ionicPlatform.ready(function () {
      _init(INITIS.READY);
    });

    return {
      isPluginsReady: _isPluginsReady,
      isAppReady: _isAppReady
    }

  });
