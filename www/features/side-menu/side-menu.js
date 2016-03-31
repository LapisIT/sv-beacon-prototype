/**
 * @author Parham
 * @since 15/02/2016
 */

'use strict';

angular.module('svBeaconPrototype').controller('SideMenuCtrl', function ($scope, $log, $ionicSideMenuDelegate, $window, MyDetails) {

  $scope.showLogs = function () {
    document.getElementById('logger').style.display = 'block';
    var logger = document.getElementById('logger');
    logger.innerHTML = '<button class="button button-balanced button-full button-highlight" ' +
      'onclick="hideLogs()">Hide logs </button> <button class="button button-assertive button-full"' +
      'onclick="clearLogs()">Clear logs </button> <br/> <br/>' + $window.sv.logs;
  };

  $scope.$watch(function () {
      return $ionicSideMenuDelegate.getOpenRatio();
    },
    function (ratio) {
      if (ratio == 1) {
        MyDetails.find().then(function (myDetails) {
          $scope.myDetails = myDetails;
        });
      }
    });

});
