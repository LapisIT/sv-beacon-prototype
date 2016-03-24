/**
 * @author Parham
 * @since 22/03/2016
 */
angular.module('svBeaconPrototype')

  .controller('NotificationCtrl', function ($scope, $rootScope, $ionicModal, $ionicPopup, $timeout, $log, $ionicPlatform, $cordovaBeacon, $q) {

    var brIdentifier = 'estimote',
      brUuid = 'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
      brMajor = null,
      brMinor = null,
      brNotifyEntryStateOnDisplay = true;

    // Form data for the login modal
    $scope.loginData = {};

    $scope.rangedBeacons = [];
    $scope.names = {
      "57541": {name: "blueberry", color: '#54428C'},
      "36362": {name: "mint", color: '#B8D4B5'},
      "16440": {name: "ice", color: '#85C2E5'},
      "61912": {name: "blueberry", color: '#54428C'},
      "28019": {name: "mint", color: '#B8D4B5'},
      "51144": {name: "ice", color: '#85C2E5'}
    };

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('features/register/register.tpl.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };

    $scope.startMonitoringForRegion = function _startMonitoringForRegion() {
      $cordovaBeacon.startMonitoringForRegion($cordovaBeacon.createBeaconRegion(
        brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay
      ));
    };

    $scope.requestAlwaysAuthorization = function () {
      $cordovaBeacon.requestAlwaysAuthorization();
    };

    $scope.startRangingBeaconsInRegion = function _startRangingBeaconsInRegion() {
      _enableBluetooth().then(function(){
        $cordovaBeacon.requestAlwaysAuthorization();
        $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion(
          brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay
        ));
      });
    };

    $scope.stopMonitoringForRegion = function () {
      $cordovaBeacon.stopMonitoringForRegion($cordovaBeacon.createBeaconRegion(
        brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay
      ));
    };
    $scope.stopRangingBeaconsInRegion = function () {
      $scope.rangedBeacons = [];
      $cordovaBeacon.stopRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion(
        brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay
      ));
    };


    function _enableBluetooth() {
      var deferred = $q.defer();
      $cordovaBeacon.isBluetoothEnabled().then(function (isBluetoothEnabled) {
        $log.info('isBluetoothEnabled', isBluetoothEnabled);
        if(!isBluetoothEnabled){
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

    //$rootScope.$on("$cordovaBeacon:didStartMonitoringForRegion", function (event, pluginResult) {
    //  $log.info('$cordovaBeacon:didStartMonitoringForRegion', pluginResult);
    //});
    //
    //$rootScope.$on("$cordovaBeacon:didDetermineStateForRegion", function (event, pluginResult) {
    //  $log.info('$cordovaBeacon:didDetermineStateForRegion', pluginResult);
    //});

    $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function (event, pluginResult) {
      $log.info('$cordovaBeacon:didRangeBeaconsInRegion', pluginResult);
      $scope.rangedBeacons = [];
      angular.forEach(pluginResult.beacons, function (beacon) {
        if (beacon.accuracy >= 0) {
          $scope.rangedBeacons.push(beacon)
        }
      })
    });

    $rootScope.$on("$cordovaBeacon:didEnterRegion", function (event, pluginResult) {
      $log.info('$cordovaBeacon:didEnterRegion', pluginResult);
    });

    $rootScope.$on("$cordovaBeacon:didExitRegion", function (event, pluginResult) {
      $log.info('$cordovaBeacon:didExitRegion', pluginResult);
    });

    //$rootScope.$on("$cordovaBeacon:peripheralManagerDidStartAdvertising", function (event, pluginResult) {
    //  $log.info('$cordovaBeacon:peripheralManagerDidStartAdvertising', pluginResult);
    //});
    //
    //$rootScope.$on("$cordovaBeacon:peripheralManagerDidUpdateState", function (event, pluginResult) {
    //  $log.info('$cordovaBeacon:peripheralManagerDidUpdateState', pluginResult);
    //});
    //
    //$rootScope.$on("$cordovaBeacon:didChangeAuthorizationStatus", function (event, pluginResult) {
    //  $log.info('$cordovaBeacon:didChangeAuthorizationStatus', pluginResult);
    //});

  });
