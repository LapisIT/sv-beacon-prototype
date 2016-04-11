/**
 * @author Parham
 * @since 4/04/2016
 */

angular.module('svBeaconPrototype').factory('UpdateLocations',
  function ($log, $q,
            Beacons, MyDetails, Validations, Firebases,
            ProximityCriteria, ExitFromLocations,
            FirebaseEntities) {
    var signals = [],
      whereabouts = function (childPath) {
        return Firebases.childRef(childPath);
      };

    function _whereaboutsSettings(locations, key) {
      return locations[key].settings.whereabouts;
    }

    function update(locations, beacon) {
      var key = Beacons.toKey(beacon.uuid, beacon.major, beacon.minor),
        whereaboutsSettings = _whereaboutsSettings(locations, key),
        proximityCriterion = whereaboutsSettings.proximity,
        numberOfTimesToDecideCriterion = whereaboutsSettings.numberOfTimesToDecide,
        proximityActual = beacon.proximity,
        acceptableProximities = ProximityCriteria.fincAcceptableProximities(proximityCriterion),
        location,
        locationsToClean = angular.copy(locations);

      return ProximityCriteria.isWithinCriteria(acceptableProximities, proximityActual).then(function () {
        signals.push(key);

        return ProximityCriteria.consistentSignals(signals, numberOfTimesToDecideCriterion).then(function () {
          location = locations[key];
          //delete locationsToClean[key];
          //ExitFromLocations.exit(locationsToClean);
          return $q.when(location);
        }, function () {
          return _clearSignals(locations);
        })

      }, function () {
        return _clearSignals(locations);
      });
    }

    function _clearSignals(locations) {
      signals = [];
      //ExitFromLocations.exit(locations);
      return $q.reject();
    }

    return {
      update: update
    }
  });
