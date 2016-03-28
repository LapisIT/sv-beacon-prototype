'use strict';

angular.module('svBeaconPrototype.messages', [])
  .factory('Messages', function () {
    var Messages = {};
    Messages.initMessages = function(props) {
      var msgs = {};
      if(angular.isString(props)) {
        msgs[props] = {};
        return msgs;
      }
      if(angular.isArray(props)) {
        props.forEach(function(p) {
          msgs[p] = {};
        });
        return msgs;
      }
      return msgs;
    };

    Messages.isError = function(msg) {
      return msg && msg.type === 'danger'
    }

    Messages.createErrorForSubmitSummary = function() {
      return Messages.createError('You have error(s) in your entry, please verify and re-try.');
    };

    Messages.createError = function(text) {
      return {text:text,type:'danger'};
    };

    Messages.createInfo = function(text) {
      return {text:text,type:'info'};
    };

    Messages.createSuccess = function(text) {
      return {text:text,type:'success'};
    };

    Messages.isEmptyMessages = function(msgs) {
      var empty = true;
      _.each(msgs, function(msg) {
        var data = msg.text;
        if(typeof(data) !== 'undefined' && data !== null &&
           data.length !== 0) {
          empty = false;
        }
      });
      return empty;
    };

    return Messages;
  });
