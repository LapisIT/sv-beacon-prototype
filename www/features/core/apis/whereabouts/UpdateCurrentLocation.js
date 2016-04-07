/**
 * @author Parham
 * @since 29/03/2016
 */
angular.module('svBeaconPrototype')
  .factory('UpdateCurrentLocation',
    function ($log, $q, Validations, Firebases, DateUtil, MyDetails,
              Beacons, Events, UpdateLocations, FirebaseEntities,
              EnterLocation) {
      var isDefined = Validations.isDefined, isEmpty = Validations.isEmpty;

      function _update(beacon) {
        return Events.load().then(function (event) {
          return UpdateLocations.update(event.locations, beacon)
        }).then(function(location){
          if(isDefined(location)){
            EnterLocation.enter(location);
            
          }
          return $q.when(location);
        })
      }

      return {
        update: _update
      };


    });
