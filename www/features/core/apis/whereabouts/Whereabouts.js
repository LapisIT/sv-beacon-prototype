/**
 * @author Parham
 * @since 29/03/2016
 */
angular.module('svBeaconPrototype')
  .factory('Whereabouts',
    function ($log, $q, Validations, Beacons,
              SortByProximity, RemoveUnknowns, UpdateCurrentLocation) {
      var isDefined = Validations.isDefined, isEmpty = Validations.isEmpty

      function _updateCurrentLocation(beacons) {
        var closestBeacon;
        beacons = RemoveUnknowns.remove(beacons);
        beacons.sort(SortByProximity.sort);
        closestBeacon = beacons[0];
        //do nothing if there is no beacon signal
        if(!isDefined(closestBeacon)) {
          return $q.when(undefined);
        }
        return UpdateCurrentLocation.update(closestBeacon, Beacons.toKey(closestBeacon.uuid, closestBeacon.major, closestBeacon.minor));
      }

      return {
        update: _updateCurrentLocation
      };

    });
