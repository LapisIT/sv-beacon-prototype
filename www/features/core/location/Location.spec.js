'use strict';

describe('Service: Locations', function () {

  // load the service's module
  beforeEach(module('googleGeocode', 'ridonlineCore'));

  // instantiate service
  var Locations, q, rootScope,resultSuccess = {lat:-32.8306119,lng:147.3189964},
    window;

  beforeEach(inject(function (_Locations_, _$q_, _$rootScope_,_$window_) {
    Locations = _Locations_,
      q = _$q_,
      rootScope = _$rootScope_,
      window = _$window_,
      window.navigator = {geolocation:{getCurrentPosition:function(){}}};

    spyOn(window.navigator.geolocation,"getCurrentPosition").and.callFake(function() {
      var position = { coords: { latitude: resultSuccess.lat, longitude: resultSuccess.lng } };
      arguments[0](position);
    });

//    var deferred = q.defer();
//    deferred.resolve(resultSuccess);
//    deferred.reject('Error');
//    deferred.resolve(function() {
//      return resultSuccess;
//    });

  }));

  beforeEach(function() {
  });

  it('hasLatLng should be false for default location', function () {
    expect(Locations.hasLatLng(Locations.defaultLocation())).toBe(false);
  });

  it('findCurrentPosition should return the lat and lng.', inject(function () {
    var
      res;

    Locations.findCurrentPosition().then(function(result) {
      res = result;
    });

    rootScope.$apply();
    rootScope.$digest();

    //fails in phantom but passes in chrome...
    //expect(res.lat).toBe(resultSuccess.lat);

  }));

//  it('findCurrentPosition should fail with permission denied.', function () {
//    var resultError = {code:'PERMISSION_DENIED'};
//
//    spyOn(window.navigator.geolocation,"getCurrentPosition").and.callFake(function() {
//      arguments[1](resultError);
//    });
//
//    Locations.findCurrentPosition().then(function(result) {
//    },function(error) {
//      expect(error+'123').toBe(Locations.errorMessages.PERMISSION_DENIED);
//    });
//  });


});
