/**
 * @author Parham
 * @since 22/03/2016
 */
angular.module('svBeaconPrototype')

  .controller('RangeCtrl', function ($scope, $rootScope, $ionicModal, $ionicPopup, $timeout, $log, $ionicPlatform, $cordovaBeacon, $q, MyDetails, Validations, Signals) {

    var brIdentifier = 'estimote',
      brUuid = 'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
      brMajor = null,
      brMinor = null,
      brNotifyEntryStateOnDisplay = true,
      myDetails,
      isEmpty = Validations.isEmpty;

    // Form data for the login modal
    $scope.loginData = {};
    $scope.ranging = false;

    $scope.rangedBeacons = [];
    $scope.names = {
      "57541": {name: "blueberry", color: '#54428C'},
      "36362": {name: "mint", color: '#B8D4B5'},
      "16440": {name: "ice", color: '#85C2E5'},
      "61912": {name: "blueberry", color: '#54428C'},
      "28019": {name: "mint", color: '#B8D4B5'},
      "51144": {name: "ice", color: '#85C2E5'}
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
        $scope.ranging = true;
      });
    };

    $scope.stopRangingBeaconsInRegion = function () {
      $scope.rangedBeacons = [];
      $cordovaBeacon.stopRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion(
        brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay
      ));
      $scope.ranging = false;
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

    MyDetails.find().then(function(found){
      myDetails = found;
    });

    var unregisterRanging = $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function (event, pluginResult) {
      $log.info('$cordovaBeacon:didRangeBeaconsInRegion', pluginResult);
      $scope.rangedBeacons = [];
      angular.forEach(pluginResult.beacons, function (beacon) {
        if (beacon.accuracy >= 0) {
          $scope.rangedBeacons.push(beacon);
          var transformed = angular.copy(beacon);
          delete transformed.rssi;
          Signals.send({
            beacon: transformed,
            user: myDetails
          });
        }
      })
    });

    var unregisterDidEnterRegion = $rootScope.$on("$cordovaBeacon:didEnterRegion", function (event, pluginResult) {
      $log.info('$cordovaBeacon:didEnterRegion', pluginResult);
    });

    var unregisterDidExitRegion = $rootScope.$on("$cordovaBeacon:didExitRegion", function (event, pluginResult) {
      $log.info('$cordovaBeacon:didExitRegion', pluginResult);
    });

    $scope.$on('$ionicView.beforeLeave',
      function (event, view) {
        $log.info('$ionicView.EditReportSoundCtrl beforeLeave', view);
        if ($scope.ranging) {
          unregisterRanging();
          unregisterDidEnterRegion();
          unregisterDidExitRegion();
          $scope.stopRangingBeaconsInRegion();
        }
      });

  });
