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

    $scope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function (event, pluginResult) {
      $log.info('$cordovaBeacon:didRangeBeaconsInRegion', pluginResult);
      Whereabouts.update(pluginResult.beacons).then(function (location) {
        $scope.location = location;
      }, function (location) {
        $scope.location = '';
      });
    });

    $scope.$on('$ionicView.beforeLeave',
      function (event, view) {
        $log.info('$ionicView.EditReportSoundCtrl beforeLeave', view);
        _stopRangingBeaconsInRegion(rangedRegion);
      });

    Events.load().then(function (event) {
      $log.info('whereaboutsCtrl, got events information!', event);
      svEvent = event;
      _startRangingBeaconsInRegion(svEvent)
    });

  });
