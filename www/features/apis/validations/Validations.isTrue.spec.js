'use strict';

describe('Service: Validations', function () {

  // load the service's module
  beforeEach(module('svBeaconApis'));

  // instantiate service
  var Validations, trues = 'true', trueb = true,
    falseb = false,falses = 'false';

  beforeEach(inject(function (_Validations_) {
    Validations = _Validations_;
  }));

  it('isTrue must be true with string true ', function () {
    expect(Validations.isTrue(trues)).toBe(true);
  });

  it('isTrue must be true with boolean true ', function () {
    expect(Validations.isTrue(trueb)).toBe(true);
  });

  it('isTrue must be false with string false ', function () {
    expect(Validations.isTrue(falses)).toBe(false);
  });

  it('isTrue must be false with boolean false ', function () {
    expect(Validations.isTrue(falseb)).toBe(false);
  });


});
