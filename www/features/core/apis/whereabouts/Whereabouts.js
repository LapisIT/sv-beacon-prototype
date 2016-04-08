/**
 * @author Parham
 * @since 29/03/2016
 */
angular.module('svBeaconPrototype')
  .factory('Whereabouts',
    function ($log, $q, Validations, Beacons,
              SortByProximity, RemoveUnknowns, UpdateCurrentLocation, ExitFromLocations) {
      var isDefined = Validations.isDefined, isEmpty = Validations.isEmpty

      function _updateCurrentLocation(locations, beacons) {
        var closestBeacon;
        beacons = RemoveUnknowns.remove(locations, beacons);
        $log.info('_updateCurrentLocation any beacons to update? ', beacons.length);
        beacons.sort(SortByProximity.sort);
        closestBeacon = beacons[0];
        //do nothing if there is no beacon signal
        if(!isDefined(closestBeacon)) {
          return $q.reject(undefined);
        }
        return UpdateCurrentLocation.update(closestBeacon, Beacons.toKey(closestBeacon.uuid, closestBeacon.major, closestBeacon.minor));
      }

      function exit(locationToExit) {
        return ExitFromLocations.exit([locationToExit]);
      }
      return {
        update: _updateCurrentLocation,
        exit:exit
      };

    });
