/**
 * @author Parham
 * @since 4/04/2016
 */

angular.module('svBeaconPrototype').factory('Locations',
  function ($rootScope, $cordovaBeacon, $log, $q, Cordovas, Beacons) {
    var toKey = function (uuid, major, minor) {
        return uuid.toUpperCase() + ':' + major + ':' + minor;
      },
      numberOfAttempts = 5, attempts = {},
      _proximities = ['ProximityImmediate', 'ProximityNear', 'ProximityFar'];

    function _whereaboutsSettings(locations, key) {
      return locations[key].settings.whereabouts;
    }

    function _isIn(locations, beacon) {
      var key = Beacons.toKey(beacon.uuid, beacon.major, beacon.minor),
        proximityCriteria = _whereaboutsSettings(locations, key).proximity,
        proximityActual = beacon.proximity,
        proximityCriteriaIndex = _proximities.indexOf(proximityCriteria), reduced,
        location;

      reduced = _proximities.slice(0, proximityCriteriaIndex+1);
      if (reduced.indexOf(proximityActual) > 0) {
        location = locations[key];
      }
      return $q.when(location);
    }

    function _attempt(attempts, key) {
      if (isEmpty(attempts[key])) {
        attempts[key] = 1;
      } else {
        attempts[key]++;
      }
    }

    return {
      isIn: _isIn,
      whereaboutsSettings: _whereaboutsSettings
    }
  });
