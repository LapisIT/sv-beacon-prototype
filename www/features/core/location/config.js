angular.module('speciesReporting.location')
  .constant('MapDefaults', (function () {
    var auBounds = {
      northEast: {
        lat: -35.703797,
        lng: 141.213107
      },
      southWest: {
        lat: -28.335434,
        lng: 153.473849
      }
    },
    RESULTS_GEOCODES = {
      INVALID_LAT_LNG:'Please specify the location of the report found by tapping the location in the map',
      NO_RESULTS:'Unable to find a valid address in Australia',
      ERROR_IN_RETURN:'Unable to find a valid address in Australia',
      NOT_IN_AU:'The location specified is not in Australia'
    },
    RESULTS_GPS = {
      PERMISSION_DENIED:'We cannot determine your GPS location. Please ensure GPS is enabled on your device. To turn GPS/Location services on, go to Settings on your device',
      POSITION_UNAVAILABLE:'The GPS is not responding, We cannot get your location information',
      TIMEOUT: 'The GPS request has been timed out, We cannot get your location information.',
      UNKNOWN_ERROR: 'There is an error in GPS request, We cannot get your location information. Please use the pin on the map to select your location.'}
    ;

    return {
      zoomDefault: 6,
      defaultLayers: {
        baselayers: {
          googleRoadmap: {
            name: 'Street',
            layerType: 'ROADMAP',
            type: 'google'
          },
          googleHybrid: {
            name: 'Satellite',
            layerType: 'HYBRID',
            type: 'google'
          },
          googleTerrain: {
            name: 'Terrain',
            layerType: 'TERRAIN',
            type: 'google'
          }
        }
      },
      au: {
        center: {
	        lat: -24.994167,
	        lng: 134.866944,
          zoom: 3
        },
        bounds: auBounds,
        googlePACOptions: {
          componentRestrictions: {
            country: 'au',
            bounds: auBounds
          },
          types: ['geocode']
        }
      },
      RESULTS_GEOCODES: RESULTS_GEOCODES,
      RESULTS_GPS:RESULTS_GPS
    };
  })());
