/**
 * @author Parham
 * @since 22/03/2016
 */

angular.module('svBeaconPrototype').factory('Beacons',
  function ($cordovaBeacon, Cordovas) {

    function _createRegion(identifier, uuid, major, minor, notifyEntryStateOnDisplay){
      return Cordovas.isPluginsReady(['locationManager']).then(function(){
        return $cordovaBeacon.createBeaconRegion(identifier, uuid, major, minor, notifyEntryStateOnDisplay);
      });
    }

    function _isBluetoothEnabled(){
      return Cordovas.isPluginsReady(['locationManager']).then(function(){
        return $cordovaBeacon.isBluetoothEnabled();
      });
    }

    function _requestAlwaysAuthorization(){
      return Cordovas.isPluginsReady(['locationManager']).then(function(){
        return $cordovaBeacon.requestAlwaysAuthorization();
      });
    }

    return {
      createRegion: _createRegion,
      requestAlwaysAuthorization: _requestAlwaysAuthorization,
      isBluetoothEnabled: _isBluetoothEnabled
    }
  });
