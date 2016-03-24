/**
 * @author Parham
 * @since 5/02/2016
 */

angular.module('svBeaconPrototype')

    .controller('MyDetailsCtrl', function ($scope, $rootScope, $log, $stateParams, MyDetails, Validations) {
        $log.info('MyDetailsCtrl...');

        $scope.patterns = Validations.patterns;
        $scope.msgEmailPattern = Validations.msgEmail('email');
        $scope.msgEmailRequired = Validations.msgRequired('email');
        $scope.msgNameRequired = Validations.msgRequired('name');
        $scope.msgPhoneRequired = Validations.msgRequired('phone');
        $scope.msgPhonePhone = Validations.msgPhone('phone');
        $scope.showError = false;

        MyDetails.find().then(function (found) {
            $scope.myDetails = found;
        });

        $scope.save = function (myDetails, form) {
            $scope.showError = !form.$valid;

            if ($scope.showError) {
                return;
            }
            $rootScope.go('app.home');
        };

    });

