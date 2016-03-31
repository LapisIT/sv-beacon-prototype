/**
 * @author Parham
 * @since 29/03/2016
 */
angular.module('svBeaconPrototype')
  .factory('Signals',
    function ($http, $q, $log,
              Validations, Firebases, DateUtil, MyDetails) {
      var Signals = {}, isDefined = Validations.isDefined, isEmpty = Validations.isEmpty;
      var path = 'signals', deferred;
      var signals = function () {
        return Firebases.rootRef().then(function (rootRef) {
          return rootRef.child(path);
        });
      };

      Signals.send = function (uuid, major, minor, type, proximity, accuracy) {
        var signal = {
          receivedAt: DateUtil.now(),
          type: type,
          beacon: {
            uuid: uuid,
            major: major,
            minor: minor,
            proximity: proximity?proximity:'',
            accuracy: accuracy?accuracy:'',
          }
        };

        MyDetails.find().then(function (found) {
          signal.user = found;
          signals().then(function (signals) {
            var newRef = signals.push(signal, function (error) {
              if (error) {
                $log.info("could not be saved.", error);
              } else {
                $log.info("saved successfully.");
              }
            });
            $log.info("newRef ", newRef);
          });
        })
      };

      return Signals;


    });
