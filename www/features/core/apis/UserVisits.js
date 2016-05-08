/**
 * @author Parham
 * @since 6/05/2016
 */

/**
 * @author Parham
 * @since 29/03/2016
 */
angular.module('svBeaconPrototype')
  .factory('UserVisits',
    function ($http, $q, $log,
              Validations, Firebases, DateUtil, MyDetails,
              $firebaseArray) {
      var UserVisits = {}, isDefined = Validations.isDefined, isEmpty = Validations.isEmpty;
      var path = 'user-visits', deferred;
      var userVisits = function (childPath) {
        return Firebases.childRef(path + (isEmpty(childPath)?'':'/' + childPath));
      };

      UserVisits.set = function (locationName) {
        var userVisit = {
          name: locationName,
          visited: DateUtil.now()
        };

        MyDetails.find().then(function (found) {
          userVisits(found.name+'/'+locationName).then(function (signals) {
            var newRef = signals.set(userVisit, function (error) {
              if (error) {
                $log.info("could not be saved.", error);
              } else {
                $log.info("saved successfully.");
              }
            });
            $log.info("newRef ", newRef);
          }, function(err) {

          });
        })



      };

      return UserVisits;


    });

