/**
 * @author Parham
 * @since 22/03/2016
 */
angular.module('svBeaconPrototype')

  .controller('RangeCtrl', function ($scope, $rootScope, $ionicModal, $ionicPopup,
                                     $timeout, $log, $ionicPlatform, $cordovaBeacon, $q, Validations, Signals, Ranges, Beacons, Events) {

    var brIdentifier = 'estimote',
      brNotifyEntryStateOnDisplay = true,
      rangedRegion;

    $scope.ranging = false;

    $scope.rangedBeacons = [];

    $scope.findColour = function (beacon) {
      return $scope.find(beacon).colour;
    };

    $scope.find = function (beacon) {
      var key = Beacons.toKey(beacon.uuid, beacon.major, beacon.minor);
      return Beacons.find(key, $scope.event);
    }


    $scope.startRangingBeaconsInRegion = function _startRangingBeaconsInRegion() {
      var event = $scope.event;
      Beacons.requestAlwaysAuthorization();
      Beacons.createRegion(brIdentifier, event.id, null, null, brNotifyEntryStateOnDisplay).then(function (createdRegion) {
        $log.info('RangeCtrl _startMonitoringForRegion()', createdRegion);
        rangedRegion = createdRegion;
        Ranges.start(createdRegion);
      });
      $scope.ranging = true;
    };

    $scope.stopRangingBeaconsInRegion = function () {
      $scope.rangedBeacons = [];
      Ranges.stop(rangedRegion);
      $scope.ranging = false;
    };

    function _enableBluetooth() {
      var deferred = $q.defer();
      Beacons.isBluetoothEnabled().then(function (isBluetoothEnabled) {
        $log.info('isBluetoothEnabled', isBluetoothEnabled);
        if (!isBluetoothEnabled) {
          $ionicPopup.alert({
            title: 'Bluetooth is disabled',
            template: 'Please enable your device bluetooth, so we can find beacons.'
          });
          deferred.reject();
          return;
        }
        deferred.resolve();
      });
      return deferred.promise;
    }

    $scope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function (event, pluginResult) {
      $log.info('$cordovaBeacon:didRangeBeaconsInRegion', pluginResult);
      $scope.rangedBeacons = [];
      angular.forEach(pluginResult.beacons, function (beacon) {
        $scope.rangedBeacons.push(beacon);
        var transformed = angular.copy(beacon);
        delete transformed.rssi;
        Signals.send(beacon.uuid, beacon.major, beacon.minor, 'RANGE', beacon.proximity, beacon.accuracy);
      })
    });

    $scope.$on('$ionicView.beforeLeave',
      function (event, view) {
        $log.info('$ionicView.EditReportSoundCtrl beforeLeave', view);
        if ($scope.ranging) {
          $scope.stopRangingBeaconsInRegion();
        }
      });

    Events.load().then(function (event) {
      $log.info('RangeCtrl, got events information!', event);
      event.notifications = true;
      $scope.event = event;
    });

  });
