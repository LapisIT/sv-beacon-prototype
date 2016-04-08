/**
 * @author Parham
 * @since 22/03/2016
 */
angular.module('svBeaconPrototype')

  .controller('WhereaboutCtrl',
  function ($scope, $rootScope, $ionicModal, $ionicPopup,
            $timeout, $log, $ionicPlatform, $cordovaBeacon, $q, Validations, Ranges, Beacons, Events, Whereabouts) {

    var brIdentifier = 'whereaboutRegion',
      brNotifyEntryStateOnDisplay = true,
      rangedRegion,
      svEvent,
      isDefined = Validations.isDefined;

    $scope.location = '';

    $scope.findColour = function (beacon) {
      return $scope.find(beacon).colour;
    };

    $scope.find = function (beacon) {
      var key = Beacons.toKey(beacon.uuid, beacon.major, beacon.minor);
      return Beacons.find(key, svEvent);
    };


    function _startRangingBeaconsInRegion(svEvent) {
      Beacons.requestAlwaysAuthorization();
      Beacons.createRegion(brIdentifier, svEvent.id, null, null, brNotifyEntryStateOnDisplay).then(function (createdRegion) {
        $log.info('whereaboutsCtrl _startMonitoringForRegion()', createdRegion);
        rangedRegion = createdRegion;
        Ranges.start(createdRegion);
      });
    };

    function _stopRangingBeaconsInRegion(rangedRegion) {
      Ranges.stop(rangedRegion);
    };

    $scope.$on('$ionicView.beforeLeave',
      function (event, view) {
        $log.info('$ionicView.EditReportSoundCtrl beforeLeave', view);
        _stopRangingBeaconsInRegion(rangedRegion);
      });

    var lastKnowLoncation, potentialExitCount = 0;

    Events.load().then(function (event) {
      $log.info('whereaboutsCtrl, got events information!', event);
      svEvent = event;
      $scope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function (event, pluginResult) {
        $log.info('$cordovaBeacon:didRangeBeaconsInRegion', pluginResult);

        Whereabouts.update(svEvent.locations, pluginResult.beacons).then(function (location) {
          $scope.location = lastKnowLoncation = location;
          potentialExitCount = 0;
        }, function (noLocation) {
          $log.info('No location found lastKnowLoncation: ', lastKnowLoncation, ' potentialExitCount: ', potentialExitCount);
          if(!isDefined(lastKnowLoncation)) {
            $log.info('No lastKnowLoncation, not in a location, clearing the location');
            $scope.location = undefined;
            return;
          }

          var numberOfTimesToDecide  = lastKnowLoncation.settings.whereabouts.numberOfTimesToDecide;
          if(numberOfTimesToDecide === potentialExitCount) {
            $log.info('lastKnowLoncation.settings.whereabouts.numberOfTimesToDecide matching with potentialExitCount ',
              lastKnowLoncation, ' potentialExitCount: ', potentialExitCount, ' time to exit the last know location!');
            Whereabouts.exit(lastKnowLoncation);
            lastKnowLoncation = undefined;
            potentialExitCount = 0;
            $scope.location = undefined;

            return;
          }

          potentialExitCount++;
          $log.info('Incremented potentialExitCount, leave the UI for now', potentialExitCount);
        });
      });
      _startRangingBeaconsInRegion(svEvent)
    });

  });
