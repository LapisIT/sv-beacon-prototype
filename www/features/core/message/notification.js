'use strict';

angular.module('speciesReporting.messages')
  .directive('notification', function ($log, $compile) {
    return {
      templateUrl: 'features/core/message/notification.html',
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        message: '=',
        show: '=',
        invalid: '='
      },
      link: function (scope, elem, attrs) {
        scope.showMsg = function() {
          var invalid = scope.invalid,
            show = scope.show;

          //if only message available, show it.
          if(invalid === undefined &&
             show === undefined &&
            (scope.message && scope.message.text)) {
            $log.info('scope.showMsg is true 1 scope.message: [' + scope.message.text + ']');
            return true;
          }

          //$log.info('notification: show ' + show + ' invalid:' + invalid);

          if(show && invalid) {
            //$log.info('scope.showMsg is true');
            return true;
          }

          //$log.info('scope.showMsg is false');

          return false;
        }

        scope.icon = function(type) {
          switch(type) {
            case 'success': return 'check';
            case 'info': return 'ok';
            case 'warning': return 'exclamation';
            case 'danger': return 'ion-information-circled';
          }
        };
      }
    };
  });
