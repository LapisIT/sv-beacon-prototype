/**
 * @author Parham
 * @since 30/03/2016
 */
/**
 * @author Parham
 * @since 22/03/2016
 */
angular.module('svBeaconPrototype')

  .factory('Monitor', function ($scope, $rootScope, $ionicModal, $ionicPopup, $timeout, $log, $ionicPlatform, $cordovaBeacon, $q, MyDetails, Validations, Signals) {

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

    function _startMonitoringForRegion() {
      _enableBluetooth().then(function(){
        $cordovaBeacon.requestAlwaysAuthorization();
        $cordovaBeacon.startMonitoringForRegion($cordovaBeacon.createBeaconRegion(
          brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay
        ));
        $scope.monitoring = true;
      });
    };

    function _stopMonitoringForRegion() {
      $scope.rangedBeacons = [];
      $cordovaBeacon.stopMonitoringForRegion($cordovaBeacon.createBeaconRegion(
        brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay
      ));
      $scope.ranging = false;
    };

    return {
      start: _startMonitoringForRegion,
      stop: _stopMonitoringForRegion
    }

  });
