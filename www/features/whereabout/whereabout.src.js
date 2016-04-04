/**
 * @author Parham
 * @since 22/03/2016
 */
angular.module('svBeaconPrototype')

  .controller('WhereaboutCtrl', function ($scope, $rootScope, $ionicModal, $ionicPopup,
                                          $timeout, $log, $ionicPlatform, $cordovaBeacon, $q, Validations, Ranges, Beacons, Events, Whereabouts) {

    var brIdentifier = 'whereaboutRegion',
      brNotifyEntryStateOnDisplay = true,
      rangedRegion,
      svEvent;

    $scope.ranging = false;
    $scope.beacon = '';

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
      $scope.ranging = true;
    };

    function _stopRangingBeaconsInRegion(rangedRegion) {
      Ranges.stop(rangedRegion);
      $scope.ranging = false;
    };

    $scope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function (event, pluginResult) {
      $log.info('$cordovaBeacon:didRangeBeaconsInRegion', pluginResult);
      Whereabouts.find(pluginResult.beacons).then(function (beacon) {
        $scope.beacon = beacon;
      });
    });

    $scope.$on('$ionicView.beforeLeave',
      function (event, view) {
        $log.info('$ionicView.EditReportSoundCtrl beforeLeave', view);
        if ($scope.ranging) {
          _stopRangingBeaconsInRegion(rangedRegion);
        }
      });

    Events.load().then(function (event) {
      $log.info('whereaboutsCtrl, got events information!', event);
      svEvent = event;
      _startRangingBeaconsInRegion(svEvent)
    });

  });