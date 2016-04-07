/**
 * @author Parham
 * @since 29/03/2016
 */
angular.module('svBeaconPrototype')
  .factory('EvaluateProximity',
    function ($log, $q, Validations, Firebases, DateUtil, MyDetails,
              Beacons, Events, Locations) {
      var isDefined = Validations.isDefined, isEmpty = Validations.isEmpty,
        path = 'whereabouts',
        whereabouts = function (childPath) {
          return Firebases.rootRef().then(function (rootRef) {
            return rootRef.child(path + '/' + childPath);
          })
        };

      function _evaluateProximity(beacon) {
        return Events.load().then(function (event) {
          return Locations.update(event.locations, beacon).then(function(location){
            if(isDefined(location)){
              _enter(location);
            }
            return $q.when(location);
          })
        })
      }

      function _enter(location) {
        var whereabout = {
          receivedAt: DateUtil.now()
        };

        MyDetails.find().then(function (found) {
          var path = location.locationName + '/users/' + found.name.replace(/ /g, '');
          whereabout.user = found;
          whereabouts(path).then(function (whereabouts) {
            var newRef = whereabouts.set(whereabout, function (error) {
              if (error) {
                $log.info("could not be saved.", error);
              } else {
                $log.info("saved successfully.");
              }
            });
            $log.info("newRef ", newRef);
          }, function (err) {

          });
        })

      }

      return {
        evaluate: _evaluateProximity
      };


    });
