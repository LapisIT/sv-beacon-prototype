/**
 * @author Parham
 * @since 5/02/2016
 */

angular.module('svBeaconPrototype')

  .controller('HomeCtrl', function ($scope, $rootScope, $log, $stateParams, $ionicModal, Validations, MyDetails) {
    $log.info('HomeCtrl...');
    var isEmpty = Validations.isEmpty;

    MyDetails.find().then(function(myDetails){
      if(isEmpty(myDetails.name) || isEmpty(myDetails.phone) || isEmpty(myDetails.email)) {
        $ionicModal.fromTemplateUrl('features/register/register.tpl.html', {
          scope: $scope
        }).then(function (modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      }
    }, function(){});
  });

