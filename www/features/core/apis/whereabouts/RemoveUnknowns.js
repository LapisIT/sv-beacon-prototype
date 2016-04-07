/**
 * @author Parham
 * @since 29/03/2016
 */
angular.module('svBeaconPrototype')
  .factory('RemoveUnknowns',
    function ($log, Validations, Beacons) {
      var isDefined = Validations.isDefined, isEmpty = Validations.isEmpty;

      function _removeUnknowns(locations, beacons) {
        return beacons.filter(function (beacon) {
          var acceptableLocation = false;
          angular.forEach(locations, function (location, locationKey) {
            var key = Beacons.toKey(beacon.uuid, beacon.major, beacon.minor);
            if(key === locationKey) {
              acceptableLocation = true;
            }
          })
          return acceptableLocation && beacon.accuracy !== -1;
        });
      }

      return {
        remove: _removeUnknowns
      };


    });
