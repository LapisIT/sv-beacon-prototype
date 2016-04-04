angular.module('svBeaconPrototype')
  .factory('Events',
    function ($http, $q, $log,
              Validations, Firebases) {
      var Events = {}, isDefined = Validations.isDefined;
      var path = 'events', deferred;
      var events = function() {
        return Firebases.rootRef().then(function (rootRef) {
          return rootRef.child(path);
        });
      }

      Events.load = function () {
        deferred = isDefined(deferred)?deferred:$q.defer();
        events().then(function (events) {
          events.on("value", function(snapshot) {
            deferred.resolve(snapshot.val());
          }, function (errorObject) {
            deferred.reject(errorObject);
            console.log("The read failed: " + errorObject.code);
          });
        });

        return deferred.promise;
      };

      return Events;


    })
