/**
 * @author Parham
 * @since 4/04/2016
 */

angular.module('svBeaconPrototype').factory('ProximityCriteria',
  function ($log, $q) {
    var proximityCriteria = ['ProximityImmediate', 'ProximityNear', 'ProximityFar'],
      findProximityCriterionIndex = function (proximityCriterion) {
        return proximityCriteria.indexOf(proximityCriterion);
      },
      fincAcceptableProximities = function (proximityCriterion) {
        return proximityCriteria.slice(0, findProximityCriterionIndex(proximityCriterion) + 1);
      },
      isWithinCriteria = function (proximityCriteria, proximityToEvaluate) {
        var deferred = $q.defer();
        if (proximityCriteria.indexOf(proximityToEvaluate) >= 0) {
          deferred.resolve(true);
        } else {
          deferred.reject(false);
        }
        return deferred.promise;
      },
      _isLastNSignalsEqual = function (signals, numberOfTimesToDecide) {
        var lastNSignals = signals.slice(-1 * numberOfTimesToDecide),
          lastValue = signals[signals.length - 1],
          isConsistent = true;
        lastNSignals.forEach(function (value) {
          if (lastValue !== value) {
            isConsistent = false;
          }
        });
        return isConsistent;
      },
      _consistentSignals = function (signals, numberOfTimesToDecide) {
      var deferred = $q.defer();
      if (_isLastNSignalsEqual(signals, numberOfTimesToDecide)) {
        deferred.resolve(true);
      } else {
        deferred.reject(false);
      }
      return deferred.promise;
    }


    return {
      fincAcceptableProximities: fincAcceptableProximities,
      isWithinCriteria: isWithinCriteria,
      consistentSignals:_consistentSignals
    }
  });
