/**
 * @author Parham
 * @since 29/03/2016
 */
angular.module('svBeaconPrototype')
  .factory('RemoveUnknowns',
    function ($log, Validations) {
      var isDefined = Validations.isDefined, isEmpty = Validations.isEmpty;

      function _removeUnknowns(beacons) {
        return beacons.filter(function (beacon) {
          return beacon.accuracy !== -1;
        });
      }

      return {
        remove: _removeUnknowns
      };


    });
