angular.module('svBeaconPrototype.photo').directive('camera', function () {
  'use strict';

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function ($scope, element, attrs, ngModel) {
      var input;

      element.on('click', function () {
        element.append('<input type="file" accept="image/*" style="display: none;">');
        input = element.children().last();
        input.on('click', function (e) {
          e.stopImmediatePropagation();
        });
        input.on('change', function (e) {
          ngModel.$setViewValue(e);
          $scope.$apply();
          input.off();
          input.remove();
        });
        input.trigger('click');
      });

      $scope.$on('$destroy', function () {
        element.off();
        if (typeof input !== 'undefined') {
          input.off();
        }
      });
    }
  };
});
