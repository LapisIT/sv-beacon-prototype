'use strict';

describe('Service: GeoCodes', function () {

  // load the service's module
  beforeEach(module('ridonlineCore'));
  beforeEach(module('googleGeocode'));

  // instantiate service
  var GeoCodes, q, rootScope,resultSuccess = {lat:-32.8306119,lng:147.3189964},
    window,
    validLatLng={lat:-32.8306119,lng:147.3189964};

  beforeEach(inject(function (_GeoCodes_, _$q_, _$rootScope_,_$window_) {
    GeoCodes = _GeoCodes_,
      q = _$q_,
      rootScope = _$rootScope_,
      window = _$window_;

  }));

  beforeEach(function() {
  });

  it('hasValidPoint should be false for empty args', function () {
    expect(GeoCodes.hasValidPoint()).toBe(false);
  });

  it('hasValidPoint should be true for ' , function () {
    expect(GeoCodes.hasValidPoint(validLatLng.lat, validLatLng.lng)).toBe(true);
  });



});
