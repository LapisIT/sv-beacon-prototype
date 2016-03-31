/**
 * @author Parham
 * @since 22/03/2016
 */
angular.module('svBeaconPrototype')

  .controller('RangeCtrl', function ($scope, $rootScope, $ionicModal, $ionicPopup, $timeout, $log, $ionicPlatform, $cordovaBeacon, $q, DateUtil, MyDetails, Validations, Signals, Ranges, Beacons, Events) {

    var brIdentifier = 'estimote',
      brNotifyEntryStateOnDisplay = true,
      myDetails,
      monitoredRegion;

    $scope.ranging = false;

    $scope.rangedBeacons = [];

    $scope.startRangingBeaconsInRegion = function _startRangingBeaconsInRegion() {
      _enableBluetooth().then(function () {
        var event = $scope.event;
        Beacons.requestAlwaysAuthorization();
        Beacons.createRegion(brIdentifier, event.id, null, null, brNotifyEntryStateOnDisplay).then(function (createdRegion) {
          $log.info('HomeCtrl _startMonitoringForRegion()', createdRegion);
          monitoredRegion = createdRegion;
          Ranges.start(createdRegion);
        });
        $scope.ranging = true;
      });
    };

    $scope.stopRangingBeaconsInRegion = function () {
      $scope.rangedBeacons = [];
      Ranges.stop(monitoredRegion);
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

    var unRegisterRanging = $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function (event, pluginResult) {
      $log.info('$cordovaBeacon:didRangeBeaconsInRegion', pluginResult);
      $scope.rangedBeacons = [];
      angular.forEach(pluginResult.beacons, function (beacon) {
        $scope.rangedBeacons.push(beacon);
        var transformed = angular.copy(beacon);
        delete transformed.rssi;
        Signals.send({
          beacon: transformed,
          user: myDetails,
          receivedAt: DateUtil.now()
        });
      })
    });

    $scope.$on('$ionicView.beforeLeave',
      function (event, view) {
        $log.info('$ionicView.EditReportSoundCtrl beforeLeave', view);
        if ($scope.ranging) {
          unRegisterRanging();
          $scope.stopRangingBeaconsInRegion();
        }
      });

    MyDetails.find().then(function (found) {
      myDetails = found;
    });

    Events.load().then(function (event) {
      $log.info('HomeCtrl, got events information!', event);
      event.notifications = true;
      $scope.event = event;
    });

  });
