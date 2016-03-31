/**
 * @author Parham
 * @since 22/03/2016
 */
angular.module('svBeaconPrototype')

  .factory('Monitors', function ($cordovaBeacon, $q, Cordovas) {

    function _start(beaconRegion){
      return Cordovas.isPluginsReady(['locationManager']).then(function(){
        return $cordovaBeacon.startMonitoringForRegion(beaconRegion);
      });
    }

    return {
      start: _start,
      stop: $cordovaBeacon.stopMonitoringForRegion
    }

  });
