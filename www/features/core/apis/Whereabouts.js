/**
 * @author Parham
 * @since 29/03/2016
 */
angular.module('svBeaconPrototype')
  .factory('Whereabouts',
    function ($http, $q, $log, $timeout,
              Validations, Firebases, DateUtil, MyDetails, Beacons, Events) {
      var isDefined = Validations.isDefined, isEmpty = Validations.isEmpty, numberOfAttempts = 5, attempts = {},
        timeout = 1000 * numberOfAttempts,
        path = 'whereabouts',
        whereabouts = function () {
          return Firebases.rootRef().then(function (rootRef) {
            return rootRef.child(path);
          })
        };

      function _sortByProximity(a, b) {

        if (a.accuracy < b.accuracy) {
          return -1;
        }
        if (a.accuracy > b.accuracy) {
          return 1;
        }

        return 0;
      }

      function _filterUnknowns(beacons) {
        return beacons.filter(function (beacon) {
          return beacon.accuracy !== -1;
        });
      }

      function _find(beacons) {
        var deferred = $q.defer(), closestBeacon,
          key;
        beacons = _filterUnknowns(beacons);

        if(beacons.length === 0){
          deferred.reject();
        }

        beacons.sort(_sortByProximity);
        closestBeacon = beacons[0];
        key = Beacons.toKey(closestBeacon.uuid, closestBeacon.major, closestBeacon.minor);

        _evaluateProximity(closestBeacon, key);

        if (attempts[key] >= numberOfAttempts) {
          _enter(closestBeacon.uuid, closestBeacon.major, closestBeacon.minor, closestBeacon.proximity, closestBeacon.accuracy);
          deferred.resolve(closestBeacon);
        } else {
          $timeout(function () {
            _exit(closestBeacon.uuid, closestBeacon.major, closestBeacon.minor, closestBeacon.proximity, closestBeacon.accuracy);
            deferred.reject(closestBeacon);
          }, timeout);
        }
        return deferred.promise;
      }

      function _attempt(attempts, key) {
        if (isEmpty(attempts[key])) {
          attempts[key] = 1;
        } else {
          attempts[key]++;
        }
      }

      function _evaluateProximity(beacon, key) {
        Events.load().then(function (locations) {
          if (locations[key].settings.whereabouts.proximity === beacon.proximity) {
            _attempt(attempts, key);
          }
        })
      }

      function _send(uuid, major, minor, type, proximity, accuracy) {
        var whereabout = {
          receivedAt: DateUtil.now(),
          type: type,
          beacon: {
            uuid: uuid,
            major: major,
            minor: minor,
            proximity: isEmpty(proximity) ? '' : proximity,
            accuracy: isEmpty(accuracy) ? '' : accuracy
          }
        };

        MyDetails.find().then(function (found) {
          whereabout.user = found;
          whereabouts().then(function (whereabouts) {
            var newRef = whereabouts.set(whereabout, function (error) {
              if (error) {
                $log.info("could not be saved.", error);
              } else {
                $log.info("saved successfully.");
              }
            });
            $log.info("newRef ", newRef);
          }, function (err) {

          });
        })

      }

      function _enter(uuid, major, minor, proximity, accuracy) {
        return _send(uuid, major, minor, 'ENTER', proximity, accuracy)
      }

      function _exit(uuid, major, minor, proximity, accuracy) {
        return _send(uuid, major, minor, 'EXIT', proximity, accuracy)
      }

      return {
        find: _find
      };


    });
