'use strict';

angular.module('speciesReporting')
  .directive('numberOnly', function ($log, $parse) {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {

        element.on('keydown', {scope:scope}, function(e) {
          $log.info('keydown ' + e.keyCode + ' which: ' + e.which);
          if ((e.keyCode >= 48 && e.keyCode <= 57) || //0-9 only
            (e.keyCode >= 96 && e.keyCode <= 105) || //0-9 only number pad
            (e.keyCode >= 37 && e.keyCode <= 40) || //arrows
            (e.keyCode >= 112 && e.keyCode <= 123) //functions
          ) {
            return true;
          }
          switch(e.keyCode) {
            case 110://.
            case 190://.
            case 8://Backspace
            case 46://Delete
            case 9://tab
              return true;
          }
          return false;
        })
      }
    };
});