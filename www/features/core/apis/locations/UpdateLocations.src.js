/**
 * @author Parham
 * @since 4/04/2016
 */

angular.module('svBeaconPrototype').factory('UpdateLocations',
  function ($log, $q,
            Beacons, MyDetails, Validations, Firebases,
            ProximityCriteria,
            FirebaseEntities) {
    var signals = [],
      // proximityCriteria = ['ProximityImmediate', 'ProximityNear', 'ProximityFar'],
      // findProximityCriterionIndex = function(proximityCriterion) {
      //   return proximityCriteria.indexOf(proximityCriterion);
      // },
      // fincAcceptableProximities = function (proximityCriterion) {
      //   return proximityCriteria.slice(0, findProximityCriterionIndex(proximityCriterion) + 1);
      // },
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

        return _isConsistentSignal(numberOfTimesToDecideCriterion).then(function () {
          location = locations[key];
          delete locationsToClean[key];
          _clearFromLocations(locationsToClean);
          return $q.when(location);
        }, function () {
          return _clearSignals(locations);
        })

      }, function () {
        return _clearSignals(locations);
      });
    }

    function _clearFromLocations(filteredLocations) {
      MyDetails.find().then(function (found) {
        angular.forEach(filteredLocations, function (location, key) {
          var path = location.locationName + '/users/' + found.name.replace(/ /g, '');
          whereabouts(path).then(function (whereabouts) {
            var newRef = whereabouts.remove(function (error) {
              if (error) {
                $log.error("FindLocation, remove from location failed " + location.locationName, error);
              } else {
                $log.info("FindLocation, removed from location successfully.", location.locationName);
              }
            })
          });
        })
      })
    }

    function _clearSignals(locations) {
      signals = [];
      _clearFromLocations(locations);
      return $q.reject();
    }

    function _isLastNSignalsEqual(numberOfTimesToDecide) {
      var lastNSignals = signals.slice(-1 * numberOfTimesToDecide),
        lastValue = signals[signals.length - 1],
        isConsistent = true;
      lastNSignals.forEach(function (value) {
        if (lastValue !== value) {
          isConsistent = false;
        }
      });
      return isConsistent;
    }

    // function _isCloseEnough(proximities, proximityActual) {
    //   var deferred = $q.defer();
    //   if (proximities.indexOf(proximityActual) >= 0) {
    //     deferred.resolve(true);
    //   } else {
    //     deferred.reject(false);
    //   }
    //   return deferred.promise;
    // }

    function _isConsistentSignal(numberOfTimesToDecide) {
      var deferred = $q.defer();
      if (_isLastNSignalsEqual(numberOfTimesToDecide)) {
        deferred.resolve(true);
      } else {
        deferred.reject(false);
      }
      return deferred.promise;
    }

    return {
      update: update
    }
  });
