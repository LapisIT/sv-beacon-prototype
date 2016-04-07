/**
 * @author Parham
 * @since 29/03/2016
 */
angular.module('svBeaconPrototype')
  .factory('Whereabouts',
    function ($log, UpdateCurrentLocation) {
      return {
        update: UpdateCurrentLocation.update
      };

    });
