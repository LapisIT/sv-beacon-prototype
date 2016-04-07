/**
 * @author Parham
 * @since 4/04/2016
 */

angular.module('svBeaconPrototype').factory('Locations',
  function ($log, Validations,
            UpdateLocations) {
    function _whereaboutsSettings(locations, key) {
      return locations[key].settings.whereabouts;
    }
    return {
      update: UpdateLocations.update,
      whereaboutsSettings: _whereaboutsSettings
    }
  });
