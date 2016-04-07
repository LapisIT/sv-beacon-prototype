/**
 * @author Parham
 * @since 4/04/2016
 */

angular.module('svBeaconPrototype').factory('Locations',
  function ($log, Validations,
            UpdateLocations) {
    return {
      update: UpdateLocations.update
    }
  });
