/**
 * @author Parham
 * @since 30/03/2016
 */
angular.module('svBeaconPrototype')

  .factory('Ranges', function ($cordovaBeacon) {

    return {
      start: $cordovaBeacon.startRangingBeaconsInRegion,
      stop: $cordovaBeacon.stopRangingBeaconsInRegion
    }

  });
