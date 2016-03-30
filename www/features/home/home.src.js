/**
 * @author Parham
 * @since 5/02/2016
 */

angular.module('svBeaconPrototype')

  .controller('HomeCtrl', function ($scope, $rootScope, $log, $stateParams, $ionicModal, $cordovaBeacon, Validations, MyDetails) {
    $log.info('HomeCtrl...');
    var isEmpty = Validations.isEmpty;

    $scope.isBluetoothEnabled = false;

    MyDetails.find().then(function(myDetails){
      if(isEmpty(myDetails.name) || isEmpty(myDetails.phone) || isEmpty(myDetails.email)) {
        $ionicModal.fromTemplateUrl('features/register/register.tpl.html', {
          scope: $scope
        }).then(function (modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      }
    }, function(){})

    $scope.checkBluetooth = function() {
      $cordovaBeacon.isBluetoothEnabled().then(function (isBluetoothEnabled) {
        $log.info('isBluetoothEnabled', isBluetoothEnabled);
        $scope.isBluetoothEnabled = isBluetoothEnabled;
      });
    };

    //function _enableBluetooth() {
    //  var deferred = $q.defer();
    //  $cordovaBeacon.isBluetoothEnabled().then(function (isBluetoothEnabled) {
    //    $log.info('isBluetoothEnabled', isBluetoothEnabled);
    //    if(!isBluetoothEnabled){
    //      $ionicPopup.alert({
    //        title: 'Bluetooth is disabled',
    //        template: 'Please enable your device bluetooth, so we can find beacons.'
    //      });
    //      deferred.reject();
    //      return;
    //    }
    //    deferred.resolve();
    //  });
    //  return deferred.promise;
    //}
    //
    //MyDetails.find().then(function(found){
    //  myDetails = found;
    //});
    //
    //var unregisterMonitoring = $rootScope.$on("$cordovaBeacon:didStartMonitoringForRegion", function (event, pluginResult) {
    //  $log.info('$cordovaBeacon:didRangeBeaconsInRegion', pluginResult);
    //  $scope.rangedBeacons = [];
    //  angular.forEach(pluginResult.beacons, function (beacon) {
    //    if (beacon.accuracy >= 0) {
    //      $scope.rangedBeacons.push(beacon);
    //      var transformed = angular.copy(beacon);
    //      delete transformed.rssi;
    //      Signals.send({
    //        beacon: transformed,
    //        user: myDetails
    //      });
    //    }
    //  })
    //});
    //
    //var unregisterDidEnterRegion = $rootScope.$on("$cordovaBeacon:didEnterRegion", function (event, pluginResult) {
    //  $log.info('$cordovaBeacon:didEnterRegion', pluginResult);
    //});
    //
    //var unregisterDidExitRegion = $rootScope.$on("$cordovaBeacon:didExitRegion", function (event, pluginResult) {
    //  $log.info('$cordovaBeacon:didExitRegion', pluginResult);
    //});
    //
    //$scope.$on('$ionicView.beforeLeave',
    //  function (event, view) {
    //    $log.info('$ionicView.EditReportSoundCtrl beforeLeave', view);
    //    if ($scope.ranging) {
    //      unregisterMonitoring();
    //      unregisterDidEnterRegion();
    //      unregisterDidExitRegion();
    //      $scope.stopRangingBeaconsInRegion();
    //    }
    //  });

  });

