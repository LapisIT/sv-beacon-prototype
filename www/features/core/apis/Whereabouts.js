/**
 * @author Parham
 * @since 29/03/2016
 */
angular.module('svBeaconPrototype')
  .factory('Whereabouts',
    function ($http, $q, $log, $timeout,
              Validations, Firebases, DateUtil, MyDetails, Beacons, Events, Locations) {
      var isDefined = Validations.isDefined, isEmpty = Validations.isEmpty,
        path = 'whereabouts',
        whereabouts = function (childPath) {
          return Firebases.rootRef().then(function (rootRef) {
            return rootRef.child(path + '/' + childPath);
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

      function _removeUnknowns(beacons) {
        return beacons.filter(function (beacon) {
          return beacon.accuracy !== -1;
        });
      }

      function _find(beacons) {
        var closestBeacon, key;
        beacons = _removeUnknowns(beacons);

        beacons.sort(_sortByProximity);

        closestBeacon = beacons[0];
        key = Beacons.toKey(closestBeacon.uuid, closestBeacon.major, closestBeacon.minor);

        return _evaluateProximity(closestBeacon, key);

      }

      function _evaluateProximity(beacon) {
        return Events.load().then(function (event) {
          return Locations.isIn(event.locations, beacon).then(function(location){
            if(isDefined(location)){
              _enter(location);
            }
            return $q.when(location);
          })
        })
      }

      function _enter(location) {
        var whereabout = {
          receivedAt: DateUtil.now()
        };

        MyDetails.find().then(function (found) {
          var path = location.locationName + '/' + found.name.replace(/ /g, '');
          whereabout.user = found;
          whereabouts(path).then(function (whereabouts) {
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

      return {
        find: _find
      };


    });
