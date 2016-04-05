/**
 * @author Parham
 * @since 29/03/2016
 */
angular.module('svBeaconPrototype')
  .factory('SortByProximity',
    function ($log, Validations) {
      function _sort(a, b) {

        if (a.accuracy < b.accuracy) {
          return -1;
        }
        if (a.accuracy > b.accuracy) {
          return 1;
        }

        return 0;
      }

      return {
        sort: _sort
      };


    });
