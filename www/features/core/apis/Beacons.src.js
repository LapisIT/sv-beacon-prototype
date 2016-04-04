/**
 * @author Parham
 * @since 22/03/2016
 */

angular.module('svBeaconPrototype').factory('Beacons',
  function ($rootScope, $cordovaBeacon, $log, Cordovas) {
    var toKey = function (uuid, major, minor) {
        return uuid.toUpperCase() + ':' + major + ':' + minor;
      },
      _PROXIMITY = {
        IMMEDIATE: 'ProximityImmediate',
        NEAR: 'ProximityNear',
        FAR: 'ProximityFar',
        UNKNOWN: 'ProximityUnknown'
      };

    $rootScope.isBluetoothEnabled = false;

    $rootScope.$on("$cordovaBeacon:peripheralManagerDidStartAdvertising", function (event, pluginResult) {
      $log.info('$cordovaBeacon:peripheralManagerDidUpdateState', pluginResult);
      $rootScope.isBluetoothEnabled = true;
    });

    $rootScope.$on("$cordovaBeacon:peripheralManagerDidUpdateState", function (event, pluginResult) {
      $log.info('$cordovaBeacon:peripheralManagerDidUpdateState', pluginResult);
      $rootScope.isBluetoothEnabled = (pluginResult.state === 'PeripheralManagerStatePoweredOn');
    });

    function _createRegion(identifier, uuid, major, minor, notifyEntryStateOnDisplay) {
      return Cordovas.isPluginsReady(['locationManager']).then(function () {
        return $cordovaBeacon.createBeaconRegion(identifier, uuid, major, minor, notifyEntryStateOnDisplay);
      });
    }

    function _isBluetoothEnabled() {
      return Cordovas.isPluginsReady(['locationManager']).then(function () {
        return $cordovaBeacon.isBluetoothEnabled();
      });
    }

    function _requestAlwaysAuthorization() {
      return Cordovas.isPluginsReady(['locationManager']).then(function () {
        return $cordovaBeacon.requestAlwaysAuthorization();
      });
    }

    _isBluetoothEnabled().then(function (isBluetoothEnabled) {
      $log.info('isBluetoothEnabled', isBluetoothEnabled);
      $rootScope.isBluetoothEnabled = isBluetoothEnabled;
    });

    function _find(key, svEvent) {
      return svEvent.locations[key];
    };

    return {
      PROXIMITY: _PROXIMITY,
      createRegion: _createRegion,
      requestAlwaysAuthorization: _requestAlwaysAuthorization,
      isBluetoothEnabled: _isBluetoothEnabled,
      toKey: toKey,
      find: _find
    }
  });
