'use strict';
/**
 * validations class
 * @module validations
 */
angular.module('svBeaconPrototype')
  .factory('ApisValidations',
    function ($log) {

      var validations = {};

      validations.patterns = {
        required: function (value) {
          return !!value;
        },
        url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
        email: /^([\w-\.\']+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
        integer: /^\d+$/,
        decimal1:/^\d+(\.\d{1})?$/,
        //size can be empty or 0 ~ 99.9 must be 1 decimal.
        size:/^((?=.*[1-9])\d{1,2}\.\d)?$/,
        decimal2:/^\d+(\.\d{2})?$/,
        number: /^\d+$/,
        phone: /^([0-9]{10})?$/,

        //password must be at least 8 chararcter and it must contain at least one letter and one number, it can have special char, and letters can be lower or upper case
        password: /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])((?=.*[a-z])|(?=.*[A-Z])).*$/
      };

      function ValidationException(message) {
        this.message = message;
        this.name = "ValidationException";
      }
      ValidationException.prototype = new Error();
      validations.ValidationException = ValidationException;

      /**
       * Checks if the value is a positive number or zero
       * @method isPositiveNumberOrZero
       * @param {!number} value
       * @returns {!boolean}
       */
      validations.isPositiveNumberOrZero = function(value) {
        return (typeof value !== 'string') &&
          !isNaN(parseFloat(value)) && isFinite(value) && parseFloat(value) >= 0;
      };

      /**
       * Checks if the value is a positive number
       * @method isPositiveNumber
       * @param {!number} value
       * @returns {!boolean}
       */
      validations.isPositiveNumber = function(value) {
        return validations.isPositiveNumberOrZero(value) && parseFloat(value) > 0;
      };

      /**
       * Checks if the value is alphabetic
       * @method isAlphabet
       * @param {!number} value
       * @returns {!boolean}
       */
      validations.isAlphabet =  function(value){
        var regex = /^[A-Za-z]+$/ig;
        return regex.test(value);
      };

      /**
       * Checks if the value is alphanumeric
       * @method isAlphanumeric
       * @param {!number} value
       * @returns {!boolean}
       */
      validations.isAlphanumeric =  function(value){
        var regex = /^[a-zA-Z0-9]*[a-zA-Z]+[a-zA-Z0-9 _]*$/ig;
        return regex.test(value);
      };

      /**
       * Whether value is empty, numbers and boolean are always valid, returns false for undefined and null
       * @method isEmpty
       * @param {!object} data
       * @returns {!boolean}
       */

      var isEmpty = function (data) {
        if (typeof(data) == 'number' || typeof(data) == 'boolean') {
          return false;
        }
        if (typeof(data) == 'undefined' || data === null) {
          return true;
        }
        if (typeof(data.length) != 'undefined') {
          return data.length == 0;
        }
        return false;
      };

      validations.isEmpty = isEmpty;

      /**
       * Determines if a reference is defined
       * @method isDefined
       * @param {!object} data
       * @returns {!boolean}
       */
      validations.isDefined =  angular.isDefined;
      validations.isFunction =  angular.isFunction;
      /**
       * Determines if a reference is an Array.
       * @method isArray
       * @param {!object} value
       * @returns {!boolean}
       */
      validations.isArray =  angular.isArray;

      /**
       * Determines if a reference is an Object. Unlike typeof in JavaScript, nulls are not considered to be objects. Note that JavaScript arrays are objects.
       * @method isObject
       * @param {!object} data
       * @returns {!boolean}
       */
      validations.isObject =  angular.isObject;

      /**
       * Determines if a reference is a String.
       * @method isString
       * @param {!object} value
       * @returns {!boolean}
       */
      validations.isString =  angular.isString;

      /**
       * Determines if two objects or two values are equivalent. Supports value types, regular expressions, arrays and objects
       * @method equals
       * @param {!object} o1
       * @param {!object} o2
       * @returns {!boolean}
       */
      validations.equals = angular.equals;

      validations.isDate = angular.isDate;

      validations.isNumber= function(val) {
        return angular.isNumber(val) && isFinite(val);
      };

      validations.isPositiveNumber= function(val) {
        return validations.isNumber(val) && val >= 0;
      };

      validations.isNotEmpty = function (val) {
        return !isEmpty(val);
      };

      validations.requires = function(val, label) {
        if(validations.isEmpty(val)) {
          throw new ValidationException('To invoke the function, you must provide a value for "' + label + '".');
          //throw 'To invoke the function, you must provide a value for "' + label + '".';
        }
        return validations;
      }

      validations.ensures = function(val, label) {
        if(val !== true) {
          throw new ValidationException('To invoke the function, you must ensure the evaluation of "' + label + '" must be true.');
        }

        return validations;
      }

      return validations;

    }
  );
