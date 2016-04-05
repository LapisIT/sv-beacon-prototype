/**
 * @author Parham
 * @since 29/03/2016
 */
angular.module('svBeaconPrototype')
  .factory('FindCurrentLocation',
    function ($http, $q, $log,
              Validations,
              Beacons,
              SortByProximity, RemoveUnknowns, EvaluateProximity) {
      var isDefined = Validations.isDefined, isEmpty = Validations.isEmpty;
      var _sortByProximity = SortByProximity.sort;
      var _removeUnknowns = RemoveUnknowns.remove;
      var _evaluateProximity = EvaluateProximity.evaluate;

      function _findCurrentLocation(beacons) {
        var closestBeacon, key;
        beacons = _removeUnknowns(beacons);

        beacons.sort(_sortByProximity);

        closestBeacon = beacons[0];
        key = Beacons.toKey(closestBeacon.uuid, closestBeacon.major, closestBeacon.minor);

        return _evaluateProximity(closestBeacon, key);
      }

      return {
        find: _findCurrentLocation
      };


    });
