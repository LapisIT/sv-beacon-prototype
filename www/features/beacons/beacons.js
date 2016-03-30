/**
 * @author Parham
 * @since 22/03/2016
 */

angular.module('svBeaconPrototype').factory('Beacons',
  function ($cordovaBeacon) {
    function _createRegion() {

    }

    return {
      createRegion: _createRegion
    }
  });
