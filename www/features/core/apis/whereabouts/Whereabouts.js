/**
 * @author Parham
 * @since 29/03/2016
 */
angular.module('svBeaconPrototype')
  .factory('Whereabouts',
    function ($http, $q, $log, $timeout,
              Validations, Firebases, DateUtil, MyDetails,
              Beacons, Events, Locations, SortByProximity, FindCurrentLocation) {
      var isDefined = Validations.isDefined, isEmpty = Validations.isEmpty,
        path = 'whereabouts',
        whereabouts = function (childPath) {
          return Firebases.rootRef().then(function (rootRef) {
            return rootRef.child(path + '/' + childPath);
          })
        };
      var _findCurrentLocation = FindCurrentLocation.find;
      return {
        find: _findCurrentLocation
      };

    });
