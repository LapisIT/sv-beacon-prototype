angular.module('svBeaconPrototype')
  .factory('Events',
    function ($http, $q, $log,
              ApisValidations, Firebases, EventData) {
      var Events = {}, isDefined = ApisValidations.isDefined, isEmpty = ApisValidations.isEmpty;
      var path = 'events', deferred;
      var events = function() {
        return Firebases.rootRef().then(function (rootRef) {
          return rootRef.child(path);
        });
      }
      var create = function (event) {
        events().then(function (events) {
          var newRef = events.set(event,function(error) {
            if (error) {
              $log.info("could not be saved.", error);
            } else {
              $log.info("saved successfully.");
            }
          })
          //var key = newRef.key();
          $log.info("newRef ", newRef);
        })
      }
      create(EventData.event);

      Events.load = function () {
        deferred = isDefined(deferred)?deferred:$q.defer();
        events().then(function (events) {
          events.on("value", function(snapshot) {
            deferred.resolve(snapshot.val());
          }, function (errorObject) {
            deferred.reject(errorObject);
            console.log("The read failed: " + errorObject.code);
          });
        })

        return deferred.promise;
      }

      return Events;


    })
