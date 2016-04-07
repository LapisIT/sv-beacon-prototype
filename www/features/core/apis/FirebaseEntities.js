/**
 * @author Parham
 * @since 29/03/2016
 */
angular.module('svBeaconPrototype')
  .factory('FirebaseEntities',
    function ($log, Validations) {
      var isDefined = Validations.isDefined, isEmpty = Validations.isEmpty;
      var pahts = function () {
        return {whereabouts:'whereabouts',
          events:'events',signals:'signals',
          users:'users', userHistories:'user-histories'};
      }

      return {
        pahts: pahts
      };


    });
