/**
 * @author Parham
 * @since 29/03/2016
 */
angular.module('svBeaconPrototype')
  .factory('Signals',
    function ($http, $q, $log,
              ApisValidations, Firebases) {
      var Signals = {}, isDefined = ApisValidations.isDefined, isEmpty = ApisValidations.isEmpty;
      var path = 'signals', deferred;
      var signals = function() {
        return Firebases.rootRef().then(function (rootRef) {
          return rootRef.child(path);
        });
      };
      Signals.send = function (signal) {
        signals().then(function (signals) {
          var newRef = signals.push(signal,function(error) {
            if (error) {
              $log.info("could not be saved.", error);
            } else {
              $log.info("saved successfully.");
            }
          });
          //var key = newRef.key();
          $log.info("newRef ", newRef);
        });
      };

      //Signals.add2 = function () {
      //  deferred = isDefined(deferred)?deferred:$q.defer();
      //  signals().then(function (events) {
      //    events.on("value", function(snapshot) {
      //      deferred.resolve(snapshot.val());
      //    }, function (errorObject) {
      //      deferred.reject(errorObject);
      //      console.log("The read failed: " + errorObject.code);
      //    });
      //  });
      //
      //  return deferred.promise;
      //};

      return Signals;


    });
