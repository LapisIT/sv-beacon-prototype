/**
 * @author Parham
 * @since 4/04/2016
 */

angular.module('svBeaconPrototype').factory('ExitFromLocations',
  function ($rootScope, $cordovaBeacon, $log, $q, $timeout,
            Cordovas, Beacons, MyDetails, Validations, Firebases,
            FirebaseEntities) {
    var whereabouts = function (childPath) {
        return Firebases.childRef('whereabouts/' + childPath);
    };

    function exit(filteredLocations) {
      MyDetails.find().then(function (found) {
        angular.forEach(filteredLocations, function (location, key) {
          var path = location.locationName + '/users/' + found.name.replace(/ /g, '');
          whereabouts(path).then(function (whereabouts) {
            whereabouts.remove(function (error) {
              if (error) {
                $log.error("ExitFromLocations, remove from location failed " + location.locationName, error);
              } else {
                $log.info("ExitFromLocations, removed from location successfully.", location.locationName);
              }
            })
          });
        })
      })
    }

    return {
      exit: exit
    }
  });
