/**
 * @author Parham
 * @since 22/03/2016
 */
angular.module('svBeaconPrototype')

  .factory('Monitors', function ($cordovaBeacon) {

    return {
      start: $cordovaBeacon.startMonitoringForRegion,
      stop: $cordovaBeacon.stopMonitoringForRegion
    }

  });
