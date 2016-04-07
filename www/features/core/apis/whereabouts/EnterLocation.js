/**
 * @author Parham
 * @since 29/03/2016
 */
angular.module('svBeaconPrototype')
  .factory('EnterLocation',
    function ($log, $q, Validations, Firebases, DateUtil, MyDetails,
              FirebaseEntities) {
      var isDefined = Validations.isDefined, isEmpty = Validations.isEmpty,
      whereabouts = function (childPath) {
        return Firebases.rootRef().then(function (rootRef) {
          return rootRef.child(FirebaseEntities.pahts().whereabouts + '/' + childPath);
        })
      };

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
        enter: _enter
      };


    });
