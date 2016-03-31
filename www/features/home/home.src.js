/**
 * @author Parham
 * @since 5/02/2016
 */

angular.module('svBeaconPrototype')

  .controller('HomeCtrl', function ($scope, $rootScope, $log, $stateParams, $ionicModal, $ionicPopup, $cordovaBeacon,
                                    $timeout, $ionicPlatform,
                                    $window, $interval, Validations, MyDetails, Beacons, Monitors, Events, Signals) {
    $log.info('HomeCtrl...');
    var isEmpty = Validations.isEmpty,
      myDetails,
      brNotifyEntryStateOnDisplay = true,
      unRegisterDidEnterRegion,
      unRegisterDidExitRegion,
      unRegisterPeripheralManagerDidStartAdvertising,
      unRegisterPeripheralManagerDidUpdateState,
      unRegisterBeforeLeave;

    $scope.monitoring = false;
    $scope.isBluetoothEnabled = false;

    function _checkBluetoothStatus() {
      Beacons.isBluetoothEnabled().then(function (isBluetoothEnabled) {
        $log.info('isBluetoothEnabled', isBluetoothEnabled);
        $scope.isBluetoothEnabled = isBluetoothEnabled;
      });
    };

    function _registerNgEvents() {
      unRegisterDidEnterRegion = $rootScope.$on("$cordovaBeacon:didEnterRegion", function (event, pluginResult) {
        $log.info('$cordovaBeacon:didEnterRegion', pluginResult);
        var alertPopup = $ionicPopup.alert({
          title: 'Welcome to ' + pluginResult.region.identifier + '!',
          template: 'I will be your beacon for this session.'
        });
      });
      unRegisterDidExitRegion = $rootScope.$on("$cordovaBeacon:didExitRegion", function (event, pluginResult) {
        $log.info('$cordovaBeacon:didExitRegion', pluginResult);
        var alertPopup = $ionicPopup.alert({
          title: 'You are going out of ' + pluginResult.region.identifier + '!',
          template: 'See you later.'
        });
        Signals.send({
          beacon: {
            major: pluginResult.region.major,
            minor: pluginResult.region.minor,
            uuid: pluginResult.region.uuid
          },
          user: myDetails,
          receivedAt: DateUtil.now()
        });
      })
      unRegisterPeripheralManagerDidStartAdvertising = $rootScope.$on("$cordovaBeacon:peripheralManagerDidStartAdvertising", function (event, pluginResult) {
        $log.info('$cordovaBeacon:peripheralManagerDidUpdateState', pluginResult);
        $scope.isBluetoothEnabled = true;
      });
      unRegisterPeripheralManagerDidUpdateState = $rootScope.$on("$cordovaBeacon:peripheralManagerDidUpdateState", function (event, pluginResult) {
        $log.info('$cordovaBeacon:peripheralManagerDidUpdateState', pluginResult);
        $scope.isBluetoothEnabled = (pluginResult.state === 'PeripheralManagerStatePoweredOn');
      });
      unRegisterBeforeLeave = $scope.$on('$ionicView.beforeLeave', _onIonicViewLeave);
    }

    function _onIonicViewLeave(event, view) {
      $log.info('$ionicView.HomeCtrl beforeLeave', view);
      if ($scope.ranging) {
        unRegisterDidEnterRegion();
        unRegisterDidExitRegion();
        unRegisterPeripheralManagerDidUpdateState();
        unRegisterPeripheralManagerDidStartAdvertising();
        unRegisterBeforeLeave();
        $scope.stopRangingBeaconsInRegion();
      }
    }

    function _monitorSVEvent(event) {
      angular.forEach(event.beacons, function (beacon) {
        $log.info('HomeCtrl _startMonitoringForRegion()', beacon.locationName, event.id, beacon.major, beacon.minor);
        Beacons.createRegion(
          beacon.locationName, event.id, beacon.major, beacon.minor, brNotifyEntryStateOnDisplay
        ).then(function (createdRegion) {
          Monitors.start(createdRegion);
        })
      });
    }

    function _loadSVEventInformation() {
      return Events.load().then(function (event) {
        $log.info('HomeCtrl, got events information!', event);
        event.notifications = true;
        return event;
      });
    }

    function _init(svEvent) {
      $log.info('HomeCtrl _init()');

      _checkBluetoothStatus();

      _registerNgEvents();

      Beacons.requestAlwaysAuthorization().then(function () {
        _monitorSVEvent(svEvent);
      });

    }

    MyDetails.find().then(function (found) {
      if (isEmpty(found.name) || isEmpty(found.phone) || isEmpty(found.email)) {
        $ionicModal.fromTemplateUrl('features/register/register.tpl.html', {
          scope: $scope
        }).then(function (modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
        return;
      }
      myDetails = found;
      _loadSVEventInformation().then(function (svEvent) {
        $scope.event = svEvent;
        _init(svEvent);
      });

    })

  });

