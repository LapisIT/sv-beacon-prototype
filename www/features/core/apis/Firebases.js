angular.module('svBeaconPrototype')
  .factory('Firebases',
    function ($http, $q, $log,
              Validations) {
      var Firebases = {}, isDefined = Validations.isDefined, isEmpty = Validations.isEmpty;
      var deferred;
      Firebases.rootRef = function () {
        deferred = isDefined(deferred)?deferred:$q.defer();
        deferred.resolve(new Firebase('https://glowing-inferno-5531.firebaseio.com/'));
        return deferred.promise;
      };
      
      Firebases.childRef = function(path) {
        return Firebases.rootRef().then(function (rootRef) {
          return rootRef.child(path);
        });
      }

      return Firebases;


    })
