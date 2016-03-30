'use strict';

describe('Service: Validations', function () {

  // load the service's module
  beforeEach(module('svBeaconApis'));

  // instantiate service
  var Validations;
  beforeEach(inject(function (_Validations_) {
    Validations = _Validations_;
  }));

  function createRequiresMsg(val) {
    return 'To invoke the function, you must provide a value for "' + val + '".';
  }
  function createEnsuresMsg(val) {
    return 'To invoke the function, you must ensure the evaluation of "' + val + '" must be true.';
  }

  it('requires should throw exception if the argument is undefined', function () {
    var label = 'a value';
    expect(function() {Validations.requires(undefined, label)})
      .toThrow(new Validations.ValidationException(createRequiresMsg(label)));
  });

  it('requires should throw exception if the argument is an empty array', function () {
    var label = 'empty array';
    expect(function() {Validations.requires([], label)})
      .toThrow(new Validations.ValidationException(createRequiresMsg(label)));
  });

  it('requires should throw exception if the argument is an empty str', function () {
    var label = 'empty str';
    expect(function() {Validations.requires('', label)})
      .toThrow(new Validations.ValidationException(createRequiresMsg(label)));
  });

  it('requires should NOT throw exception if an argument is 0', function () {
    var label = 'a value';
    expect(Validations.requires(0, label)).toBe(Validations);
  });

  it('ensures should throw exception if the argument is false', function () {
    var label = 'false value';
    expect(function() {Validations.ensures(false, label)})
      .toThrow(new Validations.ValidationException(createEnsuresMsg(label)));
  });


  it('isEmpty should return true for an empty string', function () {
    expect(Validations.isEmpty('')).toBe(true);
  });

  it('isEmpty should return true for undefined', function () {
    expect(Validations.isEmpty(undefined)).toBe(true);
  });

  it('isEmpty should return true for null', function () {
    expect(Validations.isEmpty(null)).toBe(true);
  });

  it('isEmpty should return false for a space', function () {
    expect(Validations.isEmpty(' ')).toBe(false);
  });

  it('isEmpty should return false for a space', function () {
    expect(Validations.isEmpty(' ')).toBe(false);
  });

  it('isEmpty should return true for empty array', function () {
    expect(Validations.isEmpty([])).toBe(true);
  });




});
