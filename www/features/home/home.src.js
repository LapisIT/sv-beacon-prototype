/**
 * @author Parham
 * @since 5/02/2016
 */

angular.module('svBeaconPrototype')

  .controller('HomeCtrl', function ($scope, $rootScope, $log, $stateParams, $ionicModal, $ionicPopup, $cordovaBeacon,
                                    $timeout, $ionicPlatform,
                                    $window, $interval, Validations, Beacons, Monitors, Events, Signals, MyDetails) {
    $log.info('HomeCtrl...');
    var isEmpty = Validations.isEmpty,
      brNotifyEntryStateOnDisplay = true,
      monitoredRegion;

    $scope.monitoring = false;

    function _registerNgEvents() {
      $scope.$on("$cordovaBeacon:didEnterRegion", function (event, pluginResult) {
        Signals.send(pluginResult.region.uuid, pluginResult.region.major, pluginResult.region.minor, 'ENTER');
        $log.info('$cordovaBeacon:didEnterRegion', pluginResult);
        $ionicPopup.alert({
          title: 'Welcome to ' + pluginResult.region.identifier + '!',
          template: 'I will be your beacon for this session.'
        });
      });

      $scope.$on("$cordovaBeacon:didExitRegion", function (event, pluginResult) {
        Signals.send(pluginResult.region.uuid, pluginResult.region.major, pluginResult.region.minor, 'EXIT');
        $log.info('$cordovaBeacon:didExitRegion', pluginResult);
        $ionicPopup.alert({
          title: 'You are going out of ' + pluginResult.region.identifier + '!',
          template: 'See you later.'
        });
      });

      $scope.$on('$ionicView.beforeLeave', function _onIonicViewLeave(event, view) {
        $log.info('$ionicView.HomeCtrl beforeLeave', view);
        Monitors.stop(monitoredRegion);
      });
    }

    function _monitorSVEvent(event) {
      angular.forEach(event.beacons, function (beacon) {
        $log.info('HomeCtrl _startMonitoringForRegion()', beacon.locationName, event.id, beacon.major, beacon.minor);
        Beacons.createRegion(
          beacon.locationName, event.id, beacon.major, beacon.minor, brNotifyEntryStateOnDisplay
        ).then(function (createdRegion) {
          monitoredRegion = createdRegion;
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
      _loadSVEventInformation().then(function (svEvent) {
        $scope.event = svEvent;
        _init(svEvent);
      });

    })

  });

