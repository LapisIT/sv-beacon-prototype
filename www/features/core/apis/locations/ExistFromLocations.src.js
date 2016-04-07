/**
 * @author Parham
 * @since 4/04/2016
 */

angular.module('svBeaconPrototype').factory('ExistFromLocations',
  function ($rootScope, $cordovaBeacon, $log, $q, $timeout,
            Cordovas, Beacons, MyDetails, Validations, Firebases,
            FirebaseEntities) {
    var whereabouts = function (childPath) {
        return Firebases.childRef(childPath);
    };

    function exit(filteredLocations) {
      MyDetails.find().then(function (found) {
        angular.forEach(filteredLocations, function (location, key) {
          var path = location.locationName + '/users/' + found.name.replace(/ /g, '');
          whereabouts(path).then(function (whereabouts) {
            var newRef = whereabouts.remove(function (error) {
              if (error) {
                $log.error("ExistFromLocation, remove from location failed " + location.locationName, error);
              } else {
                $log.info("ExistFromLocation, removed from location successfully.", location.locationName);
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
