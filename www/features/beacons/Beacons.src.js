/**
 * @author Parham
 * @since 22/03/2016
 */

angular.module('svBeaconPrototype').factory('Beacons',
  function ($cordovaBeacon) {

    return {
      createRegion: $cordovaBeacon.createBeaconRegion,
      requestAlwaysAuthorization: $cordovaBeacon.requestAlwaysAuthorization,
      isBluetoothEnabled: $cordovaBeacon.isBluetoothEnabled
    }
  });
