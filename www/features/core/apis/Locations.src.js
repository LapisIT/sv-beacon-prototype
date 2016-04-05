/**
 * @author Parham
 * @since 4/04/2016
 */

angular.module('svBeaconPrototype').factory('Locations',
  function ($rootScope, $cordovaBeacon, $log, $q, $timeout, Cordovas, Beacons, MyDetails, Validations, Firebases) {
    var toKey = function (uuid, major, minor) {
        return uuid.toUpperCase() + ':' + major + ':' + minor;
      }, signals = [],
      _proximities = ['ProximityImmediate', 'ProximityNear', 'ProximityFar'],
      path = 'whereabouts',
      whereabouts = function (childPath) {
        return Firebases.rootRef().then(function (rootRef) {
          return rootRef.child(path + '/' + childPath);
        })
      };

    function _whereaboutsSettings(locations, key) {
      return locations[key].settings.whereabouts;
    }

    function _isIn(locations, beacon) {
      var key = Beacons.toKey(beacon.uuid, beacon.major, beacon.minor),
        whereaboutsSettings = _whereaboutsSettings(locations, key),
        proximityCriteria = whereaboutsSettings.proximity,
        numberOfTimesToDecideCriteria = whereaboutsSettings.numberOfTimesToDecide,
        proximityActual = beacon.proximity,
        proximityCriteriaIndex = _proximities.indexOf(proximityCriteria),
        reducedProximities,
        location,
        locationsToClean = angular.copy(locations);

      reducedProximities = _proximities.slice(0, proximityCriteriaIndex + 1);

      return _isCloseEnough(reducedProximities, proximityActual).then(function () {

        signals.push(key);

        return _isConsistentSignal(numberOfTimesToDecideCriteria).then(function () {
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
          var path = location.locationName + '/' + found.name.replace(/ /g, '');
          whereabouts(path).then(function (whereabouts) {
            var newRef = whereabouts.remove(function (error) {
              if (error) {
                $log.error("Locations, remove from location failed " + location.locationName, error);
              } else {
                $log.info("Locations, removed from location successfully.", location.locationName);
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

    function _isCloseEnough(proximities, proximityActual) {
      var deferred = $q.defer();
      if (proximities.indexOf(proximityActual) >= 0) {
        deferred.resolve(true);
      } else {
        deferred.reject(false);
      }
      return deferred.promise;
    }

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
      isIn: _isIn,
      whereaboutsSettings: _whereaboutsSettings
    }
  });
