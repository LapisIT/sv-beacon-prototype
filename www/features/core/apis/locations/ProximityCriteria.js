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
      }

    return {
      fincAcceptableProximities: fincAcceptableProximities,
      isWithinCriteria: isWithinCriteria
    }
  });
