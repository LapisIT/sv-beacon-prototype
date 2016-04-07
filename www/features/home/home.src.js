/**
 * @author Parham
 * @since 5/02/2016
 */

angular.module('svBeaconPrototype')

  .controller('HomeCtrl', function ($scope, $rootScope, $log, $stateParams, $ionicModal, $ionicPopup, $cordovaBeacon,
                                    $timeout, $ionicPlatform,
                                    $window, $interval, Validations, Beacons, Monitors, Ranges, Events, Signals, MyDetails) {
    $log.info('HomeCtrl...');
    var isEmpty = Validations.isEmpty,
      brNotifyEntryStateOnDisplay = true,
      monitoringRegionName = 'MonitoringRegion',
      monitoringRegion,
      sentNotifications = {},
      svEvent;

    $scope.monitoring = false;

    function _registerNgEvents() {
      $scope.$on("$cordovaBeacon:didEnterRegion", function (event, pluginResult) {
        Signals.send(pluginResult.region.uuid, '', '', 'ENTER');
        $log.info('$cordovaBeacon:didEnterRegion', pluginResult);
        Ranges.start(monitoringRegion);
      });

      $scope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function (event, pluginResult) {
        $log.info('$cordovaBeacon:didRangeBeaconsInRegion', pluginResult);
        angular.forEach(pluginResult.beacons, function (beacon) {
          var transformed = angular.copy(beacon);
          delete transformed.rssi;
          Signals.send(beacon.uuid, beacon.major, beacon.minor, 'RANGE', beacon.proximity, beacon.accuracy);
          var key = Beacons.toKey(beacon.uuid,beacon.major,beacon.minor),
            locationName = svEvent.locations[key].locationName,
            proximity = svEvent.locations[key].proximity;
          $log.info('$cordovaBeacon:didRangeBeaconsInRegion ProximityNear', locationName);
          if ((beacon.proximity === 'ProximityNear' || beacon.proximity === 'ProximityImmediate')
            && isEmpty(sentNotifications[key])) {
            sentNotifications[key] = true;
            $ionicPopup.alert({
              title: 'Welcome to ' + locationName + '!',
              template: proximity.near
            });
          }
          if ((beacon.proximity === 'ProximityFar')) {
            delete sentNotifications[beacon.uuid + ':' + beacon.major + ':' + beacon.minor];
          }
        })
      });

      $scope.$on("$cordovaBeacon:didExitRegion", function (event, pluginResult) {
        Signals.send(pluginResult.region.uuid, '', '', 'EXIT');
        $log.info('$cordovaBeacon:didExitRegion', pluginResult);
        Ranges.stop(monitoringRegion);
        sentNotifications = {}
      });

      $scope.$on('$ionicView.beforeLeave', function _onIonicViewLeave(event, view) {
        $log.info('$ionicView.HomeCtrl beforeLeave', view);
        Monitors.stop(monitoringRegion);
        Ranges.stop(monitoringRegion);
      });
    }

    function _monitorSVEvent(event) {
      $log.info('HomeCtrl _startMonitoringForRegion()', event.id);
      Monitors.start(monitoringRegion);
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

      Beacons.createRegion(
        monitoringRegionName, svEvent.id, null, null, brNotifyEntryStateOnDisplay
      ).then(function (createdRegion) {
        monitoringRegion = createdRegion;
        Beacons.requestAlwaysAuthorization().then(function () {
          _monitorSVEvent(svEvent);
        });
      })

    }
    function loadEventInformation() {
      _loadSVEventInformation().then(function (found) {
        $scope.svEvent = svEvent = found;
        _init(svEvent);
      });
    }
    MyDetails.find().then(function (found) {
      $log.info('MyDetails.find ', angular.toJson(found));
      if (isEmpty(found.name) || isEmpty(found.phone) || isEmpty(found.email)) {
        $ionicModal.fromTemplateUrl('features/register/register.tpl.html', {
          scope: $scope
        }).then(function (modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
        $scope.$on('modal.hidden', function() {
          // Execute action
          $log.info('modal.hidden, loading event information');
          loadEventInformation();
        });
        return;
      }
      loadEventInformation();
    })

  });

