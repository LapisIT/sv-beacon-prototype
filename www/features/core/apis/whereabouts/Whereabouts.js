/**
 * @author Parham
 * @since 29/03/2016
 */
angular.module('svBeaconPrototype')
  .factory('Whereabouts',
    function ($log, FindCurrentLocation) {
      return {
        find: FindCurrentLocation.find
      };

    });
