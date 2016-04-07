/**
 * @author Parham
 * @since 29/03/2016
 */
angular.module('svBeaconPrototype')
  .factory('UserHistories',
    function ($log, Validations, FirebaseEntities) {
      var isDefined = Validations.isDefined, isEmpty = Validations.isEmpty;
      
      var enter = function () {
      }
      var exit = function () {
      }

      return {
        enter: enter,
        exit: exit
      };


    });
