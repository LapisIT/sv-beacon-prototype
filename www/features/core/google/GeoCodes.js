'use strict';
/*
 * https://developers.google.com/maps/documentation/javascript/geocoding
 * */

angular.module('svBeaconPrototype.googleGeocode',[])
  .service('GeoCodes', function GeoCodes($log, $q, mapDefaults) {
    var GeoCodes = {},
    geocoder = new google.maps.Geocoder(),
    RESULTS = mapDefaults.RESULTS_GEOCODES;

    GeoCodes.hasValidPoint = function(lat, lng){
      var latlng = new google.maps.LatLng(lat, lng);
      $log.info('GeoCodes>> hasValidPoint>>latlng ' + latlng);
      return !(latlng.toString().indexOf("NaN") > -1) ;
    };

    function checkIfValid(results, status, deferred) {
      if (hasErrorInReturn(status)) {
        deferred.reject(RESULTS.ERROR_IN_RETURN);
        return false;
      }

      if(!results || !results[0] ) {
        deferred.reject(RESULTS.NO_RESULTS);
        return false;
      }

      if (!addressInNSW(results[0].formatted_address)) {
        deferred.reject(RESULTS.NOT_IN_NSW);
        return false;
      }

      return true;
    }

    GeoCodes.findAddress = function (lat, lng) {
      var deferred = $q.defer();

      if(!GeoCodes.hasValidPoint(lat, lng)) {
        deferred.reject(RESULTS.INVALID_LAT_LNG);
        return deferred.promise;
      }

      var latlng = new google.maps.LatLng(lat, lng);

      $log.info('GeoCodes>> findAddress>>latlng ' + latlng);

      geocoder.geocode({'latLng': latlng}, function (results, status) {
        if(!checkIfValid(results, status, deferred)) {
          return;
        }

        deferred.resolve(results[0].formatted_address);
      });

      return deferred.promise;

    };


    var addressInNSW = function (addressString) {

      var indexNSW = (addressString.indexOf("NSW") > -1);

      if (indexNSW) {
        return true;
      }
      return false;
    };

    var hasErrorInReturn = function (statusVal) {

      if (statusVal == google.maps.GeocoderStatus.OK) {
        $log.info('Reverse Geocoder returned proper value ' + statusVal);
        return false;
      }

      if (statusVal === google.maps.GeocoderStatus.ZERO_RESULTS) {
        $log.info('Reverse Geocoder failed due to: ' + statusVal);
        return true;
      }

      if (statusVal === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
        $log.info('Reverse Geocoder failed due to: ' + statusVal);
        return true;
      }

      $log.info('Reverse Geocoder failed due to: ' + statusVal);
      return true;

    };

    return GeoCodes;


  });
